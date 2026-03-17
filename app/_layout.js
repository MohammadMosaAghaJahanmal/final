import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import Sensors from "./Sensors";
import Setting from "./Setting";
import Angle from "./Angle";
import { LanguageContext } from "./LanguageContext";

import WifiManager from "react-native-wifi-reborn";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;

const colors = {
  primary: "#0B1220",
  accent: "#F59E0B",
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  card: "#111827",
  success: "#22C55E"
};

const sensors = [
  { key: "light", name: "Light", icon: "sunny-outline", color: "#F59E0B" },
  { key: "temp", name: "Temp", icon: "thermometer-outline", color: "#FF6384" },
  { key: "curr", name: "Curr", icon: "battery-charging-outline", color: "#4BC0C0" },
  { key: "angle", name: "Angle", icon: "sunny-outline", color: "#FACC15" }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [wifiOn, setWifiOn] = useState(false);
  const { language } = useContext(LanguageContext);
  const [liveDataInterval, setLiveDataInterval] = useState(null);

  const graphValues = {
    light: [5, 10, 8, 12, 9],
    temp: [15, 17, 16, 18, 19],
    curr: [1, 2, 1.5, 2, 2.2],
    angle: [30, 35, 32, 40, 38]
  };

  const graphData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      { data: graphValues.light, color: () => "#F59E0B" },
      { data: graphValues.temp, color: () => "#FF6384" },
      { data: graphValues.curr, color: () => "#4BC0C0" },
      { data: graphValues.angle, color: () => "#FACC15" }
    ],
    legend: ["Light", "Temp", "Curr", "Angle"]
  };

  // Live Data Fetch Function
  const startLiveData = async () => {
    try {
      if (Platform.OS === "android") {
        await WifiManager.setEnabled(true); // Android WiFi ON
      }

      await WifiManager.connectToSSID("ESP32_HOTSPOT", "12345678");
      console.log("Connected to ESP32 WiFi");

      const interval = setInterval(async () => {
        try {
          const { data } = await axios.get("http://192.168.4.1/sensors");
          console.log("Live Sensor Data:", data);

          // POST to backend
          await axios.post("https://yourbackend.com/api/sensors", data);

        } catch (err) {
          console.log("Error fetching sensor data:", err);
        }
      }, 2000);

      setLiveDataInterval(interval);
    } catch (error) {
      console.log("WiFi connection error:", error);
    }
  };

  const stopLiveData = () => {
    if (liveDataInterval) {
      clearInterval(liveDataInterval);
      setLiveDataInterval(null);
    }
  };

  // WiFi Button Handler
  const handleWifiToggle = () => {
    setWifiOn(!wifiOn);
    if (!wifiOn) {
      startLiveData();
    } else {
      stopLiveData();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={[styles.topTitle, {marginTop: 23}]}>{activeTab}</Text>
      </View>

      {activeTab === "Overview" && (
        <View style={{ flex: 1 }}>
          {/* WIFI  */}
          <View style={styles.wifiContainer}>
            <TouchableOpacity
              style={[styles.wifiBtn, { backgroundColor: wifiOn ? "#052e1f" : "#1f2937" }]}
              onPress={handleWifiToggle}
            >
              <Ionicons
                name="wifi"
                size={18}
                color={wifiOn ? colors.success : colors.textSecondary}
              />
              <Text style={{ color: wifiOn ? colors.success : colors.textSecondary, marginLeft: 6 }}>
                WiFi
              </Text>
            </TouchableOpacity>
          </View>

          {/* CARDS */}
          <View style={styles.cardGrid}>
            {sensors.map((s, index) => {
              const value = graphValues[s.key].slice(-1)[0];
              return (
                <View
                  key={s.key}
                  style={[
                    styles.sensorCard,
                    index === sensors.length - 1 && { alignSelf: "center" }
                  ]}
                >
                  <Ionicons name={s.icon} size={28} color={s.color} />
                  <Text style={styles.sensorValue}>{value}</Text>
                  <Text style={styles.sensorName}>{s.name}</Text>
                </View>
              );
            })}
          </View>

          {/* CHART */}
          <View style={[styles.chartCard, {backgroundColor: colors.secondary}]}>
            <LineChart
              data={graphData}
              width={screenWidth - 40}
              height={300}
              chartConfig={{
                backgroundGradientFrom: "#0B1220",
                backgroundGradientTo: "#0B1220",
                color: () => "#fff",
                labelColor: () => "#94A3B8",
                propsForDots: { r: "0" }
              }}
              bezier
              withDots={false}
              withShadow={false}
              style={{ borderRadius: 16 }}
            />
          </View>

        </View>
      )}

      {activeTab === "Sensors" && <Sensors language={language} />}
      {activeTab === "Angle" && <Angle />}
      {activeTab === "Setting" && <Setting />}

      {/* BOTTOM NAV */}
      <View style={styles.bottomBar}>
        {["Overview", "Sensors", "Angle", "Setting"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={styles.tabItem}
          >
            <Ionicons
              name={
                tab === "Overview"
                  ? "home-outline"
                  : tab === "Sensors"
                  ? "pulse-outline"
                  : tab === "Angle"
                  ? "sunny-outline"
                  : "settings-outline"
              }
              size={24}
              color={activeTab === tab ? colors.accent : colors.textSecondary}
            />
            <Text style={{
              color: activeTab === tab ? colors.accent : colors.textSecondary,
              fontSize: 12,
              marginTop: 2
            }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  topBar: { backgroundColor: colors.card, padding: 16, alignItems: "center", borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  topTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  wifiContainer: { alignItems: "center", marginTop: 6, marginBottom: 4 },
  wifiBtn: { flexDirection: "row", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, alignItems: "center" },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 12, marginTop: 4 },
  sensorCard: { width: "48%", backgroundColor: colors.card, borderRadius: 18, paddingVertical: 22, marginBottom: 10, alignItems: "center" },
  sensorValue: { fontSize: 22, color: "#fff", fontWeight: "700", marginTop: 6 },
  sensorName: { color: colors.textSecondary, fontSize: 13 },
  chartCard: { flex: 1, marginHorizontal: 12, marginTop: 6, marginBottom: 6, backgroundColor: colors.card, borderRadius: 18, padding: 10, justifyContent: "center" },
  bottomBar: { flexDirection: "row", justifyContent: "space-around", backgroundColor: colors.card, paddingVertical: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  tabItem: { alignItems: "center", justifyContent: "center" }
});