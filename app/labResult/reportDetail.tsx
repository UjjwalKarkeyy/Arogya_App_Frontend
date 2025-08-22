"use client";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	SafeAreaView,
	Text,
	View,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { API_BASE_URL } from "../../config/healthApi";

export default function ReportDetail() {
	const { id } = useLocalSearchParams();
	const [report, setReport] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchReport = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/reports/${id}/`);
				if (!response.ok) {
					throw new Error('Failed to fetch report details');
				}
				const data = await response.json();
				setReport(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchReport();
	}, [id]);

	if (loading) {
		return (
			<SafeAreaView style={styles.center}>
				<ActivityIndicator size="large" color="#8b5cf6" />
			</SafeAreaView>
		);
	}

	if (!report) {
		return (
			<SafeAreaView style={styles.center}>
				<Text>No report found</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				{/* Header Section */}
				<View style={styles.header}>
					<Text style={styles.hospitalName}>{report.hospital_name}</Text>
					<Text style={styles.hospitalInfo}>{report.hospital_address}</Text>
					<Text style={styles.hospitalInfo}>
						Phone: {report.hospital_phone}
					</Text>
				</View>

				{/* Report Metadata */}
				<View style={styles.metaSection}>
					<Text style={styles.reportTitle}>{report.test_name}</Text>
					<View style={styles.metaRow}>
						<Text style={styles.metaLabel}>Date:</Text>
						<Text style={styles.metaValue}>{report.date}</Text>
					</View>
					<View style={styles.metaRow}>
						<Text style={styles.metaLabel}>Status:</Text>
						<Text style={styles.metaValue}>{report.status}</Text>
					</View>
				</View>

				{/* Divider */}
				<View style={styles.divider} />

				{/* Results Section */}
				<View style={styles.resultsSection}>
					<Text style={styles.sectionTitle}>Test Results</Text>
					<View style={styles.resultsTable}>
						<View style={styles.tableHeader}>
							<Text
								style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}
							>
								Sub-Test
							</Text>
							<Text style={[styles.tableCell, styles.tableHeaderText]}>
								Value
							</Text>
							<Text style={[styles.tableCell, styles.tableHeaderText]}>
								Unit
							</Text>
						</View>

						{report.results.map((res: any) => (
							<View key={res.id} style={styles.tableRow}>
								<Text style={[styles.tableCell, { flex: 2 }]}>
									{res.sub_test_name}
								</Text>
								<Text style={styles.tableCell}>{res.value}</Text>
								<Text style={styles.tableCell}>{res.unit}</Text>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#f9fafb" },
	center: { flex: 1, justifyContent: "center", alignItems: "center" },

	// Header
	header: {
		backgroundColor: "#8b5cf6",
		padding: 16,
		borderBottomLeftRadius: 12,
		borderBottomRightRadius: 12,
		alignItems: "center",
	},
	hospitalName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
	hospitalInfo: { fontSize: 14, color: "#e0e7ff" },

	// Metadata
	metaSection: {
		padding: 20,
		backgroundColor: "#fff",
		margin: 12,
		borderRadius: 10,
		elevation: 2,
	},
	reportTitle: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#111827",
	},
	metaRow: { flexDirection: "row", marginBottom: 6 },
	metaLabel: { fontSize: 16, fontWeight: "600", color: "#374151", width: 80 },
	metaValue: { fontSize: 16, color: "#4b5563" },

	divider: {
		height: 1,
		backgroundColor: "#e5e7eb",
		marginHorizontal: 12,
		marginVertical: 10,
	},

	// Results
	resultsSection: {
		padding: 20,
		backgroundColor: "#fff",
		margin: 12,
		borderRadius: 10,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 12,
		color: "#111827",
	},

	resultsTable: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8 },
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "#f3f4f6",
		borderBottomWidth: 1,
		borderColor: "#d1d5db",
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: "#e5e7eb",
	},
	tableCell: { flex: 1, padding: 10, fontSize: 14, color: "#111827" },
	tableHeaderText: { fontWeight: "bold", color: "#374151" },
});
