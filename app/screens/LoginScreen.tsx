import { Text, TextInput, Animated } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import { useState, useRef } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import constants from "../config/constants";
import colors from "../config/colors";
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
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  const emailBorderColor = useRef(new Animated.Value(0)).current;
  const passwordBorderColor = useRef(new Animated.Value(0)).current;

  const setRiderData = useStoreActions((actions) => actions.updateData);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleButtonPressIn = () => {
    console.log("Button press IN detected - button is responsive");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleButtonPressOut = () => {
    console.log("Button press OUT detected - button released");
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
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

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    Animated.timing(passwordBorderColor, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    Animated.timing(passwordBorderColor, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const login = async () => {
    console.log("Login function called!");
    console.log("Current isLoading state:", isLoading);
    console.log("Email:", email);
    console.log("Password:", password);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    
    if (email === "" || password === "") {
      console.log("Validation failed: empty fields");
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please enter both email and password to continue.",
        visibilityTime: 3000,
        position: "top",
        topOffset: 60,
      });
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();
    console.log("Cleaned email:", cleanedEmail);
    
    if (!validateEmail(cleanedEmail)) {
      console.log("Email validation failed");
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Invalid Email Format",
        text2: "Please enter a valid email address (e.g., user@example.com).",
        visibilityTime: 3000,
        position: "top",
        topOffset: 60,
      });
      return;
    }
    
    console.log("Email validation passed, preparing API call");
    let user = {
      riderEmail: cleanedEmail,
      riderPassword: password,
    };
    console.log("User object:", user);

    setIsLoading(true);
    console.log("Starting API call...");
    
    try {
      const response = await ApiService.login(user);
      console.log("API Response received:", response);
      setIsLoading(false);
      
      if (response?.status === 400) {
        console.log("Login failed with 400 error:", response?.data?.message);
        Toast.show({
          type: "error",
          text1: "Authentication Failed",
          text2: "Invalid email or password. Please check your credentials and try again.",
          visibilityTime: 4000,
          position: "top",
          topOffset: 60,
        });
      } else if (response?.status === 200) {
        console.log("Login successful! Processing user data...");
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
        console.log("Rider data object:", riderData);
        setRiderData(riderData);
        
        if (response?.data.userDetails?.mfaEnabled) {
          console.log("MFA enabled, navigating to ConfirmCodeScreen");
          props.navigation.navigate("ConfirmCodeScreen");
        } else {
          console.log("MFA not enabled, storing token and getting rider profile");
          await SecureStore.setItemAsync(
            constants.SECURE_TOKEN,
            response?.data.accessToken
          );
          
          const riderProfileResponse = await ApiService.getRiderProfile(
            response?.data.userDetails.id
          );
          console.log("Rider profile response:", riderProfileResponse);

          if (riderProfileResponse.status === 404) {
            console.log("No rider profile found");
            Toast.show({
              type: "error",
              text1: "Profile Not Found",
              text2: "Your account doesn't have a rider profile. Please contact support.",
              visibilityTime: 4000,
              position: "top",
              topOffset: 60,
            });
            return;
          }

          setRiderData({
            ...riderData,
            riderProfileId: riderProfileResponse.id,
          });

          console.log("Navigation to MyTabs");
          props.navigation.navigate("MyTabs");
        }

        setEmail("");
        setPassword("");
        setSecureTextEntry(true);
      } else {
        console.log("Unexpected response status:", response?.status, response?.message);
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "An unexpected error occurred. Please try again later.",
          visibilityTime: 4000,
          position: "top",
          topOffset: 60,
        });
      }
    } catch (error) {
      console.log("API call failed with error:", error);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Unable to connect to server. Please check your internet connection and try again.",
        visibilityTime: 4000,
        position: "top",
        topOffset: 60,
      });
    }
  };

  const forgotPassword = () => {
    props.navigation.navigate("ForgotPasswordScreen");
  };

  const renderIcon = () => (
    <TouchableOpacity 
      onPress={toggleSecureEntry}
      style={styles.eyeIcon}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={secureTextEntry ? "eye-off" : "eye"}
        size={22}
        color={passwordFocused ? colors.primary : colors.textLight}
      />
    </TouchableOpacity>
  );

  const animatedEmailBorderColor = emailBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  const animatedPasswordBorderColor = passwordBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Toast 
          config={{
            error: (props) => (
              <View style={{
                backgroundColor: colors.error || '#FF4444',
                borderRadius: 12,
                padding: 16,
                marginHorizontal: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}>
                <Text style={{
                  color: colors.secondary,
                  fontSize: 16,
                  fontWeight: '700',
                  fontFamily: 'Inter',
                  marginBottom: 4,
                }}>
                  {props.text1}
                </Text>
                <Text style={{
                  color: colors.secondary,
                  fontSize: 14,
                  fontWeight: '400',
                  fontFamily: 'Inter',
                  lineHeight: 20,
                }}>
                  {props.text2}
                </Text>
              </View>
            ),
          }}
        />
        <View style={styles.loginContainer}>
          {/* Vodafone Logo Section */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.logoCircle}
            >
              <MaterialCommunityIcons
                name="cellphone-wireless"
                size={48}
                color={colors.secondary}
              />
            </LinearGradient>
            <Text style={styles.logoText}>Vodafone</Text>
            <Text style={styles.logoSubtext}>Logistics Rider Mobile</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {t("screens.login.text.emailAddress")}
            </Text>
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
                placeholder={t("screens.login.text.emailAddress")}
                placeholderTextColor={colors.textLight}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(nextValue) => setEmail(nextValue)}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
              />
            </Animated.View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {t("screens.login.text.password")}
            </Text>
            <Animated.View
              style={[
                styles.inputWrapper,
                { borderColor: animatedPasswordBorderColor },
              ]}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={passwordFocused ? colors.primary : colors.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                value={password}
                style={styles.passwordInput}
                placeholder={t("screens.login.text.password")}
                placeholderTextColor={colors.textLight}
                secureTextEntry={secureTextEntry}
                onChangeText={(nextValue) => setPassword(nextValue)}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
              />
              {renderIcon()}
            </Animated.View>
          </View>

          <TouchableOpacity
            disabled={isLoading}
            onPress={() => {
              console.log("=== MAIN LOGIN BUTTON PRESSED ===");
              console.log("Button is responding - calling login function...");
              console.log("Button disabled state:", isLoading);
              login();
            }}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            style={[styles.buttonTouchable, { opacity: isLoading ? 0.6 : 1 }]}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <LinearGradient
                colors={colors.gradient.primary}
                style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons
                  name="login"
                  size={20}
                  color={colors.secondary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>
                  {t("screens.login.text.login")}
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>


          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.text}>
              {t("screens.login.text.forgotPassword")}{" "}
            </Text>
            <TouchableOpacity onPress={forgotPassword} activeOpacity={0.7}>
              <Text style={styles.resetText}>
                {t("screens.login.text.reset")}
              </Text>
            </TouchableOpacity>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: colors.support,
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    width: "88%",
    maxWidth: 400,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  logoSubtext: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    textAlign: "center",
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
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
    color: colors.text,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  buttonTouchable: {
    width: "100%",
    marginVertical: 24,
    minHeight: 56,
    zIndex: 999,
  },
  button: {
    flexDirection: "row",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.primary,
  },
});
export default LoginScreen;
