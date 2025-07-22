import { Button, Input, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";

interface CancellingReasonProps {
  toggleDismiss: any;
  toggleSubmit: (reason: string, reasonValue: string) => void;
}

export default function CancellingReasonModal(props: CancellingReasonProps) {
  const [value, setValue] = useState("customerUnavailable");
  const [reasonValue, setReasonValue] = useState("");
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <Text category="h5">{t("components.cancellingReasonModal.title")}</Text>
      <RadioButton.Group
        onValueChange={(newValue: any) => setValue(newValue)}
        value={value}
      >
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          <RadioButton value="customerUnavailable" />
          <View>
            <Text style={styles.reasonHeader}>
              {t(
                "components.cancellingReasonModal.reasons.customerUnavailable.header"
              )}
            </Text>
            <Text style={styles.reasonBody}>
              {t(
                "components.cancellingReasonModal.reasons.customerUnavailable.body"
              )}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          <RadioButton value="others" />
          <View>
            <Text style={styles.reasonHeader}>
              {t("components.cancellingReasonModal.reasons.others.header")}
            </Text>
            <Text style={styles.reasonBody}>
              {t("components.cancellingReasonModal.reasons.others.body")}
            </Text>
          </View>
        </View>
        <Input
          multiline={true}
          value={reasonValue}
          textStyle={{ minHeight: 90 }}
          style={styles.input}
          placeholder={t(
            "components.cancellingReasonModal.placeholders.additionalInformation"
          )}
          onChangeText={(nextValue) => setReasonValue(nextValue)}
        />
      </RadioButton.Group>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 24,
        }}
      >
        <Button style={styles.declineButton} onPress={props.toggleDismiss}>
          {(evaProps:any) => (
            <Text
              {...evaProps}
              style={{ color: "#616161", fontSize: 14, fontWeight: "700" }}
            >
              {t("components.cancellingReasonModal.buttons.dismiss.text")}
            </Text>
          )}
        </Button>
        <Button
          style={styles.acceptButton}
          onPress={() => props.toggleSubmit(value, reasonValue)}
        >
          {(evaProps: any) => (
            <Text
              {...evaProps}
              style={{ color: "#F5F5F5", fontSize: 14, fontWeight: "700" }}
            >
              {t("components.cancellingReasonModal.buttons.submit.text")}
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  acceptButton: {
    borderRadius: 16,
    borderWidth: 0,
    width: "30%",
    height: 48,
    justifyContent: "center",
    backgroundColor: "#E60000",
  },
  declineButton: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#F5F5F5",
    width: "30%",
    height: 48,
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginRight: 24,
  },
  container: {
    width: "auto",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D5D5D5",
    marginTop: 10,
  },
  reasonBody: {
    fontSize: 12,
    fontWeight: "400",
    color: "#757575",
  },
  reasonHeader: {
    fontSize: 16,
    fontWeight: "700",
  },
});
