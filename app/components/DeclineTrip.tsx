import { StyleSheet, View, Image } from "react-native";
import React from "react";
import { Button, Text, Icon } from "@ui-kitten/components";
import colors from "../config/colors";
import { useTranslation } from "react-i18next";

interface DeclineTripProps {
  confirmButton: any;
  dismissButton: any;
}

export default function DeclineTrip(props: DeclineTripProps) {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <Image
        style={{ marginBottom: 16 }}
        source={require("../assets/DeclineImage.png")}
      />
      <Text style={styles.decline}>{t("components.declineTrip.title")}</Text>
      <Text style={styles.confirmText}>
        {t("components.declineTrip.confirmationText")}
      </Text>
      <Button style={styles.confirmButton} onPress={props.confirmButton}>
        {t("components.declineTrip.confirmButton")}
      </Button>
      <Button style={styles.dismissButton} onPress={props.dismissButton}>
        {(evaProps:any) => (
          <Text
            {...evaProps}
            style={{ color: "#616161", fontWeight: "700", fontSize: 14 }}
          >
            {t("components.declineTrip.dismissButton")}
          </Text>
        )}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  confirmButton: {
    width: 225,
    height: 39,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 0,
    marginVertical: 10,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 26.4,
  },
  container: {
    width: "auto",
    // height: 420,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
  },
  decline: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  dismissButton: {
    width: 225,
    height: 39,
    borderRadius: 16,
    backgroundColor: "#D5D5D5",
    borderWidth: 0,
    marginVertical: 10,
  },
});
