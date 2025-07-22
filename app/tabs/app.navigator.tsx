import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
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
            title: "Login",
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            },
          }}
          name="LoginScreen"
          component={LoginScreen}
        ></Screen>
        <Screen
          name="ConfirmCodeScreen"
          component={ConfirmCodeScreen}
          options={{
            title: "Verification",
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            },
          }}
        ></Screen>
        <Screen
          name="TermsAndConditionsScreen"
          component={TermsAndConditionsScreen}
          options={{
            title: "Terms & Conditions",
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            },
          }}
        ></Screen>
        <Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{
            title: "Forgot Password",
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            },
          }}
        ></Screen>
        <Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
          options={{
            title: "ResetPassword",
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            },
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
                    height: 40,
                    width: 40,
                    backgroundColor: "#353535",
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: 16,
                      color: "#fff",
                    }}
                  >
                    {riderFirstName.charAt(0).toUpperCase()}
                    {riderLastName.charAt(0).toUpperCase()}
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
