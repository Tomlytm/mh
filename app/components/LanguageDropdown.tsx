import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import constants from "../config/constants";
import colors from "../config/colors";

const LanguageDropdown = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const { t, i18n } = useTranslation();
  const dropdownScale = React.useRef(new Animated.Value(1)).current;

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    i18n.changeLanguage(languageCode);
    setSelectedLanguage(languageLabel);
    await AsyncStorage.setItem(constants.STORE_LANGUAGE_KEY, languageCode);
    setModalVisible(false);
  };

  const handleDropdownPressIn = () => {
    Animated.spring(dropdownScale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleDropdownPressOut = () => {
    Animated.spring(dropdownScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: dropdownScale }] }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          onPressIn={handleDropdownPressIn}
          onPressOut={handleDropdownPressOut}
          style={styles.dropdownButton}
          activeOpacity={0.7}
        >
          <View style={styles.dropdownContent}>
            <MaterialCommunityIcons
              name="translate"
              size={20}
              color={colors.primary}
              style={styles.languageIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.label}>
                {t("screens.accountHomeScreen.options.changeLanguage.text")}
              </Text>
              <Text style={styles.selectedValue}>{selectedLanguage}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color={colors.textLight}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={[colors.secondary, colors.support]}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>Select Language</Text>
              
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => changeLanguage(language.code, language.label)}
                  style={[
                    styles.languageOption,
                    selectedLanguage === language.label && styles.languageOptionSelected
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.languageText,
                    selectedLanguage === language.label && styles.languageTextSelected
                  ]}>
                    {language.label}
                  </Text>
                  {selectedLanguage === language.label && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  dropdownButton: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  languageIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.textLight,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  selectedValue: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter",
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxWidth: 300,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  languageOptionSelected: {
    backgroundColor: colors.primary + "15",
  },
  languageText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter",
    color: colors.text,
  },
  languageTextSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.textLight,
  },
});

export default LanguageDropdown;
