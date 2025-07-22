// import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AccountHomeScreen from "../screens/AccountHomeScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import UpdateProfileScreen from "../screens/UpdateProfileScreen";

const { Navigator, Screen } = createNativeStackNavigator();

function AccountNavigator() {
  return (
    <Navigator initialRouteName="AccountHomeScreen">
      <Screen
        options={{ headerShown: false }}
        name="AccountHomeScreen"
        component={AccountHomeScreen}
      ></Screen>
      <Screen
        name="UpdateProfileScreen"
        component={UpdateProfileScreen}
        options={{ headerShown: false }}
      ></Screen>
      <Screen
        name="AccountSettingsScreen"
        component={AccountSettingsScreen}
        options={{ headerShown: false }}
      ></Screen>
    </Navigator>
  );
}

export default AccountNavigator;
