import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../config/colors";
import ConfirmCodeScreen from "../screens/ConfirmCodeScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import LoginScreen from "../screens/LoginScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import TermsAndConditionsScreen from "../screens/TermsAndConditionsScreen";
import BottomTab from "./tab.navigator";
import { useStoreState } from "../util/token.store";

const { Navigator, Screen } = createNativeStackNavigator();

function AppNavigator() {
  const riderFirstName = useStoreState((state) => state.data.riderFirstName);
  const riderLastName = useStoreState((state) => state.data.riderLastName);

  return (
    <NavigationContainer>
      <Navigator initialRouteName="LoginScreen">
        <Screen
          options={{
            headerShown: false,
          }}
          name="LoginScreen"
          component={LoginScreen}
        ></Screen>
        <Screen
          name="ConfirmCodeScreen"
          component={ConfirmCodeScreen}
          options={{
            title: "Verification",
            headerBackground: () => (
              <LinearGradient
                colors={colors.gradient.primary}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
            headerTintColor: colors.secondary,
            headerTitleStyle: {
              color: colors.secondary,
              fontSize: 18,
              fontWeight: "700",
              fontFamily: "Inter",
            },
            headerShadowVisible: true,
          }}
        ></Screen>
        <Screen
          name="TermsAndConditionsScreen"
          component={TermsAndConditionsScreen}
          options={{
            title: "Terms & Conditions",
            headerBackground: () => (
              <LinearGradient
                colors={colors.gradient.primary}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
            headerTintColor: colors.secondary,
            headerTitleStyle: {
              color: colors.secondary,
              fontSize: 18,
              fontWeight: "700",
              fontFamily: "Inter",
            },
            headerShadowVisible: true,
          }}
        ></Screen>
        <Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{
            title: "Forgot Password",
            headerBackground: () => (
              <LinearGradient
                colors={colors.gradient.primary}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
            headerTintColor: colors.secondary,
            headerTitleStyle: {
              color: colors.secondary,
              fontSize: 18,
              fontWeight: "700",
              fontFamily: "Inter",
            },
            headerShadowVisible: true,
          }}
        ></Screen>
        <Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
          options={{
            title: "Reset Password",
            headerBackground: () => (
              <LinearGradient
                colors={colors.gradient.primary}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
            headerTintColor: colors.secondary,
            headerTitleStyle: {
              color: colors.secondary,
              fontSize: 18,
              fontWeight: "700",
              fontFamily: "Inter",
            },
            headerShadowVisible: true,
          }}
        ></Screen>
        <Screen
          name="MyTabs"
          component={BottomTab}
          options={({ navigation }) => ({
            headerTitle: "",
            headerLeft: () => (
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("AccountHomeScreen")}
              >
                <View
                  style={{
                    height: 44,
                    width: 44,
                    backgroundColor: colors.primary,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                    elevation: 3,
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      textTransform: "uppercase",
                      fontSize: 16,
                      color: colors.secondary,
                      fontFamily: "Inter",
                    }}
                  >
                    {riderFirstName?.charAt(0)?.toUpperCase() || 'U'}
                    {riderLastName?.charAt(0)?.toUpperCase() || 'S'}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ),
            // headerRight: () => (
            //   <Icon
            //     style={{ width: 24, height: 24 }}
            //     // onPress={() => alert("This is a button!")}
            //     name="bell-outline"
            //     fill="#353535"
            //   />
            // ),
          })}
        ></Screen>
      </Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
