import { Button, Input, Text } from "@ui-kitten/components";
import { useState } from "react";
import {
  Keyboard,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native-paper";
import ApiService from "../config/services";
import constants from "../config/constants";
import LottieView from "lottie-react-native";
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
  const [inputStyle, setInputSTyle] = useState(styles.input);
  const [isLoading, setIsLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const resetPasswordOTPRequest = async () => {
    if (email == "") {
      setInputSTyle({ ...styles.input, borderColor: "red" });
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
      // valid email
      setIsLoading(true);

      const response = await ApiService.forgotPasswordOTPRequest(cleanedEmail);
      setIsLoading(false);

      if (response.status === true) {
        setShowModal(true);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.responseMessage,
        });
      }
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
    <View style={styles.container}>
      <Toast />
      <View style={styles.loginContainer}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.labelText}>
            {t("screens.forgotPassword.text.provideEmail")}
          </Text>
        </View>
        <Input
          value={email}
          autoCapitalize="none"
          onChangeText={(nextValue) => {
            setInputSTyle({ ...styles.input, borderColor: "#D5D5D5" });
            setEmail(nextValue);
          }}
          style={inputStyle}
          placeholder={t("screens.forgotPassword.text.emailAddress")}
        />
        <Button style={styles.button} onPress={resetPasswordOTPRequest}>
          {t("screens.forgotPassword.text.resetPassword")}
        </Button>
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
      <Modal
        backdropOpacity={0.15}
        style={{ margin: 0, flex: 1, justifyContent: "flex-end" }}
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
        {/* <> */}
        <Toast />
        <View style={styles.passwordResetModalContainer}>
          <View style={styles.line} />
          <Text style={{ fontSize: 21, fontWeight: "700", marginBottom: 20 }}>
            {t("screens.forgotPassword.text.resetPassword")}
          </Text>
          <TextInput
            style={styles.input}
            dense={true}
            mode="outlined"
            label={t("screens.forgotPassword.text.verificationCode")}
            value={verificationCode}
            placeholder={t(
              "screens.forgotPassword.text.verificationCodePlaceholder"
            )}
            onChangeText={(text) => setVerificationCode(text)}
          />
          <TextInput
            style={styles.input}
            mode="outlined"
            label={t("screens.forgotPassword.text.newPassword")}
            value={newPassword}
            secureTextEntry={true}
            placeholder={t(
              "screens.forgotPassword.text.newPasswordPlaceholder"
            )}
            onChangeText={(text) => setNewPassword(text)}
          />
          <TextInput
            style={styles.input}
            mode="outlined"
            label={t("screens.forgotPassword.text.confirmNewPassword")}
            value={newPasswordAgain}
            secureTextEntry={true}
            placeholder={t(
              "screens.forgotPassword.text.confirmNewPasswordPlaceholder"
            )}
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
            {(evaProps: any) => (
              <Text
                {...evaProps}
                style={{ fontWeight: "700", fontSize: 14, color: "#F5F5F5" }}
              >
                {t("screens.forgotPassword.text.changePassword")}
              </Text>
            )}
          </Button>
        </View>
        {/* </> */}
      </Modal>
    </View>
  );
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
  button: {
    borderRadius: 100,
    borderWidth: 0,
    width: "100%",
    height: 55,
    backgroundColor: "#E60000",
    marginBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight,
  },
  icon: {
    width: 32,
    height: 32,
  },
  input: {
    width: "100%",
    height: 55,
    marginBottom: 24,
    borderColor: "#D5D5D5",
  },
  line: {
    alignSelf: "center",
    width: 45,
    height: 5,
    backgroundColor: "#D5D5D5",
    marginVertical: 10,
    borderRadius: 16,
  },
  loginContainer: {
    width: "84%",
    marginTop: "36%",
    // alignItems: 'center',
  },
  labelText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#616161",
    lineHeight: 26.4,
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#616161",
  },
  passwordResetModalContainer: {
    width: "auto",
    height: 420,
    padding: 12,
    backgroundColor: "#FFF",
    paddingTop: 12,
    borderRadius: 16,
  },
});
export default ForgotPasswordScreen;
