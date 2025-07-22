import { Icon } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { orderInformation } from "../util/app.interface";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CompletedTripProps {
  toggleModal: any;
  data: orderInformation;
}

export default function CompletedTrip(props: CompletedTripProps) {
  const { t, i18n } = useTranslation();
  return (
    <TouchableWithoutFeedback onPress={props.toggleModal}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {/* <Icon style={styles.icon} fill="#EDD0D0" name="shopping-bag" /> */}
        </View>
        <View style={{ paddingLeft: 12, width: "80%" }}>
          <Text
            style={{
              color: "#757575",
              fontSize: 16,
              fontWeight: "700",
              marginVertical: 4,
            }}
          >
            {t("components.completedTrip.orderDetailId")}:{" "}
            {props.data.orderDetailId}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "400" }}>
            {props.data.customerFirstName} {props.data.customerLastName}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#757575", marginTop: 4, paddingRight: 16 }}>
              {props.data?.deliveryDate &&
                `${t("components.completedTrip.deliveryDate")}: ${new Date(
                  props.data?.deliveryDate.toString()
                ).toLocaleString()}`}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#959595"
          style={styles.arrowIcon}
        />

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    width: 24,
    height: 24,
  },
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderTopWidth: 2,
    borderTopColor: "#FFF3F3",
    paddingRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconContainer: {
    height: 48,
    width: 48,
    backgroundColor: "#000",
    opacity: 0.75,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
