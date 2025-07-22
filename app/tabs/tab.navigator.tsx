import {
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AccountNavigator from "./account.navigator";
import App from "../screens/TripsScreen";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const screenOptions = (focused: any, route: any, color: any) => {
  const { t } = useTranslation();
  let iconName;

  switch (route?.name) {
    case `${t("screens.navigator.home")}`:
      iconName = focused ? "home" : "home-outline";
      break;
    case `${t("screens.navigator.trips")}`:
      iconName = focused ? "car" : "car-outline";
      break;
    case `${t("screens.navigator.account")}`:
      iconName = focused ? "settings-2" : "settings-2-outline";
      break;
    default:
      break;
  }

  return (
    // <Icon
    //   style={styles.icon}
    //   fill="#E60000"
    //   name={iconName ? iconName : "question-mark-circle-outline"}
    //   size={24}
    // />
    <TouchableWithoutFeedback>
      <View style={{ alignItems: "center" }}>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default function BottomTab() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size, color }) =>
          screenOptions(focused, route, color),
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600", color: "#E60000" },
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
  icon: {
    width: 32,
    height: 32,
  },
});
