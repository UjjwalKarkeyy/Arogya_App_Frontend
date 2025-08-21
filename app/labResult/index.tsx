"use client";

import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	SafeAreaView,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://localhost:8000/api/lab-tests/";

interface LabTestData {
	id: string;
	name: string;
	subTests: string[];
	date: string;
	status: string;
}

export default function LabScreen() {
	const router = useRouter();
	const [expanded, setExpanded] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [testData, setTestData] = useState<LabTestData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchTests();
	}, []);

	const fetchTests = async () => {
		try {
			const response = await fetch(API_URL);
			if (!response.ok) {
				throw new Error("Failed to fetch lab tests");
			}
			const data = await response.json();
			setTestData(data);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	};

	const filteredTests = testData.filter((test) =>
		test.name.toLowerCase().includes(search.toLowerCase())
	);

	const renderTestItem = ({ item }: { item: LabTestData }) => (
		<View style={styles.testCard}>
			<TouchableOpacity
				style={styles.testHeader}
				onPress={() => setExpanded(expanded === item.id ? null : item.id)}
			>
				<View style={styles.testInfo}>
					<Text style={styles.testName}>{item.name}</Text>
					<Text style={styles.testDate}>{item.date}</Text>
				</View>
				<View style={styles.testStatus}>
					<View
						style={[
							styles.statusBadge,
							{
								backgroundColor:
									item.status === "Completed" ? "#10b981" : "#f59e0b",
							},
						]}
					>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
					<Ionicons
						name={expanded === item.id ? "chevron-up" : "chevron-down"}
						size={20}
						color="#6b7280"
					/>
				</View>
			</TouchableOpacity>

			{expanded === item.id && (
				<View style={styles.subTestsContainer}>
					{/* Add conditional check here */}
					{item.subTests &&
						item.subTests.map((subTest, index) => (
							<View key={index} style={styles.subTestItem}>
								<Ionicons name="checkmark-circle" size={16} color="#10b981" />
								<Text style={styles.subTestText}>{subTest}</Text>
							</View>
						))}
					<TouchableOpacity
						style={styles.viewReportButton}
						onPress={() => router.push("/labResult/hospital")}
					>
						<Text style={styles.viewReportText}>View Detailed Report</Text>
						<Ionicons name="arrow-forward" size={16} color="#ffffff" />
					</TouchableOpacity>
				</View>
			)}
		</View>
	);

	if (loading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#3b82f6" />
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView style={styles.errorContainer}>
				<Text style={styles.errorText}>Error: {error}</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<LinearGradient colors={["#3b82f6", "#1d4ed8"]} style={styles.header}>
				<Text style={styles.headerTitle}>Lab Tests</Text>
				<Text style={styles.headerSubtitle}>View your test results</Text>
			</LinearGradient>

			<View style={styles.content}>
				<View style={styles.searchContainer}>
					<Ionicons
						name="search"
						size={20}
						color="#6b7280"
						style={styles.searchIcon}
					/>
					<TextInput
						placeholder="Search tests..."
						value={search}
						onChangeText={setSearch}
						style={styles.searchInput}
						placeholderTextColor="#9ca3af"
					/>
				</View>

				<FlatList
					data={filteredTests}
					keyExtractor={(item) => item.id}
					renderItem={renderTestItem}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContainer}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	header: {
		padding: 20,
		paddingTop: 40,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#ffffff",
		marginBottom: 4,
	},
	headerSubtitle: {
		fontSize: 16,
		color: "#e0e7ff",
	},
	content: {
		flex: 1,
		padding: 20,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderRadius: 12,
		paddingHorizontal: 16,
		marginBottom: 20,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	searchIcon: {
		marginRight: 12,
	},
	searchInput: {
		flex: 1,
		paddingVertical: 16,
		fontSize: 16,
		color: "#1f2937",
	},
	listContainer: {
		paddingBottom: 20,
	},
	testCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		marginBottom: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	testHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
	},
	testInfo: {
		flex: 1,
	},
	testName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1f2937",
		marginBottom: 4,
	},
	testDate: {
		fontSize: 14,
		color: "#6b7280",
	},
	testStatus: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#ffffff",
	},
	subTestsContainer: {
		borderTopWidth: 1,
		borderTopColor: "#f3f4f6",
		padding: 16,
	},
	subTestItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
		gap: 8,
	},
	subTestText: {
		fontSize: 14,
		color: "#4b5563",
	},
	viewReportButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#3b82f6",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		marginTop: 12,
		gap: 8,
	},
	viewReportText: {
		color: "#ffffff",
		fontWeight: "600",
		fontSize: 14,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8fafc",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8fafc",
		padding: 20,
	},
	errorText: {
		fontSize: 16,
		color: "red",
		textAlign: "center",
	},
});
