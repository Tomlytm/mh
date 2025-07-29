import React, { useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import {
  Keyboard,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  Vibration,
  View,
  Text,
  Animated,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import constants from "../config/constants";
import colors from "../config/colors";
import ApiService from "../config/services";
import { useStoreActions, useStoreState } from "../util/token.store";
import { useTranslation } from "react-i18next";

interface ConfirmCodeScreenProps {
  navigation: any;
}

function ConfirmCodeScreen(props: ConfirmCodeScreenProps) {
  const setRiderData = useStoreActions((actions) => actions.updateData);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const riderData = useStoreState((state) => state.data);
  const [inputStyle, setInputStyle] = useState(styles.otpInput);
  const inputs = useRef<(TextInput | null)[]>([]);
  const { t, i18n } = useTranslation();
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  const resendScale = useRef(new Animated.Value(1)).current;

  const handleOtpChange = (value: string, index: number) => {
    let newOtp = [...otp];

    if (value.length > 1) {
      // Handle pasting scenario: spread characters across input boxes
      const otpArray = value.split("").slice(0, otp.length);
      otpArray.forEach((char, i) => {
        newOtp[index + i] = char;
      });
      setOtp(newOtp);

      // Focus on the next available input field
      const nextInputIndex = Math.min(index + otpArray.length, otp.length - 1);
      inputs.current[nextInputIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input field if available
      if (value && index < otp.length - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    setInputStyle({ ...styles.otpInput, borderColor: colors.border });

    if (e.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];

      if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const loadHome = async () => {
    try {
      console.log("Confirm button pressed!");
      console.log("Current OTP:", otp);
      console.log("OTP joined:", otp.join(""));
      console.log("OTP length:", otp.join("").length);
      
      if (otp.join("").length == 0 || otp.join("").length < 6) {
        console.log("OTP validation failed - not enough digits");
        setInputStyle({ ...styles.otpInput, borderColor: colors.error });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Vibration.vibrate(500);
        return;
      }
    const cleanedOTP = parseInt(otp.join(""));
    console.log("Cleaned OTP:", cleanedOTP);

    if (Number.isNaN(cleanedOTP)) {
      console.log("OTP is not a number");
      Toast.show({
        type: "error",
        text1: t("screens.confirmCodeScreen.text.invalidOtp"),
        text2: t("screens.confirmCodeScreen.text.otpDigitsOnly"),
      });
      return;
    }

    console.log("Dismissing keyboard and starting API call");
    Keyboard.dismiss();
    setIsLoading(true);

    console.log("Calling validateOTP with email:", riderData.riderEmail, "OTP:", cleanedOTP);
    const response = await ApiService.validateOTP(
      riderData.riderEmail,
      cleanedOTP
    );
    console.log("OTP validation response:", response);
    setIsLoading(false);
    if (response?.status === 400) {
      Toast.show({
        type: "error",
        text1: t("screens.confirmCodeScreen.text.validationError"),
        text2: response?.data?.message,
      });
      return;
    } else if (response?.accessToken) {
      await SecureStore.setItemAsync(
        constants.SECURE_TOKEN,
        response?.accessToken
      );
      const riderProfileResponse = await ApiService.getRiderProfile(
        riderData.userId
      );

      if (riderProfileResponse.status === 404) {
        Toast.show({
          type: "error",
          text1: t("screens.confirmCodeScreen.text.loginError"),
          text2: t("screens.confirmCodeScreen.text.noUserProfile"),
        });
        return;
      }

      setRiderData({ ...riderData, riderProfileId: riderProfileResponse.id });
      props.navigation.navigate("MyTabs");
      setOtp(["", "", "", "", "", ""]);
    } else {
      Toast.show({
        type: "error",
        text1: t("screens.confirmCodeScreen.text.error"),
        text2: `${t("screens.confirmCodeScreen.text.somethingWentWrong")} ${
          response.message
        }`,
      });
    }
    } catch (error) {
      console.error("Error in loadHome function:", error);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const resendOTP = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let user = {
      riderEmail: riderData.riderEmail,
      riderPassword: riderData.riderPassword,
    };

    Keyboard.dismiss();
    setIsLoading(true);
    ApiService.login(user).then(async (response) => {
      setIsLoading(false);
      if (response.code == 200) {
        Toast.show({
          type: "success",
          text1: t("screens.confirmCodeScreen.text.success"),
          text2: t("screens.confirmCodeScreen.text.otpResent"),
        });
        return;
      }
    });
  };

  const handleButtonPressIn = () => {
    console.log("Button press IN");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleButtonPressOut = () => {
    console.log("Button press OUT");
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleResendPressIn = () => {
    Animated.spring(resendScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleResendPressOut = () => {
    Animated.spring(resendScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <TouchableOpacity onPress={Keyboard.dismiss} style={styles.touchableContainer}>
        <Toast />
        <LinearGradient
          colors={[colors.primary + "10", colors.support]}
          style={styles.headerSection}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="shield-check"
              size={64}
              color={colors.primary}
            />
          </View>
          <Text style={styles.title}>
            {t("screens.confirmCodeScreen.title")}
          </Text>
          <Text style={styles.subtitle}>
            {t("screens.confirmCodeScreen.text.sentEmail")}{" "}
            <Text style={styles.emailText}>{riderData.riderEmail.toLowerCase()}</Text>
          </Text>
        </LinearGradient>

        <View style={styles.contentSection}>
          <Text style={styles.instructionText}>
            {t("screens.confirmCodeScreen.text.enterCode") || "Enter the 6-digit code sent to your email"}
          </Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View key={index} style={styles.otpInputWrapper}>
                <TextInput
                  autoComplete="one-time-code"
                  style={[
                    inputStyle,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  maxLength={index === 0 ? otp.length : 1}
                  keyboardType="numeric"
                  onChangeText={(value) => handleOtpChange(value, index)}
                  value={digit}
                  ref={(input) => {
                    inputs.current[index] = input;
                  }}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  placeholderTextColor={colors.textLight}
                />
              </View>
            ))}
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              disabled={isLoading}
              onPress={loadHome}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={colors.gradient.primary}
                style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
              >
                <Text style={styles.buttonText}>
                  {t("screens.confirmCodeScreen.text.confirmCode")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              {t("screens.confirmCodeScreen.text.didntGetCode")}
            </Text>
            <Animated.View style={{ transform: [{ scale: resendScale }] }}>
              <TouchableOpacity
                onPress={resendOTP}
                onPressIn={handleResendPressIn}
                onPressOut={handleResendPressOut}
                activeOpacity={0.7}
                style={styles.resendButton}
              >
                <Text style={styles.resendButtonText}>
                  {t("screens.confirmCodeScreen.text.resendIt")}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <LottieView
                style={styles.loadingAnimation}
                source={constants.LOADING_TWO}
                autoPlay
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.support,
  },
  touchableContainer: {
    flex: 1,
    minHeight: "100%",
  },
  headerSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 24,
  },
  emailText: {
    fontWeight: "600",
    color: colors.primary,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter",
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    paddingHorizontal: 4,
  },
  otpInputWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  otpInput: {
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    height: 56,
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Inter",
    textAlign: "center",
    color: colors.text,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "08",
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
  resendContainer: {
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.primary,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingAnimation: {
    width: 60,
    height: 60,
  },
});
export default ConfirmCodeScreen;
