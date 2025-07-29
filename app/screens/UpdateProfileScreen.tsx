import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  Text,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStoreActions, useStoreState } from "../util/token.store";
import ApiService from "../config/services";
import Toast from "react-native-toast-message";
import colors from "../config/colors";
import { riderData } from "../util/app.interface";
import { useTranslation } from "react-i18next";

interface UpdateProfileScreenProps {
  navigation: any;
}

function UpdateProfileScreen(props: UpdateProfileScreenProps) {
  const riderDetail = useStoreState((state) => state.data);
  const setRiderData = useStoreActions((actions) => actions.updateData);

  const [firstName, setFirstName] = useState(riderDetail.riderFirstName);
  const [lastName, setLastName] = useState(riderDetail.riderLastName);
  const [phoneNumber, setPhoneNumber] = useState(riderDetail.riderPhoneNumber);
  const [address, setAddress] = useState(riderDetail.riderAddress);
  const [city, setCity] = useState(riderDetail.riderCity);
  const [state, setState] = useState(riderDetail.riderState);
  const [country, setCountry] = useState(riderDetail.riderCountry);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const { t } = useTranslation();

  const buttonScale = React.useRef(new Animated.Value(1)).current;

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };
  const updateRiderDetail = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();

    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
      Toast.show({
        type: "error",
        text1: "Required Fields",
        text2: "Please fill in all required fields",
      });
      return;
    }

    setIsLoading(true);
    const requestObject = {
      firstName,
      lastName,
      phoneNumber,
      address_street: address,
      address_town: city,
      address_province: state,
      address_country: country,
    };

    const response = await ApiService.updateRiderDetail(
      riderDetail.userId,
      requestObject
    );
    setIsLoading(false);

    if (response === 401) {
      props.navigation.navigate("LoginScreen");
      Toast.show({
        type: "error",
        text1: t(
          "screens.updateProfileScreen.toastMessages.sessionTimeout.title"
        ),
        text2: t(
          "screens.updateProfileScreen.toastMessages.sessionTimeout.message"
        ),
      });
      return;
    }

    if (response !== 400) {
      const riderData: riderData = {
        ...riderDetail,
        riderFirstName: firstName,
        riderLastName: lastName,
        riderPhoneNumber: phoneNumber,
        riderAddress: address,
        riderCity: city,
        riderState: state,
        riderCountry: country,
      };
      setRiderData(riderData);
      Toast.show({
        type: "success",
        text1: t("screens.updateProfileScreen.toastMessages.success.title"),
        text2: t("screens.updateProfileScreen.toastMessages.success.message"),
      });
      return;
    } else {
      Toast.show({
        type: "error",
        text1: t("screens.updateProfileScreen.toastMessages.error.title"),
        text2: t("screens.updateProfileScreen.toastMessages.error.message"),
      });
      return;
    }
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    iconName: string,
    required: boolean = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.requiredAsterisk}> *</Text>}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          focusedField === label && styles.inputWrapperFocused,
        ]}
      >
        <MaterialCommunityIcons
          name={iconName as any}
          size={20}
          color={focusedField === label ? colors.primary : colors.textLight}
          style={styles.inputIcon}
        />
        <TextInput
          value={value}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          onChangeText={onChangeText}
          onFocus={() => setFocusedField(label)}
          onBlur={() => setFocusedField("")}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Toast />
      
      <LinearGradient
        colors={[colors.primary + "10", colors.support]}
        style={styles.headerSection}
      >
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={colors.gradient.primary}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {riderDetail.riderFirstName.charAt(0).toUpperCase()}
              {riderDetail.riderLastName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        </View>
        <Text style={styles.nameText}>
          {riderDetail.riderFirstName} {riderDetail.riderLastName}
        </Text>
        <Text style={styles.emailText}>{riderDetail.riderEmail}</Text>
      </LinearGradient>

      <View style={styles.contentSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="account-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>

        {renderInputField(
          t("screens.updateProfileScreen.fields.firstName.label"),
          firstName,
          setFirstName,
          t("screens.updateProfileScreen.fields.firstName.placeholder"),
          "account-outline",
          true
        )}

        {renderInputField(
          t("screens.updateProfileScreen.fields.lastName.label"),
          lastName,
          setLastName,
          t("screens.updateProfileScreen.fields.lastName.placeholder"),
          "account-outline",
          true
        )}

        <View style={styles.sectionDivider} />

        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="phone-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>
            {t("screens.updateProfileScreen.fields.contactDetails.label")}
          </Text>
        </View>

        {renderInputField(
          t("screens.updateProfileScreen.fields.phoneNumber.label"),
          phoneNumber,
          setPhoneNumber,
          t("screens.updateProfileScreen.fields.phoneNumber.placeholder"),
          "phone-outline",
          true
        )}

        <View style={styles.sectionDivider} />

        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>Address Information</Text>
        </View>

        {renderInputField(
          t("screens.updateProfileScreen.fields.address.label"),
          address,
          setAddress,
          t("screens.updateProfileScreen.fields.address.placeholder"),
          "home-outline"
        )}

        {renderInputField(
          t("screens.updateProfileScreen.fields.city.label"),
          city,
          setCity,
          t("screens.updateProfileScreen.fields.city.placeholder"),
          "city-variant-outline"
        )}

        {renderInputField(
          t("screens.updateProfileScreen.fields.state.label"),
          state,
          setState,
          t("screens.updateProfileScreen.fields.state.placeholder"),
          "map-outline"
        )}

        {renderInputField(
          t("screens.updateProfileScreen.fields.country.label"),
          country,
          setCountry,
          t("screens.updateProfileScreen.fields.country.placeholder"),
          "earth"
        )}

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            disabled={isLoading}
            onPress={updateRiderDetail}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              style={[styles.saveButton, { opacity: isLoading ? 0.7 : 1 }]}
            >
              {isLoading ? (
                <View style={styles.loadingContent}>
                  <MaterialCommunityIcons
                    name="loading"
                    size={20}
                    color={colors.secondary}
                    style={styles.spinningIcon}
                  />
                  <Text style={styles.saveButtonText}>Saving...</Text>
                </View>
              ) : (
                <Text style={styles.saveButtonText}>
                  {t("screens.updateProfileScreen.buttons.saveChanges.text")}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.support,
  },
  headerSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  emailText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    textAlign: "center",
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    marginLeft: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
    marginHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 8,
  },
  requiredAsterisk: {
    color: colors.primary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
    color: colors.text,
    paddingVertical: 0,
  },
  saveButton: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinningIcon: {
    marginRight: 8,
  },
});

export default UpdateProfileScreen;
