import React, { useState, useRef } from "react";
import {
  Keyboard,
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
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ApiService from "../config/services";
import constants from "../config/constants";
import colors from "../config/colors";
import LottieView from "../components/LottieViewMock";
import { validateEmail } from "../util/helpers";
import { useTranslation } from "react-i18next";

interface ForgotPasswordScreenProps {
  navigation: any;
}

function ForgotPasswordScreen(props: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  const emailBorderColor = useRef(new Animated.Value(0)).current;

  const resetPasswordOTPRequest = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (email == "") {
      Animated.timing(emailBorderColor, {
        toValue: 2, // Error state
        duration: 200,
        useNativeDriver: false,
      }).start();
      return;
    }

    Keyboard.dismiss();
    const cleanedEmail = email.trim();
    if (!validateEmail(cleanedEmail)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email",
      });
    } else {
      setIsLoading(true);
      const response = await ApiService.forgotPasswordOTPRequest(cleanedEmail);
      setIsLoading(false);

      if (response.status === true) {
        setShowModal(true);
        Toast.show({
          type: "success",
          text1: "Code Sent",
          text2: `Verification code sent to ${cleanedEmail}`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.responseMessage,
        });
      }
    }
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
    Animated.timing(emailBorderColor, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    Animated.timing(emailBorderColor, {
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

  const animatedEmailBorderColor = emailBorderColor.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [colors.border, colors.primary, colors.error],
  });

  const resetPassword = async () => {
    Keyboard.dismiss();
    if (
      verificationCode === "" ||
      newPassword === "" ||
      newPasswordAgain === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please input all fields",
      });
    } else if (newPassword !== newPasswordAgain) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match",
      });
    } else {
      setModalLoading(true);
      const requestObject = {
        confirmationCode: verificationCode,
        username: email.trim(),
        password: newPassword,
      };
      const response = await ApiService.resetPassword(requestObject);
      setModalLoading(false);

      if (response.status === true) {
        setShowModal(false);
        props.navigation.navigate("LoginScreen");
        setEmail("");
        setNewPassword("");
        setNewPasswordAgain("");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.responseMessage,
        });
      }
    }
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
          {t("screens.forgotPassword.text.provideEmail")}
        </Text>
      </LinearGradient>

      <View style={styles.contentSection}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <Animated.View
            style={[
              styles.inputWrapper,
              { borderColor: animatedEmailBorderColor },
            ]}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={emailFocused ? colors.primary : colors.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              value={email}
              style={styles.input}
              placeholder={t("screens.forgotPassword.text.emailAddress")}
              placeholderTextColor={colors.textLight}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(nextValue) => {
                Animated.timing(emailBorderColor, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: false,
                }).start();
                setEmail(nextValue);
              }}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
            />
          </Animated.View>
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            disabled={isLoading}
            onPress={resetPasswordOTPRequest}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
            >
              <Text style={styles.buttonText}>
                {t("screens.forgotPassword.text.resetPassword")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

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
      <Modal
        backdropOpacity={0.3}
        style={styles.modal}
        isVisible={showModal}
        avoidKeyboard={true}
        swipeDirection="down"
        onBackdropPress={Keyboard.dismiss}
        onSwipeComplete={() => setShowModal(false)}
        onModalHide={() => {
          setVerificationCode("");
          setNewPassword("");
          setNewPasswordAgain("");
        }}
      >
        <View style={styles.modalContainer}>
          <Toast />
          <View style={styles.dragHandle} />
          <Text style={styles.modalTitle}>
            {t("screens.forgotPassword.text.resetPassword")}
          </Text>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>
                {t("screens.forgotPassword.text.verificationCode")}
              </Text>
              <View style={styles.modalInputWrapper}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.modalInput}
                  value={verificationCode}
                  placeholder={t(
                    "screens.forgotPassword.text.verificationCodePlaceholder"
                  )}
                  placeholderTextColor={colors.textLight}
                  onChangeText={(text) => setVerificationCode(text)}
                />
              </View>
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>
                {t("screens.forgotPassword.text.newPassword")}
              </Text>
              <View style={styles.modalInputWrapper}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.modalInput}
                  value={newPassword}
                  secureTextEntry={!showNewPassword}
                  placeholder={t(
                    "screens.forgotPassword.text.newPasswordPlaceholder"
                  )}
                  placeholderTextColor={colors.textLight}
                  onChangeText={(text) => setNewPassword(text)}
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
              </View>
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>
                {t("screens.forgotPassword.text.confirmNewPassword")}
              </Text>
              <View style={styles.modalInputWrapper}>
                <MaterialCommunityIcons
                  name="lock-check-outline"
                  size={20}
                  color={colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.modalInput}
                  value={newPasswordAgain}
                  secureTextEntry={!showConfirmPassword}
                  placeholder={t(
                    "screens.forgotPassword.text.confirmNewPasswordPlaceholder"
                  )}
                  placeholderTextColor={colors.textLight}
                  onChangeText={(text) => setNewPasswordAgain(text)}
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
              </View>
            </View>

            {modalLoading && (
              <View style={styles.loadingContainer}>
                <LottieView
                  style={styles.loadingAnimation}
                  source={constants.LOADING_TWO}
                  autoPlay
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={resetPassword}
              disabled={modalLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradient.primary}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>
                  {t("screens.forgotPassword.text.changePassword")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingAnimation: {
    width: 60,
    height: 60,
  },
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  modalInputContainer: {
    marginBottom: 20,
  },
  modalInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 8,
  },
  modalInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.support,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
    color: colors.text,
    paddingVertical: 16,
  },
  eyeButton: {
    padding: 4,
  },
  modalButton: {
    marginTop: 24,
  },
  modalButtonGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
});
export default ForgotPasswordScreen;
