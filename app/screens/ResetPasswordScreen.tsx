import React, { useState, useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useTranslation } from "react-i18next";

interface ResetPasswordScreenProps {
  navigation: any;
}

function ResetPasswordScreen(props: ResetPasswordScreenProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const buttonScale = useRef(new Animated.Value(1)).current;
  const newPasswordBorderColor = useRef(new Animated.Value(0)).current;
  const confirmPasswordBorderColor = useRef(new Animated.Value(0)).current;

  const handleNewPasswordFocus = () => {
    setNewPasswordFocused(true);
    Animated.timing(newPasswordBorderColor, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleNewPasswordBlur = () => {
    setNewPasswordFocused(false);
    Animated.timing(newPasswordBorderColor, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleConfirmPasswordFocus = () => {
    setConfirmPasswordFocused(true);
    Animated.timing(confirmPasswordBorderColor, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordFocused(false);
    Animated.timing(confirmPasswordBorderColor, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

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

  const animatedNewPasswordBorderColor = newPasswordBorderColor.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [colors.border, colors.primary, colors.error],
  });

  const animatedConfirmPasswordBorderColor = confirmPasswordBorderColor.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [colors.border, colors.primary, colors.error],
  });

  const resetPassword = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (newPassword === "" || confirmPassword === "") {
      if (newPassword === "") {
        Animated.timing(newPasswordBorderColor, {
          toValue: 2,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
      if (confirmPassword === "") {
        Animated.timing(confirmPasswordBorderColor, {
          toValue: 2,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Animated.timing(confirmPasswordBorderColor, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match",
      });
      return;
    }

    if (newPassword.length < 8) {
      Animated.timing(newPasswordBorderColor, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password must be at least 8 characters",
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password has been reset successfully",
      });
      props.navigation.navigate("LoginScreen");
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <Toast />
      <LinearGradient
        colors={[colors.primary + "10", colors.support]}
        style={styles.headerSection}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="lock-reset"
            size={64}
            color={colors.primary}
          />
        </View>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Create a strong new password for your account
        </Text>
      </LinearGradient>

      <View style={styles.contentSection}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>New Password</Text>
          <Animated.View
            style={[
              styles.inputWrapper,
              { borderColor: animatedNewPasswordBorderColor },
            ]}
          >
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={newPasswordFocused ? colors.primary : colors.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              value={newPassword}
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor={colors.textLight}
              secureTextEntry={!showNewPassword}
              onChangeText={(nextValue) => {
                Animated.timing(newPasswordBorderColor, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: false,
                }).start();
                setNewPassword(nextValue);
              }}
              onFocus={handleNewPasswordFocus}
              onBlur={handleNewPasswordBlur}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeButton}
            >
              <MaterialCommunityIcons
                name={showNewPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <Animated.View
            style={[
              styles.inputWrapper,
              { borderColor: animatedConfirmPasswordBorderColor },
            ]}
          >
            <MaterialCommunityIcons
              name="lock-check-outline"
              size={20}
              color={confirmPasswordFocused ? colors.primary : colors.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              value={confirmPassword}
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textLight}
              secureTextEntry={!showConfirmPassword}
              onChangeText={(nextValue) => {
                Animated.timing(confirmPasswordBorderColor, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: false,
                }).start();
                setConfirmPassword(nextValue);
              }}
              onFocus={handleConfirmPasswordFocus}
              onBlur={handleConfirmPasswordBlur}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              <MaterialCommunityIcons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.passwordRequirements}>
          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
          <View style={styles.requirementItem}>
            <MaterialCommunityIcons
              name={newPassword.length >= 8 ? "check-circle" : "circle-outline"}
              size={16}
              color={newPassword.length >= 8 ? colors.success : colors.textLight}
            />
            <Text style={[
              styles.requirementText,
              { color: newPassword.length >= 8 ? colors.success : colors.textLight }
            ]}>
              At least 8 characters
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <MaterialCommunityIcons
              name={newPassword === confirmPassword && newPassword !== "" ? "check-circle" : "circle-outline"}
              size={16}
              color={newPassword === confirmPassword && newPassword !== "" ? colors.success : colors.textLight}
            />
            <Text style={[
              styles.requirementText,
              { color: newPassword === confirmPassword && newPassword !== "" ? colors.success : colors.textLight }
            ]}>
              Passwords match
            </Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            disabled={isLoading}
            onPress={resetPassword}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
            >
              {isLoading ? (
                <View style={styles.loadingContent}>
                  <MaterialCommunityIcons
                    name="loading"
                    size={20}
                    color={colors.secondary}
                    style={styles.spinningIcon}
                  />
                  <Text style={styles.buttonText}>Resetting...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
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
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  eyeButton: {
    padding: 4,
  },
  passwordRequirements: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: "Inter",
    marginLeft: 8,
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
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinningIcon: {
    marginRight: 8,
  },
});
export default ResetPasswordScreen;
