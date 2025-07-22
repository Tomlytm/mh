import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";

interface AcceptTripProps {
  dismissModal: any;
}

export default function AcceptTrip(props: AcceptTripProps) {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/AcceptImage.png")} />
      <Text style={styles.decline}>
        {t("components.acceptTrip.messages.tripAccepted")}
      </Text>
      <Text style={styles.confirmText}>
        {t("components.acceptTrip.messages.confirmationText")}
      </Text>
      <Button style={styles.dismissButton} onPress={props.dismissModal}>
        {(evaProps: React.ComponentProps<typeof Text>) => (
          <Text
            {...evaProps}
            style={{ color: "#616161", fontWeight: "700", fontSize: 14 }}
          >
            {t("components.acceptTrip.buttons.dismiss.text")}
          </Text>
        )}
      </Button>
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
