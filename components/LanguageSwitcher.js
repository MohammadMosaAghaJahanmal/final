import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const colors = {
  primary: "#0B1220",
  accent: "#F59E0B",
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  card: "#111827",
};

const LanguageSwitcher = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ps", name: "پښتو", flag: "🇦🇫" },
    { code: "dr", name: "دری", flag: "🇦🇫" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>{t("common.language")}</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.option,
                i18n.language === lang.code && styles.selected,
              ]}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={styles.langName}>{lang.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
  },
  selected: {
    backgroundColor: colors.accent,
  },
  flag: {
    fontSize: 24,
    marginRight: 15,
  },
  langName: {
    fontSize: 18,
    color: colors.textPrimary,
  },
});

export default LanguageSwitcher;
