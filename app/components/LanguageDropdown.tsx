import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import constants from "../config/constants";

const LanguageDropdown = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const { t, i18n } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(constants.STORE_LANGUAGE_KEY).then((language:any) => {
        const label =
          languages.findLast((lang) => lang.code === language)?.label ||
          "French";
        setSelectedLanguage(label);
      });
    }, [])
  );

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
  ];

  const changeLanguage = async (
    languageCode: string,
    languageLabel: string
  ) => {
    i18n.changeLanguage(languageCode);
    setSelectedLanguage(languageLabel);
    await AsyncStorage.setItem(constants.STORE_LANGUAGE_KEY, languageCode);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text>{t("screens.accountHomeScreen.options.changeLanguage.text")}</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.dropdownButton}
      >
        <Text>{selectedLanguage}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                onPress={() => changeLanguage(language.code, language.label)}
                style={styles.languageOption}
              >
                <Text>{language.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 250,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  languageOption: {
    padding: 10,
  },
  cancelButton: {
    padding: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "red",
  },
});

export default LanguageDropdown;
