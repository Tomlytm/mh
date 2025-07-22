import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SingleTrip from "./SingleTrip";
import { Button, Icon, Input } from "@ui-kitten/components";
import { TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

interface ChangePasswordProps {
  toggleDeclineModal: any;
  toggleAcceptModal: any;
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={{ fontSize: 21, fontWeight: "700", marginBottom: 20 }}>
        {t("components.changePassword.title")}
      </Text>
      <TextInput
        style={styles.input}
        dense={true}
        mode="outlined"
        label={t("components.changePassword.placeholders.currentPassword")}
        value={currentPassword}
        placeholder={t(
          "components.changePassword.placeholders.currentPassword"
        )}
        onChangeText={(text) => setCurrentPassword(text)}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label={t("components.changePassword.placeholders.newPassword")}
        value={newPassword}
        placeholder={t("components.changePassword.placeholders.newPassword")}
        onChangeText={(text) => setNewPassword(text)}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label={t("components.changePassword.placeholders.confirmNewPassword")}
        value={confirmNewPassword}
        placeholder={t(
          "components.changePassword.placeholders.confirmNewPassword"
        )}
        onChangeText={(text) => setConfirmNewPassword(text)}
      />
      <Button
        style={styles.acceptButton}
        // onPress={() => props.toggleAcceptModal(2)}
      >
        {(evaProps:any) => (
          <Text
            {...evaProps}
            style={{ fontWeight: "700", fontSize: 14, color: "#F5F5F5" }}
          >
            {t("components.changePassword.buttons.changePassword.text")}
          </Text>
        )}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  declineButton: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#F5F5F5",
    width: "40%",
    height: 40,
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginBottom: 30,
  },
  acceptButton: {
    borderRadius: 16,
    borderWidth: 0,
    width: 225,
    height: 40,
    justifyContent: "center",
    backgroundColor: "#E60000",
    marginTop: 24,
  },
  container: {
    width: "auto",
    height: 420,
    backgroundColor: "#FFF",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFF",
    marginBottom: 16,
    paddingBottom: 10,
  },
  line: {
    width: 45,
    height: 5,
    backgroundColor: "#D5D5D5",
    marginVertical: 10,
    borderRadius: 16,
  },
});
