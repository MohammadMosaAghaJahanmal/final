import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";

const colors = {
  primary: "#0F172A",
  textPrimary: "#FFFFFF",
  textSecondary: "#CBD5E1",
  accent: "#F59E0B",
  bgCard: "rgba(255,255,255,0.08)",
};

const translations = {
  en: {
    setting: "Settings",
    changeLanguage: "Change Language",
    wifiPassword: "Change WiFi Password",
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updatePassword: "Update Password",
    languages: { en: "English", ps: "پښتو", dr: "دري" },
  },
  ps: {
    setting: "تنظیمات",
    changeLanguage: "ژبه بدل کړئ",
    wifiPassword: "د وای فای پاسورډ بدلول",
    oldPassword: "زړې پاسورډ",
    newPassword: "نوې پاسورډ",
    confirmPassword: "پاسورډ تایید کړئ",
    updatePassword: "پاسورډ تازه کړئ",
    languages: { en: "English", ps: "پښتو", dr: "دري" },
  },
  dr: {
    setting: "تنظیمات",
    changeLanguage: "تغییر زبان",
    wifiPassword: "تغییر رمز وای فای",
    oldPassword: "رمز قدیمی",
    newPassword: "رمز جدید",
    confirmPassword: "تأیید رمز",
    updatePassword: "بروز رسانی رمز",
    languages: { en: "English", ps: "پښتو", dr: "دري" },
  },
};

export default function Setting() {
  const [language, setLanguage] = useState("en");
  const [wifiModal, setWifiModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const t = translations[language];

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary, marginTop: 10 }]}>
        {t.setting}
      </Text>

      {/* Change Language */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t.changeLanguage}
        </Text>
        <View style={styles.languageButtons}>
          {Object.entries(t.languages).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.langButton,
                language === key && styles.langButtonActive,
              ]}
              onPress={() => setLanguage(key)}
            >
              <Text style={language === key ? styles.langTextActive : styles.langText}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Change WiFi Password */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t.wifiPassword}
        </Text>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => setWifiModal(true)}
        >
          <Text style={styles.updateButtonText}>{t.wifiPassword}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={wifiModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {t.wifiPassword}
            </Text>
            <TextInput
              placeholder={t.oldPassword}
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              secureTextEntry
              value={oldPass}
              onChangeText={setOldPass}
            />
            <TextInput
              placeholder={t.newPassword}
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              secureTextEntry
              value={newPass}
              onChangeText={setNewPass}
            />
            <TextInput
              placeholder={t.confirmPassword}
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              secureTextEntry
              value={confirmPass}
              onChangeText={setConfirmPass}
            />
            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>{t.updatePassword}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setWifiModal(false)}
              style={[styles.updateButton, { backgroundColor: "#64748B", marginTop: 10 }]}
            >
              <Text style={styles.updateButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 15 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  languageButtons: { flexDirection: "row" },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#1E293B",
    marginRight: 10,
  },
  langButtonActive: { backgroundColor: "#F59E0B" },
  langText: { color: "#CBD5E1", fontWeight: "500" },
  langTextActive: { color: "#0F172A", fontWeight: "700" },
  updateButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  updateButtonText: { color: "#0F172A", fontWeight: "700", textAlign: "center" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#1E293B",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 15, textAlign: "center" },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    marginBottom: 10,
  },
});