import { StyleSheet, View, Image } from "react-native";
import React from "react";
import { Button, Text, Icon } from "@ui-kitten/components";
import colors from "../config/colors";
import CompletedTrip from "./CompletedTrip";
import { useTranslation } from "react-i18next";

export default function SuccessModal() {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Image source={require("../assets/AcceptImage.png")} />
      <Text style={styles.decline}>
        {t("components.successModal.successTitle")}
      </Text>
      <Text style={styles.confirmText}>
        {t("components.successModal.successMessage")}
      </Text>
      {/* <CompletedTrip /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  confirmText: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 26.4,
  },
  container: {
    width: "auto",
    height: 380,
    backgroundColor: "#FFF",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  decline: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  line: {
    width: 45,
    height: 5,
    backgroundColor: "#D5D5D5",
    marginVertical: 10,
  },
});
