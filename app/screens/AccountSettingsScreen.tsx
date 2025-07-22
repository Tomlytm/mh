import { Button, Input, Text, Toggle } from "@ui-kitten/components";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import constants from "../config/constants";
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
  const { t, i18n } = useTranslation();

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
      <View style={styles.container}>
        <View>
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.accountText}>
              {t("screens.accountSettingsScreen.header.title")}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400", marginBottom: 24 }}>
              {t("screens.accountSettingsScreen.header.subtitle")}
            </Text>
          </View>
          <View style={styles.singleContainer}>
            <Text>
              {t("screens.accountSettingsScreen.accountInfo.loginEmail.label")}
            </Text>
            <Input
              placeholder={riderProfile.riderEmail.toLowerCase()}
              disabled={true}
              style={[styles.input, { marginLeft: -10 }]}
              size="large"
            />
          </View>
          <View style={styles.singleContainer}>
            <Text>
              {t("screens.accountSettingsScreen.accountInfo.phoneNumber.label")}
            </Text>
            <Input
              placeholder={riderProfile.riderPhoneNumber}
              disabled={true}
              style={styles.input}
              size="large"
            />
          </View>
          <TouchableWithoutFeedback onPress={resetPasswordOTPRequest}>
            <View style={styles.singleContainer}>
              <Text>
                {t("screens.accountSettingsScreen.accountInfo.password.label")}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <Text style={{ paddingRight: 11 }}>
                  {t(
                    "screens.accountSettingsScreen.accountInfo.password.lastChanged"
                  )}
                </Text> */}
                {/* <Icon
                  style={[styles.arrowIcon]}
                  fill="#959595"
                  name="arrow-ios-forward-outline"
                /> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={toggleTwoFAModal}>
            <View style={styles.singleContainer}>
              <Text>
                {t("screens.accountSettingsScreen.twoStepVerification.label")}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Toggle
                  checked={riderProfile.riderMFA}
                  onChange={onCheckedChange}
                  style={styles.toggle}
                  status="success"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          {isLoading && (
            <LottieView
              style={{
                alignSelf: "center",
                width: 72,
                height: 72,
              }}
              source={constants.LOADING_TWO}
              autoPlay
            />
          )}
        </View>
        <View style={{ alignSelf: "center", alignItems: "center" }}>
          <Button style={styles.acceptTrueButton} onPress={signout}>
            {(evaProps:any) => (
              <Text
                {...evaProps}
                style={{
                  fontWeight: "700",
                  fontSize: 14,
                  color: "#616161",
                }}
              >
                {t("screens.accountSettingsScreen.actions.signOut.text")}
              </Text>
            )}
          </Button>
        </View>
        <Modal
          isVisible={changePasswordModalVIsible}
          style={{ margin: 0, flex: 1, justifyContent: "flex-end" }}
          swipeDirection="down"
          onSwipeComplete={() => setChangePasswordModalVIsible(false)}
          onModalHide={() => {
            setVerificationCode("");
            setNewPassword("");
            setNewPasswordAgain("");
          }}
        >
          <>
            <Toast />
            <View style={styles.passwordResetModalContainer}>
              <View style={styles.line} />
              <Text
                style={{ fontSize: 21, fontWeight: "700", marginBottom: 20 }}
              >
                {t("screens.accountSettingsScreen.modals.changePassword.title")}
              </Text>
              <TextInput
                style={styles.modalInput}
                dense={true}
                mode="outlined"
                label={t(
                  "screens.accountSettingsScreen.modals.changePassword.verificationCode.label"
                )}
                value={verificationCode}
                placeholder={t(
                  "screens.accountSettingsScreen.modals.changePassword.verificationCode.placeholder"
                )}
                onChangeText={(text) => setVerificationCode(text)}
              />
              <TextInput
                style={styles.modalInput}
                dense={true}
                mode="outlined"
                label={t(
                  "screens.accountSettingsScreen.modals.changePassword.newPassword.label"
                )}
                value={newPassword}
                placeholder={t(
                  "screens.accountSettingsScreen.modals.changePassword.newPassword.placeholder"
                )}
                secureTextEntry={true}
                onChangeText={(text) => setNewPassword(text)}
              />
              <TextInput
                style={styles.modalInput}
                dense={true}
                mode="outlined"
                label={t(
                  "screens.accountSettingsScreen.modals.changePassword.confirmNewPassword.label"
                )}
                value={newPasswordAgain}
                placeholder={t(
                  "screens.accountSettingsScreen.modals.changePassword.confirmNewPassword.placeholder"
                )}
                secureTextEntry={true}
                onChangeText={(text) => setNewPasswordAgain(text)}
              />
              {modalLoading && (
                <LottieView
                  style={{
                    alignSelf: "center",
                    width: 72,
                    height: 72,
                  }}
                  source={constants.LOADING_TWO}
                  autoPlay
                />
              )}
              <Button style={styles.acceptButton} onPress={resetPassword}>
                {(evaProps:any) => (
                  <Text
                    {...evaProps}
                    style={{
                      fontWeight: "700",
                      fontSize: 14,
                      color: "#F5F5F5",
                    }}
                  >
                    {t(
                      "screens.accountSettingsScreen.modals.changePassword.title"
                    )}
                  </Text>
                )}
              </Button>
            </View>
          </>
        </Modal>
      </View>
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
  acceptButton: {
    borderRadius: 16,
    borderWidth: 0,
    width: 225,
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#E60000",
  },
  acceptTrueButton: {
    borderRadius: 16,
    borderWidth: 0,
    width: 180,
    height: 40,
    justifyContent: "center",
    backgroundColor: "#D5D5D5",
    marginBottom: 16,
  },
  accountText: {
    fontWeight: "700",
    fontSize: 21,
    color: "#2B2B2B",
    marginBottom: 16,
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },
  container: {
    flex: 1,
    paddingTop: 16,
    display: "flex",
    justifyContent: "space-between",
    height: "100%",
    backgroundColor: "#F9F8F8",
  },
  initialsContainer: {
    height: 68,
    width: 68,
    backgroundColor: "#353535",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    paddingLeft: "20%",
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    borderWidth: 0,
  },

  line: {
    alignSelf: "center",
    width: 45,
    height: 5,
    backgroundColor: "#D5D5D5",
    marginVertical: 10,
    borderRadius: 16,
  },
  modalInput: {
    width: "100%",
    height: 55,
    marginBottom: 24,
    borderColor: "#D5D5D5",
  },
  passwordResetModalContainer: {
    width: "auto",
    height: 420,
    padding: 12,
    backgroundColor: "#FFF",
    paddingTop: 12,
    borderRadius: 16,
  },
  singleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 48,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 1.5,
  },
  toggle: {
    marginRight: 16,
  },
  twoFAcontainer: {
    width: "auto",
    height: 420,
    backgroundColor: "#FFF",
    paddingTop: 12,
    borderRadius: 16,
  },
  twoFASingleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: "#616161",
    backgroundColor: "#FFF",
    marginBottom: 0.5,
  },
});
