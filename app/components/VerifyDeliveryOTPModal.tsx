import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Animated,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

interface VerifyDeliveryOTPProps {
  toggleDismiss: any;
  resendVerificationOTP: any;
  confirmDelivery: (code: string) => void;
}

export default function VerifyDeliveryOTPModal(props: VerifyDeliveryOTPProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { t } = useTranslation();
  
  const dismissScale = useRef(new Animated.Value(1)).current;
  const verifyScale = useRef(new Animated.Value(1)).current;

  const handleDismissPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(dismissScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleDismissPressOut = () => {
    Animated.spring(dismissScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleVerifyPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(verifyScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleVerifyPressOut = () => {
    Animated.spring(verifyScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

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
    if (e.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];
      
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dragHandle} />
      
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={colors.gradient.primary}
            style={styles.otpIcon}
          >
            <MaterialCommunityIcons
              name="shield-check"
              size={32}
              color={colors.secondary}
            />
          </LinearGradient>
        </View>
        <Text style={styles.title}>
          {t("components.verifyDeliveryOTPModal.otpPrompt")}
        </Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code to confirm delivery
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <View
            key={index}
            style={[
              styles.otpBox,
              focusedIndex === index && styles.otpBoxFocused,
              digit && styles.otpBoxFilled,
            ]}
          >
            <TextInput
              autoComplete="one-time-code"
              style={styles.otpInput}
              maxLength={index === 0 ? otp.length : 1}
              keyboardType="numeric"
              onChangeText={(value) => handleOtpChange(value, index)}
              value={digit}
              ref={(input) => {
                inputs.current[index] = input;
              }}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              selectTextOnFocus
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.resendContainer}
        onPress={props.resendVerificationOTP}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="refresh"
          size={16}
          color={colors.primary}
          style={styles.resendIcon}
        />
        <Text style={styles.resendText}>
          {t("components.verifyDeliveryOTPModal.resendOtp")}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Animated.View style={[{ transform: [{ scale: dismissScale }] }, styles.buttonWrapper]}>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={props.toggleDismiss}
            onPressIn={handleDismissPressIn}
            onPressOut={handleDismissPressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.dismissButtonText}>
              {t("components.verifyDeliveryOTPModal.dismissButton")}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[{ transform: [{ scale: verifyScale }] }, styles.buttonWrapper]}>
          <TouchableOpacity
            onPress={() => props.confirmDelivery(otp.join(""))}
            onPressIn={handleVerifyPressIn}
            onPressOut={handleVerifyPressOut}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.verifyButton}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color={colors.secondary}
                style={styles.verifyIcon}
              />
              <Text style={styles.verifyButtonText}>
                {t("components.verifyDeliveryOTPModal.verifyButton")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  otpIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.support,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  otpBoxFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "08",
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  otpBoxFilled: {
    borderColor: colors.primary + "60",
    backgroundColor: colors.primary + "05",
  },
  otpInput: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 32,
  },
  resendIcon: {
    marginRight: 6,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
  dismissButton: {
    backgroundColor: colors.support,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
  },
  verifyButton: {
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyIcon: {
    marginRight: 8,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
});