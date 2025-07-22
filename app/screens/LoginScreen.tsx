import { Button, Input, Text } from "@ui-kitten/components";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import constants from "../config/constants";
import ApiService from "../config/services";
import { riderData } from "../util/app.interface";
import { validateEmail } from "../util/helpers";
import { useStoreActions } from "../util/token.store";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";


interface LoginScreenProps {
  navigation: any;
}

function LoginScreen(props: LoginScreenProps) {
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const setRiderData = useStoreActions((actions) => actions.updateData);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const login = () => {
    Keyboard.dismiss();
    if (email === "" || password === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please input all fields",
      });
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();
    if (!validateEmail(cleanedEmail)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email",
      });
    } else {
      let user = {
        riderEmail: cleanedEmail,
        riderPassword: password,
      };

      setIsLoading(true);
      ApiService.login(user).then(async (response) => {
        setIsLoading(false);
        if (response?.status === 400) {
          Toast.show({
            type: "error",
            text1: "LOGIN ERROR",
            text2: response?.data?.message,
          });
        } else if (response?.status === 200) {
          const riderData: riderData = {
            userId: response?.data.userDetails.id,
            riderProfileId: 0,
            riderEmail: email,
            riderPassword: password,
            riderFirstName: response?.data.userDetails.firstName,
            riderLastName: response?.data.userDetails.lastName,
            riderPhoneNumber: response?.data.userDetails.phoneNumber,
            riderAddress: response?.data.userDetails.address_stree,
            riderCity: response?.data.userDetails.address_town,
            riderState: response?.data.userDetails.address_province,
            riderCountry: response?.data.userDetails.address_country,
            riderMFA: response?.data.userDetails?.mfaEnabled,
          };
          setRiderData(riderData);
          if (response?.data.userDetails?.mfaEnabled) {
            props.navigation.navigate("ConfirmCodeScreen");
          } else {
            await SecureStore.setItemAsync(
              constants.SECURE_TOKEN,
              response?.data.accessToken
            );
            const riderProfileResponse = await ApiService.getRiderProfile(
              response?.data.userDetails.id
            );

            if (riderProfileResponse.status === 404) {
              Toast.show({
                type: "error",
                text1: "LOGIN ERROR",
                text2: `No user profile attached to rider.`,
              });
              return;
            }

            setRiderData({
              ...riderData,
              riderProfileId: riderProfileResponse.id,
            });

            props.navigation.navigate("MyTabs");
          }

          setEmail("");
          setPassword("");
          setSecureTextEntry(true);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: `Something went wrong ${response.message}`,
          });
        }
      });
    }
  };

  const forgotPassword = () => {
    props.navigation.navigate("ForgotPasswordScreen");
  };

  const renderIcon = () => (
  <TouchableOpacity onPress={toggleSecureEntry}>
    <MaterialCommunityIcons
      name={secureTextEntry ? "eye-off" : "eye"}
      size={24}
      color="#8F9BB3"
    />
  </TouchableOpacity>
);


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Toast visibilityTime={1800} />
        <View style={styles.loginContainer}>
          <Input
            value={email}
            style={styles.input}
            size="large"
            placeholder={t("screens.login.text.emailAddress")}
            autoCapitalize="none"
            onChangeText={(nextValue) => setEmail(nextValue)}
          />
          <Input
            value={password}
            style={styles.input}
            size="large"
            placeholder={t("screens.login.text.password")}
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            onChangeText={(nextValue) => setPassword(nextValue)}
          />
          <Button disabled={isLoading} style={styles.button} onPress={login}>
            {t("screens.login.text.login")}
          </Button>
          <Text style={styles.text}>
            {t("screens.login.text.forgotPassword")}{" "}
            <Text
              style={{ color: "#E60000", fontWeight: "700" }}
              onPress={forgotPassword}
            >
              {t("screens.login.text.reset")}
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    borderWidth: 0,
    width: "100%",
    height: 55,
    backgroundColor: "#E60000",
    marginVertical: 16,
  },
  container: {
    alignItems: "center",
    justifyContent: "space-around",
  },
  input: {
    width: "100%",
    height: 55,
    marginBottom: 20,
  },
  loginContainer: {
    width: "84%",
    marginTop: "24%",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#616161",
  },
});
export default LoginScreen;
