import React from "react";
import { StyleSheet, View } from "react-native";
import AccountNavigator from "../tabs/account.navigator";
import colors from "../config/colors";

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <AccountNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.support,
  },
});
