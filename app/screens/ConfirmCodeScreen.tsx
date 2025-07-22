import { Button, Text } from "@ui-kitten/components";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import constants from "../config/constants";
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
  const [inputStyle, setInputStyle] = useState(styles.box);
  const inputs = useRef<(TextInput | null)[]>([]);
  const { t } = useTranslation();

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
    setInputStyle({ ...styles.box, borderColor: "#D5D5D5" });

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
    if (otp.join("").length == 0 || otp.join("").length < 6) {
      setInputStyle({ ...styles.box, borderColor: "red" });
      Vibration.vibrate(500);
      return;
    }
    const cleanedOTP = parseInt(otp.join(""));

    if (Number.isNaN(cleanedOTP)) {
      Toast.show({
        type: "error",
        text1: t("confirmCodeScreen.text.invalidOtp"),
        text2: t("confirmCodeScreen.text.otpDigitsOnly"),
      });
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    const response = await ApiService.validateOTP(
      riderData.riderEmail,
      cleanedOTP
    );
    setIsLoading(false);
    if (response?.status === 400) {
      Toast.show({
        type: "error",
        text1: t("confirmCodeScreen.text.validationError"),
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
          text1: t("confirmCodeScreen.text.loginError"),
          text2: t("confirmCodeScreen.text.noUserProfile"),
        });
        return;
      }

      setRiderData({ ...riderData, riderProfileId: riderProfileResponse.id });
      props.navigation.navigate("MyTabs");
      setOtp(["", "", "", "", "", ""]);
    } else {
      Toast.show({
        type: "error",
        text1: t("confirmCodeScreen.text.error"),
        text2: `${t("confirmCodeScreen.text.somethingWentWrong")} ${
          response.message
        }`,
      });
    }
  };

  const resendOTP = () => {
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
          text1: t("confirmCodeScreen.text.success"),
          text2: t("confirmCodeScreen.text.otpResent"),
        });
        return;
      }
    });
  };

  return (
    <KeyboardAwareScrollView>
      <TouchableOpacity onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Toast />
          <View style={styles.loginContainer}>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.labelText}>
                {t("confirmCodeScreen.text.sentEmail")}{" "}
                <Text category="h6">{riderData.riderEmail.toLowerCase()} </Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 30,
              }}
            >
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  autoComplete="one-time-code"
                  style={inputStyle}
                  maxLength={index === 0 ? otp.length : 1}
                  keyboardType="numeric"
                  onChangeText={(value) => handleOtpChange(value, index)}
                  value={digit}
                  ref={(input) => {
                    inputs.current[index] = input;
                  }}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>
            <Button
              disabled={isLoading}
              style={styles.button}
              onPress={loadHome}
            >
              {t("confirmCodeScreen.text.confirmCode")}
            </Button>
            <Text style={styles.text}>
              {t("confirmCodeScreen.text.didntGetCode")}
              <Text
                style={{ fontWeight: "700", color: "#E60000" }}
                onPress={resendOTP}
              >
                {" "}
                {t("confirmCodeScreen.text.resendIt")}
              </Text>
            </Text>
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
        </View>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#D5D5D5",
    width: "14%",
    height: 40,
    margin: 10,
    textAlign: "center",
    fontSize: 20,
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
    marginHorizontal: 20,
    justifyContent: "space-around",
    paddingTop: StatusBar.currentHeight,
  },
  input: {
    width: "100%",
    height: 55,
    marginBottom: 30,
    borderColor: "#D5D5D5",
  },
  loginContainer: {
    width: "84%",
    marginTop: "52%",
    alignItems: "center",
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
});
export default ConfirmCodeScreen;
