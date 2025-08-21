import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { Svg, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Button,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { 
  HealthCenter, 
  HealthCenterData, 
  MedicineData, 
  DiseaseMedicines
} from "./types";

// Lazy import for mobile-only react-native-maps
let MapView: any, Marker: any, PROVIDER_DEFAULT: any;
if (Platform.OS !== "web") {
  const RnMaps = require("react-native-maps");
  MapView = RnMaps.default;
  Marker = RnMaps.Marker;
  PROVIDER_DEFAULT = RnMaps.PROVIDER_DEFAULT;
}

// Import JSON data
const healthCentersData = require('./Screens/list_of_health_centers.json') as HealthCenterData[];
const medicinesData = require('./Screens/medicines.json') as MedicineData;
const diseaseMedicinesData = require('./Screens/disease_medicines.json') as DiseaseMedicines;

const freeMedicines = medicinesData.medicines;

// Assign random medicines to centers
function assignMedicinesToCenters(healthCenters: HealthCenterData[]): HealthCenter[] {
  const meds = [...freeMedicines, ...Object.values(diseaseMedicinesData).flat()];
  return healthCenters.map((center) => {
    const count = Math.floor(Math.random() * 4) + 3;
    const availableMedicines: string[] = [];
    while (availableMedicines.length < count) {
      const med = meds[Math.floor(Math.random() * meds.length)];
      if (med && !availableMedicines.includes(med)) availableMedicines.push(med);
    }
    return {
      id: center.uuid,
      name: center.name,
      address: center.properties?.address || 'Address not available',
      latitude: parseFloat(center.coordinates.latitude),
      longitude: parseFloat(center.coordinates.longitude),
      availableMedicines,
      properties: center.properties || {}
    };
  });
}

// Open OpenStreetMap
const openOSMSearch = (latitude: number, longitude: number) => {
  const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
  Linking.openURL(url);
};

interface MapComponentProps {
  style: any;
  center: { latitude: number; longitude: number };
  markers: HealthCenter[];
  onPressMarker: (center: HealthCenter) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  style,
  center,
  markers,
  onPressMarker,
}) => {
  if (Platform.OS === 'web') {
    // For web, show a simple view with a message
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
        <Text>Map view is not available on web. Click on "View on Map" to open in OpenStreetMap.</Text>
      </View>
    );
  }

  // For mobile, show the actual map
  return (
    <MapView
      style={style}
      initialRegion={{
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      provider={PROVIDER_DEFAULT}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.name}
          description={`Medicines: ${marker.availableMedicines.join(", ")}`}
          onPress={() => onPressMarker(marker)}
        />
      ))}
    </MapView>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState("freeMedicines");
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [uploadedFile, setUploadedFile] = useState<null | {
    name: string;
    type: string;
    size: number;
    uri: string;
  }>(null);
  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [centerSearch, setCenterSearch] = useState("");
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    Animated.spring(slideAnim, { toValue: 0, bounciness: 12, useNativeDriver: true }).start();

    // Filter out inactive centers and those without coordinates
    const activeCenters = healthCentersData.filter(
      (center: any) => 
        center.active === true || 
        center.active === "true" && 
        center.coordinates?.latitude && 
        center.coordinates?.longitude
    );

    setHealthCenters(assignMedicinesToCenters(activeCenters));
  }, []);

  const handleFileUpload = async () => {
    try {
      // Using type assertion to handle the DocumentPicker response
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      }) as unknown as {
        type: string;
        name?: string;
        mimeType?: string;
        size?: number;
        uri: string;
      };

      if (result && result.uri) {
        setUploadedFile({
          name: result.name || 'document',
          type: result.mimeType || 'application/octet-stream',
          size: result.size || 0,
          uri: result.uri
        });
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  // Filtered lists
  const filteredMedicines = freeMedicines.filter((med) =>
    med.toLowerCase().includes(search.toLowerCase())
  );

  const centersWithMedicine = selectedMedicine
    ? healthCenters.filter((center) => center.availableMedicines.includes(selectedMedicine))
    : [];

  const getDiseaseMedicines = (disease: string) => {
    return diseaseMedicinesData[disease as keyof typeof diseaseMedicinesData] || [];
  };
  const medicinesForDisease = selectedDisease ? getDiseaseMedicines(selectedDisease) : [];
  const centersForDisease = selectedDisease
    ? healthCenters.filter((center) =>
        medicinesForDisease.some((med) => center.availableMedicines.includes(med))
      )
    : [];

  const handleMarkerPress = (center: HealthCenter) => {
    setSelectedCenter(center);
    setModalVisible(true);
  };

  const filteredCenters = healthCenters.filter((center) =>
    center.name.toLowerCase().includes(centerSearch.toLowerCase())
  );

  const renderMedicineItem = ({ item, index }: { item: string; index: number }) => (
    <Animated.View
      style={[
        styles.medicineItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.medicineText}>{item}</Text>
    </Animated.View>
  );

  const renderDiseaseMedicines = () => {
    if (!selectedDisease) return null;
    const medicines = getDiseaseMedicines(selectedDisease);
    return (
      <View style={styles.medicinesContainer}>
        <Text style={styles.sectionTitle}>Medicines for {selectedDisease}:</Text>
        <FlatList
          data={medicines}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.medicineItem}>
              <Text style={styles.medicineText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: "#E8F5E9" }]} contentContainerStyle={{ paddingTop: 50 }}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
        
        {/* Title */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: "center", marginBottom: 30 }}
        >
          <View style={styles.titleBox}>
            <Text style={styles.title}>💊 Free Medicine by Nepal Govt</Text>
          </View>
          <Text style={styles.subtitle}>Your trusted health partner</Text>
        </Animated.View>

        {/* Navigation */}
        <View style={styles.nav}>
          <Button
            title="All Medicines"
            onPress={() => { setActiveSection("freeMedicines"); setSelectedMedicine(""); setSearch(""); }}
            color={activeSection === "freeMedicines" ? "#0A6847" : "#A5D6A7"}
          />
          <Button
            title="Disease Check"
            onPress={() => { setActiveSection("diseaseMedicines"); setSelectedDisease(""); }}
            color={activeSection === "diseaseMedicines" ? "#0A6847" : "#A5D6A7"}
          />
          <Button
            title="Health Centers"
            onPress={() => setActiveSection("locations")}
            color={activeSection === "locations" ? "#0A6847" : "#A5D6A7"}
          />
        </View>

        {/* Free Medicines Section */}
        {activeSection === "freeMedicines" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Search Medicines</Text>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <TextInput
                style={styles.input}
                placeholder="Type medicine name..."
                value={search}
                onChangeText={(text) => { setSearch(text); setSelectedMedicine(""); }}
              />
            </Animated.View>

            <FlatList
              data={filteredMedicines}
              keyExtractor={(item) => item}
              renderItem={renderMedicineItem}
              scrollEnabled={false}
            />

            {selectedMedicine && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.sectionTitle}>📦 {selectedMedicine} is available at:</Text>
                {centersWithMedicine.length === 0 && <Text style={styles.infoText}>❌ Not available in listed centers.</Text>}
                {centersWithMedicine.map((center) => (
                  <View key={center.id} style={styles.centerRow}>
                    <Text style={styles.centerName} numberOfLines={2} ellipsizeMode="tail">{center.name}</Text>
                    <TouchableOpacity onPress={() => openOSMSearch(center.latitude, center.longitude)} style={styles.mapButton}>
                      <Text style={styles.mapButtonText}>View on Map</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Disease Medicines Section */}
        {activeSection === "diseaseMedicines" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🩺 Select Disease</Text>
            <Picker selectedValue={selectedDisease} onValueChange={setSelectedDisease} style={styles.picker}>
              <Picker.Item label="-- Select Disease --" value="" />
              {Object.keys(diseaseMedicinesData).map((disease) => (
                <Picker.Item key={disease} label={disease} value={disease} />
              ))}
            </Picker>

            <TouchableOpacity onPress={handleFileUpload} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>📄 Upload Hospital Report</Text>
            </TouchableOpacity>
            {uploadedFile && <Text style={styles.fileInfo}>Uploaded: {uploadedFile.name}</Text>}

            {selectedDisease && (
              <View style={{ marginTop: 20 }}>
                {renderDiseaseMedicines()}

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>📍 Available at Centers:</Text>
                {centersForDisease.length === 0 && <Text style={styles.infoText}>❌ Not available in listed centers.</Text>}
                {centersForDisease.map((center) => (
                  <View key={center.id} style={styles.centerRow}>
                    <Text style={styles.centerName} numberOfLines={2} ellipsizeMode="tail">{center.name}</Text>
                    <TouchableOpacity onPress={() => openOSMSearch(center.latitude, center.longitude)} style={styles.mapButton}>
                      <Text style={styles.mapButtonText}>View on Map</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Health Centers Section */}
        {activeSection === "locations" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Health Centers Map</Text>
            <TextInput style={styles.input} placeholder="Search Health Center..." value={centerSearch} onChangeText={setCenterSearch} />

            <MapComponent
              style={{ width: "100%", height: 400, borderRadius: 12 }}
              center={{
                latitude: healthCenters.length ? healthCenters[0].latitude : 27.7172,
                longitude: healthCenters.length ? healthCenters[0].longitude : 85.324,
              }}
              markers={filteredCenters}
              onPressMarker={handleMarkerPress}
            />

            {selectedCenter && modalVisible && (
              <View style={styles.modalContainer}>
                <Text style={styles.sectionTitle}>{selectedCenter.name}</Text>
                <Text style={styles.infoText}>Available Medicines: {selectedCenter.availableMedicines.join(", ")}</Text>
                <Button title="Open in OSM" onPress={() => openOSMSearch(selectedCenter.latitude, selectedCenter.longitude)} />
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#E8F5E9", 
    paddingHorizontal: 16, 
    paddingTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  backButtonText: {
    color: '#0A6847',
    fontWeight: 'bold',
  },
  titleBox: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 5,
  },
  medicineItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  medicineText: {
    fontSize: 16,
    color: '#333',
  },
  medicinesContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "white", 
    textAlign: "center" 
  },
  subtitle: { 
    fontSize: 16, 
    color: "#388E3C", 
    textAlign: "center", 
    marginBottom: 25 
  },
  nav: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 30 
  },
  section: { 
    marginBottom: 30 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 15, 
    color: "#0A6847", 
    textAlign: "center" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 12, 
    fontSize: 16, 
    backgroundColor: "white", 
    elevation: 2 
  },
  listItem: { 
    backgroundColor: "#F1F8E9", 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 10, 
    elevation: 2 
  },
  selectedListItem: { 
    backgroundColor: "#A5D6A7" 
  },
  picker: { 
    backgroundColor: "white", 
    borderRadius: 8, 
    marginVertical: 12, 
    elevation: 2 
  },
  centerRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 12 
  },
  centerName: { 
    fontWeight: "bold", 
    fontSize: 16, 
    color: "#0A6847", 
    flexShrink: 1 
  },
  mapButton: { 
    backgroundColor: "#388E3C", 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8, 
    marginLeft: 10 
  },
  mapButtonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  fileInfo: { 
    marginVertical: 5, 
    fontStyle: "italic", 
    color: "#555" 
  },
  boldText: { 
    marginTop: 10, 
    fontWeight: "bold" 
  },
  infoText: { 
    marginVertical: 5, 
    fontStyle: "italic", 
    color: "#555" 
  },
  modalContainer: { 
    backgroundColor: "#fff", 
    padding: 16, 
    borderRadius: 12, 
    elevation: 5, 
    marginTop: 10 
  },
  uploadButton: { 
    backgroundColor: "#0A6847", 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 10, 
    alignItems: "center", 
    marginTop: 10 
  },
  uploadButtonText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});
