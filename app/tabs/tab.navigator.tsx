import {
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Animated,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import AccountNavigator from "./account.navigator";
import App from "../screens/TripsScreen";
import { useTranslation } from "react-i18next";
import colors from "../config/colors";
import { useRef, useEffect } from "react";

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, route }: { focused: boolean; route: any }) => {
  const { t } = useTranslation();
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (focused) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scaleValue, {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [focused]);

  let iconName;
  switch (route?.name) {
    case t("screens.navigator.home"):
      iconName = focused ? "home" : "home-outline";
      break;
    case t("screens.navigator.trips"):
      iconName = focused ? "truck-delivery" : "truck-delivery-outline";
      break;
    case t("screens.navigator.account"):
      iconName = focused ? "account-circle" : "account-circle-outline";
      break;
    default:
      iconName = "help-circle-outline";
      break;
  }

  return (
    <Animated.View
      style={[
        styles.tabIconContainer,
        {
          transform: [{ scale: scaleValue }],
          backgroundColor: focused ? colors.primary + "15" : "transparent",
        },
      ]}
    >
      <MaterialCommunityIcons
        name={iconName as any}
        size={24}
        color={focused ? colors.primary : colors.textLight}
      />
    </Animated.View>
  );
};

export default function BottomTab() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} route={route} />,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          fontFamily: "Inter",
          marginTop: -2,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen name={t("screens.navigator.home")} component={HomeScreen} />
      <Tab.Screen name={t("screens.navigator.trips")} component={App} />
      <Tab.Screen
        name={t("screens.navigator.account")}
        component={AccountNavigator}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
