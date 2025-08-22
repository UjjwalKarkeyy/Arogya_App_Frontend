import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { labResultApi } from "../../config/healthApi";

interface ApiReportData {
	id: number;
	test_name: string;
	hospital_name: string;
	hospital_address: string;
	hospital_phone: string;
	date: string;
	status: string;
	results: Array<{
		id: number;
		sub_test_name: string;
		value: string;
		unit: string;
	}>;
}

interface ReportData {
	id: string;
	testName: string;
	date: string;
	hospital: string;
	status: string;
}

export default function ReportScreen() {
	const router = useRouter();
	const { hospital } = useLocalSearchParams();
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchReports();
	}, []);

	const fetchReports = async () => {
		try {
			const data: ApiReportData[] = await labResultApi.getLabReports();

			const transformedData: ReportData[] = data.map((report) => ({
				id: report.id.toString(),
				testName: report.test_name,
				date: report.date,
				hospital: report.hospital_name,
				status: report.status,
			}));

			setReportData(transformedData);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	};

	const renderReportItem = ({ item }: { item: ReportData }) => (
		<TouchableOpacity
			style={styles.reportHeader}
			onPress={() =>
				router.push({
					pathname: "/labResult/reportDetail",
					params: { id: item.id },
				})
			}
		>
			<View style={styles.reportIcon}>
				<Ionicons name="document-text" size={24} color="#8b5cf6" />
			</View>
			<View style={styles.reportInfo}>
				<Text style={styles.testName}>{item.testName}</Text>
				<Text style={styles.hospitalName}>{item.hospital}</Text>
				<Text style={styles.testDate}>{item.date}</Text>
			</View>
			<View style={styles.statusContainer}>
				<View
					style={[
						styles.statusBadge,
						{
							backgroundColor: item.status === "Ready" ? "#10b981" : "#f59e0b",
						},
					]}
				>
					<Text style={styles.statusText}>{item.status}</Text>
				</View>
				<Ionicons name="chevron-forward" size={20} color="#6b7280" />
			</View>
		</TouchableOpacity>
	);

	if (loading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#8b5cf6" />
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

	const filteredReports = hospital
		? reportData.filter((report) => report.hospital === hospital)
		: reportData;

	const totalReports = filteredReports.length;
	const readyReports = filteredReports.filter(
		(report) => report.status === "Ready"
	).length;
	const processingReports = filteredReports.filter(
		(report) => report.status === "Processing"
	).length;

	return (
		<SafeAreaView style={styles.container}>
			<LinearGradient colors={["#8b5cf6", "#7c3aed"]} style={styles.header}>
				<Text style={styles.headerTitle}>Lab Reports</Text>
				<Text style={styles.headerSubtitle}>
					{hospital ? `Reports from ${hospital}` : "View your test reports"}
				</Text>
			</LinearGradient>

			<View style={styles.content}>
				<View style={styles.summaryCard}>
					<Text style={styles.summaryTitle}>Report Summary</Text>
					<View style={styles.summaryStats}>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>{totalReports}</Text>
							<Text style={styles.statLabel}>Total Reports</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>{readyReports}</Text>
							<Text style={styles.statLabel}>Ready</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>{processingReports}</Text>
							<Text style={styles.statLabel}>Processing</Text>
						</View>
					</View>
				</View>

				<Text style={styles.sectionTitle}>Recent Reports</Text>

				<FlatList
					data={filteredReports}
					keyExtractor={(item) => item.id}
					renderItem={renderReportItem}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContainer}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#f8fafc" },
	header: {
		padding: 20,
		paddingTop: 40,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 4,
	},
	headerSubtitle: { fontSize: 16, color: "#e9d5ff" },
	content: { flex: 1, padding: 20 },
	summaryCard: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
		marginBottom: 24,
		elevation: 2,
	},
	summaryTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
	summaryStats: { flexDirection: "row", justifyContent: "space-around" },
	statItem: { alignItems: "center" },
	statNumber: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#8b5cf6",
		marginBottom: 4,
	},
	statLabel: { fontSize: 14, color: "#6b7280" },
	sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
	listContainer: { paddingBottom: 20 },
	reportHeader: { flexDirection: "row", alignItems: "center", padding: 12 },
	reportIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#f3e8ff",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	reportInfo: { flex: 1 },
	testName: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
	hospitalName: { fontSize: 14, color: "#6b7280", marginBottom: 2 },
	testDate: { fontSize: 12, color: "#9ca3af" },
	statusContainer: { alignItems: "center", gap: 8 },
	statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
	statusText: { fontSize: 12, fontWeight: "600", color: "#fff" },
	loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
	errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
	errorText: { fontSize: 16, color: "red" },
});
