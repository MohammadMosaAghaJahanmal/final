import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const colors = {
  primary: "#0B1220",
  accent: "#F59E0B",
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  cardBg: "#111827",
};

const sensors = [
  { key: "light", name: "Light", icon: "sunny-outline", color: "#F59E0B", current: [5, 8, 10, 12, 11], previous: [4, 6, 9, 10, 10] },
  { key: "temp", name: "Temp", icon: "thermometer-outline", color: "#FF6384", current: [15, 16, 17, 18, 19], previous: [14, 15, 16, 17, 18] },
  { key: "curr", name: "Curr", icon: "battery-charging-outline", color: "#4BC0C0", current: [1, 1.5, 2, 2.2, 2], previous: [1, 1, 1.5, 2, 1.8] },
  { key: "angle", name: "Sun Angle", icon: "sunny-outline", color: "#FFCE56", current: [30, 32, 35, 38, 40], previous: [28, 30, 32, 36, 38] },
];

export default function Sensors() {
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [hoverAnim] = useState(new Animated.Value(1));

  const onPressIn = () =>
    Animated.spring(hoverAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(hoverAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  const toLineData = (arr) =>
    arr.map((val, index) => ({
      value: val,
      label: `${index + 1}`,
    }));

  
  const cardHeight = (screenHeight - 190) / sensors.length;

  return (
    <View style={styles.container}>
      {sensors.map((s) => (
        <Animated.View
          key={s.key}
          style={[
            styles.sensorCard,
            {
              height: cardHeight,
              transform: [{ scale: hoverAnim }],
              shadowColor: s.color,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => setSelectedSensor(s)}
            style={styles.sensorTouchable}
          >
            <View style={[styles.iconCircle, { backgroundColor: s.color + "22" }]}>
              <Ionicons name={s.icon} size={34} color={s.color} />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.sensorLabel}>{s.name}</Text>
              <Text style={[styles.sensorValue, { color: s.color }]}>
                {s.current[s.current.length - 1]}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}

      <Modal
        visible={!!selectedSensor}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedSensor(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSensor && (
              <>
                <TouchableOpacity
                  style={styles.topRightClose}
                  onPress={() => setSelectedSensor(null)}
                >
                  <Ionicons name="close" size={26} color={colors.accent} />
                </TouchableOpacity>

                <Ionicons
                  name={selectedSensor.icon}
                  size={46}
                  color={selectedSensor.color}
                />

                <Text style={styles.modalSensorName}>
                  {selectedSensor.name}
                </Text>

                <View style={styles.chartCard}>
                  <LineChart
                    data={toLineData(selectedSensor.current)}
                    data2={toLineData(selectedSensor.previous)}
                    width={screenWidth * 0.60}
                    height={200}
                    curved
                    color="#FACC15"
                    color2="#3B82F6"
                    hideDataPoints
                    thickness={3}
                    thickness2={3}
                    yAxisTextStyle={{ color: colors.textSecondary }}
                    xAxisLabelTextStyle={{ color: colors.textSecondary }}
                    rulesColor="#1F2937"
                    noOfSections={5}
                    initialSpacing={10}
                    spacing={40}
                  />

                  <View style={styles.legend}>
                    <View style={styles.legendItem}>
                      <View style={[styles.dot, { backgroundColor: "#FACC15" }]} />
                      <Text style={styles.legendText}>Current</Text>
                    </View>

                    <View style={styles.legendItem}>
                      <View style={[styles.dot, { backgroundColor: "#3B82F6" }]} />
                      <Text style={styles.legendText}>Previous</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 12,
  },
  sensorCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    justifyContent: "center",
    elevation: 6,
    marginVertical: 6,
  },
  sensorTouchable: {
    alignItems: "center",
    paddingVertical: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  textWrap: {
    alignItems: "center",
  },
  sensorLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "92%",
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
  },
  topRightClose: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#1F2937",
    borderRadius: 20,
    padding: 4,
  },
  modalSensorName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },

  chartCard: {
    width: "90%",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
  },

  legend: {
    flexDirection: "row",
    marginTop: 10,
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});