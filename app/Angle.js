import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform, Alert } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { LanguageContext } from "./LanguageContext";
import axios from "axios";

const colors = {
  primary: "#0F172A",
  accent: "#F59E0B",
  card: "#1E293B",
  textPrimary: "#FFFFFF",
  textSecondary: "#CBD5E1",
};

const translations = {
  en: { title: "Solar Angle Control", auto: "Auto Tracking", autoDesc: "Solar panel automatically follows the sun", manual: "Manually Change Angle" },
  ps: { title: "د سولر زاویې کنټرول", auto: "اتومات تعقیب", autoDesc: "سولر پینل په اتومات ډول د لمر تعقیب کوي", manual: "په لاس زاویه بدلول" },
  dr: { title: "کنترول زاویه سولر", auto: "تعقیب خودکار", autoDesc: "پنل سولر به طور خودکار خورشید را تعقیب میکند", manual: "تغییر دستی زاویه" },
};

export default function Angle() {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  const [autoMode, setAutoMode] = useState(true);
  const [angle, setAngle] = useState(30);

  // Function to send manual angle to ESP32
  const sendAngleToESP = async (newAngle) => {
    try {
      // ESP32 endpoint
      const response = await axios.post("http://192.168.4.1/set-angle", { angle: newAngle });
      console.log("ESP32 Response:", response.data);
    } catch (error) {
      console.log("Error sending angle to ESP32:", error);
      if (Platform.OS === "android" || Platform.OS === "ios") {
        Alert.alert("Error", "Cannot send angle to ESP32. Make sure WiFi is connected.");
      }
    }
  };

  // Update angle handler
  const handleAngleChange = (value) => {
    setAngle(value);
    sendAngleToESP(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.title}</Text>

      {/* Auto Mode Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="sync-circle" size={28} color={colors.accent} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>{t.auto}</Text>
            <Text style={styles.cardSubtitle}>{t.autoDesc}</Text>
          </View>
          <Switch
            value={autoMode}
            onValueChange={setAutoMode}
            trackColor={{ true: "#22C55E", false: "#475569" }}
          />
        </View>
      </View>

      {/* Manual Angle Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t.manual}</Text>

        <View style={styles.angleBox}>
          <Ionicons name="sunny" size={40} color={colors.accent} />
          <Text style={styles.angleText}>{angle}°</Text>
        </View>

        <Slider
          minimumValue={0}
          maximumValue={90}
          step={1}
          value={angle}
          disabled={autoMode}
          onValueChange={handleAngleChange}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor="#475569"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.btn, autoMode && styles.disabled]}
            onPress={() => handleAngleChange(Math.max(angle - 1, 0))}
            disabled={autoMode}
          >
            <Ionicons name="remove" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, autoMode && styles.disabled]}
            onPress={() => handleAngleChange(Math.min(angle + 1, 90))}
            disabled={autoMode}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: colors.textPrimary, marginBottom: 20 },
  card: { backgroundColor: colors.card, padding: 20, borderRadius: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  row: { flexDirection: "row", alignItems: "center" },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  cardSubtitle: { color: "#94A3B8", fontSize: 12 },
  sectionTitle: { color: "#fff", fontSize: 18, marginBottom: 15 },
  angleBox: { alignItems: "center", marginBottom: 10 },
  angleText: { fontSize: 32, color: "#fff", fontWeight: "700", marginTop: 5 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  btn: { backgroundColor: "#334155", padding: 12, borderRadius: 10, width: 70, alignItems: "center" },
  disabled: { opacity: 0.3 }
});