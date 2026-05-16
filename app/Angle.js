import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const colors = {
  primary: "#0F172A",
  accent: "#F59E0B",
  card: "#1E293B",
  textPrimary: "#FFFFFF",
  textSecondary: "#CBD5E1",
};

export default function Angle() {
  const { t } = useTranslation();

  // TRUE = AUTO MODE
  // FALSE = MANUAL MODE
  const [autoMode, setAutoMode] = useState(true);

  const [angle, setAngle] = useState(90);

  // =========================
  // SEND JSON TO ESP32
  // =========================
  const sendToESP32 = async (jsonData) => {
    try {
      const response = await axios.post(
        "http://192.168.4.1/control",
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ESP32:", response.data);

    } catch (error) {

      console.log("ESP32 Error:", error);

      if (Platform.OS === "android" || Platform.OS === "ios") {
        Alert.alert(
          t("angle.error"),
          t("angle.errorDesc")
        );
      }
    }
  };

  // =========================
  // AUTO SWITCH
  // =========================
  const handleAutoToggle = async (value) => {

    setAutoMode(value);

    // SEND AUTO STATUS TO ESP32
    await sendToESP32({
      auto: value,
    });
  };

  // =========================
  // SLIDER ANGLE
  // =========================
  const handleAngleChange = async (value) => {

    setAngle(value);

    // ONLY MANUAL
    await sendToESP32({
      auto: false,
      angle: value,
    });
  };

  // =========================
  // LEFT BUTTON
  // =========================
  const moveLeft = async () => {

    const newAngle = Math.max(angle - 1, 0);

    setAngle(newAngle);

    await sendToESP32({
      auto: false,
      angle: newAngle,
      direction: "left",
    });
  };

  // =========================
  // RIGHT BUTTON
  // =========================
  const moveRight = async () => {

    const newAngle = Math.min(angle + 1, 180);

    setAngle(newAngle);

    await sendToESP32({
      auto: false,
      angle: newAngle,
      direction: "right",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("angle.title")}
      </Text>

      {/* AUTO MODE */}
      <View style={styles.card}>
        <View style={styles.row}>

          <Ionicons
            name="sync-circle"
            size={28}
            color={colors.accent}
          />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>
              {t("angle.auto")}
            </Text>

            <Text style={styles.cardSubtitle}>
              {t("angle.autoDesc")}
            </Text>
          </View>

          <Switch
            value={autoMode}
            onValueChange={handleAutoToggle}
            trackColor={{
              true: "#22C55E",
              false: "#475569",
            }}
          />
        </View>
      </View>

      {/* MANUAL MODE */}
      <View style={styles.card}>

        <Text style={styles.sectionTitle}>
          {t("angle.manual")}
        </Text>

        <View style={styles.angleBox}>

          <Ionicons
            name="sunny"
            size={40}
            color={colors.accent}
          />

          <Text style={styles.angleText}>
            {angle}°
          </Text>
        </View>

        <Slider
          minimumValue={0}
          maximumValue={180}
          step={1}
          value={angle}
          disabled={autoMode}
          onValueChange={handleAngleChange}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor="#475569"
        />

        {/* BUTTONS */}
        <View style={styles.buttonRow}>

          {/* LEFT */}
          <TouchableOpacity
            style={[
              styles.btn,
              autoMode && styles.disabled,
            ]}
            onPress={moveLeft}
            disabled={autoMode}
          >
            <Ionicons
              name="remove"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          {/* RIGHT */}
          <TouchableOpacity
            style={[
              styles.btn,
              autoMode && styles.disabled,
            ]}
            onPress={moveRight}
            disabled={autoMode}
          >
            <Ionicons
              name="add"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 20,
  },

  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  cardSubtitle: {
    color: "#94A3B8",
    fontSize: 12,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 15,
  },

  angleBox: {
    alignItems: "center",
    marginBottom: 10,
  },

  angleText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "700",
    marginTop: 5,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  btn: {
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 10,
    width: 70,
    alignItems: "center",
  },

  disabled: {
    opacity: 0.3,
  },
});