import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Animated,
} from "react-native";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import constants from "../config/constants";
import colors from "../config/colors";
import ApiService from "../config/services";
import { useStoreActions, useStoreState } from "../util/token.store";
import { useTranslation } from "react-i18next";
interface AccountSettingsScreenProps {
  navigation: any;
}

function AccountSettingsScreen(props: AccountSettingsScreenProps) {
  const riderProfile = useStoreState((state) => state.data);
  const setRiderData = useStoreActions((actions) => actions.updateData);
  const riderId = useStoreState((state) => state.data.riderEmail);
  const [isLoading, setIsLoading] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const [changePasswordModalVIsible, setChangePasswordModalVIsible] =
    useState(false);
  const [twoFAModalVIsible, setTwoFAModalVIsible] = useState(false);

  const [twoFactorCheck, setTwoFactorCheck] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  
  const signOutScale = React.useRef(new Animated.Value(1)).current;
  const passwordScale = React.useRef(new Animated.Value(1)).current;

  const onCheckedChange = async (isChecked: boolean) => {
    setIsLoading(true);
    const response = await ApiService.toggleMFA(riderProfile.userId, isChecked);
    if (response === 401) {
      props.navigation.navigate("LoginScreen");
      Toast.show({
        type: "error",
        text1: t(
          "screens.accountSettingsScreen.toastMessages.sessionTimeout.title"
        ),
        text2: t(
          "screens.accountSettingsScreen.toastMessages.sessionTimeout.text"
        ),
      });
      return;
    } else if (typeof response === "number") {
      Toast.show({
        type: "error",
        text1: t("screens.accountSettingsScreen.toastMessages.error.title"),
        text2: t("screens.accountSettingsScreen.toastMessages.error.text"),
      });
    }
    setRiderData({ ...riderProfile, riderMFA: isChecked });
    setTwoFactorCheck(isChecked);
    setIsLoading(false);
  };

  const toggleTwoFAModal = () => {
    setTwoFAModalVIsible(!twoFAModalVIsible);
  };

  const signout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRiderData({
      userId: 0,
      riderProfileId: 0,
      riderEmail: "",
      riderPassword: "",
      riderFirstName: "",
      riderLastName: "",
      riderPhoneNumber: "",
      riderAddress: "",
      riderCity: "",
      riderState: "",
      riderCountry: "",
      riderMFA: false,
    });
    await SecureStore.deleteItemAsync(constants.SECURE_TOKEN);
    props.navigation.navigate("LoginScreen");
  };

  const handleSignOutPressIn = () => {
    Animated.spring(signOutScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleSignOutPressOut = () => {
    Animated.spring(signOutScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handlePasswordPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(passwordScale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handlePasswordPressOut = () => {
    Animated.spring(passwordScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const resetPasswordOTPRequest = async () => {
    setIsLoading(true);

    const response = await ApiService.forgotPasswordOTPRequest(
      riderProfile.riderEmail
    );
    setIsLoading(false);

    if (response.status === true) {
      setChangePasswordModalVIsible(true);
      Toast.show({
        type: "success",
        // text1: `${response.responseMessage}`,
        text2: t(
          "screens.accountSettingsScreen.toastMessages.passwordResetRequestSuccess.text",
          { email: riderProfile.riderEmail }
        ),
      });
    } else {
      Toast.show({
        type: "error",
        text1: t("screens.accountSettingsScreen.toastMessages.error.title"),
        text2: response.responseMessage,
      });
    }
  };

  const resetPassword = async () => {
    Keyboard.dismiss();
    if (
      verificationCode === "" ||
      newPassword === "" ||
      newPasswordAgain === ""
    ) {
      Toast.show({
        type: "error",
        text1: t("screens.accountSettingsScreen.toastMessages.error.title"),
        text2: t("screens.accountSettingsScreen.labels.pleaseInputAllFields"),
      });
    } else if (newPassword !== newPasswordAgain) {
      Toast.show({
        type: "error",
        text1: t("screens.accountSettingsScreen.toastMessages.error.title"),
        text2: t("screens.accountSettingsScreen.labels.passwordsDoNotMatch"),
      });
    } else {
      setModalLoading(true);
      const requestObject = {
        confirmationCode: verificationCode,
        username: riderProfile.riderEmail.trim(),
        password: newPassword,
      };
      const response = await ApiService.resetPassword(requestObject);
      setModalLoading(false);

      if (response.status === true) {
        setChangePasswordModalVIsible(false);
        Toast.show({
          type: "success",
          text1: t(
            "screens.accountSettingsScreen.toastMessages.passwordResetSuccess.title"
          ),
          text2: t(
            "screens.accountSettingsScreen.toastMessages.passwordResetSuccess.text"
          ),
        });
        setVerificationCode("");
        setNewPassword("");
        setNewPasswordAgain("");
      } else {
        Toast.show({
          type: "error",
          text1: t("screens.accountSettingsScreen.toastMessages.error.title"),
          text2: response.responseMessage,
        });
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary + "10", colors.support]}
          style={styles.headerSection}
        >
          <Text style={styles.headerTitle}>
            {t("screens.accountSettingsScreen.header.title")}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("screens.accountSettingsScreen.header.subtitle")}
          </Text>
        </LinearGradient>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color={colors.primary}
                  style={styles.infoIcon}
                />
                <View>
                  <Text style={styles.infoLabel}>
                    {t("screens.accountSettingsScreen.accountInfo.loginEmail.label")}
                  </Text>
                  <Text style={styles.infoValue}>
                    {riderProfile.riderEmail.toLowerCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={colors.primary}
                  style={styles.infoIcon}
                />
                <View>
                  <Text style={styles.infoLabel}>
                    {t("screens.accountSettingsScreen.accountInfo.phoneNumber.label")}
                  </Text>
                  <Text style={styles.infoValue}>
                    {riderProfile.riderPhoneNumber}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <Animated.View style={{ transform: [{ scale: passwordScale }] }}>
              <TouchableOpacity
                style={styles.infoItem}
                onPress={resetPasswordOTPRequest}
                onPressIn={handlePasswordPressIn}
                onPressOut={handlePasswordPressOut}
                activeOpacity={0.7}
              >
                <View style={styles.infoLeft}>
                  <MaterialCommunityIcons
                    name="lock"
                    size={20}
                    color={colors.primary}
                    style={styles.infoIcon}
                  />
                  <View>
                    <Text style={styles.infoLabel}>
                      {t("screens.accountSettingsScreen.accountInfo.password.label")}
                    </Text>
                    <Text style={styles.infoActionText}>
                      Change Password
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={colors.textLight}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.securityCard}>
            <View style={styles.securityItem}>
              <View style={styles.securityLeft}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={20}
                  color={colors.primary}
                  style={styles.infoIcon}
                />
                <View style={styles.securityTextContainer}>
                  <Text style={styles.infoLabel}>
                    {t("screens.accountSettingsScreen.twoStepVerification.label")}
                  </Text>
                  <Text style={styles.securityDescription}>
                    Add an extra layer of security
                  </Text>
                </View>
              </View>
              <Switch
                value={riderProfile.riderMFA}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onCheckedChange(value);
                }}
                trackColor={{ false: colors.border, true: colors.primary + "40" }}
                thumbColor={riderProfile.riderMFA ? colors.primary : colors.textLight}
                ios_backgroundColor={colors.border}
              />
            </View>
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

        <View style={styles.bottomSection}>
          <Animated.View style={{ transform: [{ scale: signOutScale }] }}>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={signout}
              onPressIn={handleSignOutPressIn}
              onPressOut={handleSignOutPressOut}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="logout"
                size={20}
                color={colors.textLight}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.signOutText}>
                {t("screens.accountSettingsScreen.actions.signOut.text")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Modal
          isVisible={changePasswordModalVIsible}
          style={styles.modal}
          swipeDirection="down"
          onSwipeComplete={() => setChangePasswordModalVIsible(false)}
          onModalHide={() => {
            setVerificationCode("");
            setNewPassword("");
            setNewPasswordAgain("");
          }}
          backdropOpacity={0.3}
        >
          <View style={styles.modalContainer}>
            <Toast />
            <View style={styles.dragHandle} />
            <Text style={styles.modalTitle}>
              {t("screens.accountSettingsScreen.modals.changePassword.title")}
            </Text>
            
            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t("screens.accountSettingsScreen.modals.changePassword.verificationCode.label")}
                </Text>
                <View style={styles.inputWrapper}>
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
                      "screens.accountSettingsScreen.modals.changePassword.verificationCode.placeholder"
                    )}
                    placeholderTextColor={colors.textLight}
                    onChangeText={(text) => setVerificationCode(text)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t("screens.accountSettingsScreen.modals.changePassword.newPassword.label")}
                </Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color={colors.textLight}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={newPassword}
                    placeholder={t(
                      "screens.accountSettingsScreen.modals.changePassword.newPassword.placeholder"
                    )}
                    placeholderTextColor={colors.textLight}
                    secureTextEntry={!showNewPassword}
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

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t("screens.accountSettingsScreen.modals.changePassword.confirmNewPassword.label")}
                </Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons
                    name="lock-check-outline"
                    size={20}
                    color={colors.textLight}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={newPasswordAgain}
                    placeholder={t(
                      "screens.accountSettingsScreen.modals.changePassword.confirmNewPassword.placeholder"
                    )}
                    placeholderTextColor={colors.textLight}
                    secureTextEntry={!showConfirmPassword}
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
                    Change Password
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default AccountSettingsScreen;
{
  /* <Modal
          isVisible={twoFAModalVIsible}
          style={{ margin: 0, flex: 1, justifyContent: "flex-end" }}
          swipeDirection="down"
          onSwipeComplete={() => setTwoFAModalVIsible(false)}
        >
          <View style={styles.twoFAcontainer}>
            <View style={styles.line} />
            <View style={{ paddingHorizontal: 16 }}>
              <Text
                style={{ fontSize: 21, fontWeight: "700", marginBottom: 16 }}
              >
                2 Step Verification
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  marginBottom: 24,
                  lineHeight: 26,
                }}
              >
                Verify if it’s you after you enter your password by entering the
                verification code sent to the number provided.
              </Text>
            </View>
            <View style={styles.twoFASingleContainer}>
              <Text
                style={{ fontWeight: "700", fontSize: 16, color: "#616161" }}
              >
                {twoFactorCheck ? "ON" : "OFF"}{" "}
                <Text
                  style={{ fontWeight: "400", fontSize: 16, color: "#616161" }}
                >
                  {twoFactorCheck ? "Since May 14, 2022" : ""}
                </Text>
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Toggle
                  checked={twoFactorCheck}
                  onChange={onCheckedChange}
                  status="success"
                />
              </View>
            </View>
            <View style={styles.twoFASingleContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  style={{ width: 24, height: 24, marginRight: 16 }}
                  fill="#959595"
                  name="message-square-outline"
                />
                <View>
                  <Text
                    style={{
                      fontWeight: "400",
                      fontSize: 14,
                      color: "#616161",
                    }}
                  >
                    (+243) 804 8894 920{"   "}
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 14,
                        color: "green",
                      }}
                    >
                      Verified
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontWeight: "400",
                      fontSize: 12,
                      color: "#616161",
                    }}
                  >
                    Codes are sent by text message
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  style={{ width: 24, height: 24 }}
                  fill="#959595"
                  name="edit-2-outline"
                />
              </View>
            </View>
          </View>
        </Modal> */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.support,
  },
  headerSection: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 16,
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.textLight,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter",
    color: colors.text,
  },
  infoActionText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter",
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  securityCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  securityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityDescription: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingAnimation: {
    width: 60,
    height: 60,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: colors.support,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 160,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.textLight,
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
    paddingBottom: 32,
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
  },
  modalContent: {
    paddingHorizontal: 20,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.support,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
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
