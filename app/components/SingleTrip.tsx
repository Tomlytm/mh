import { Icon } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { orderInformation } from "../util/app.interface";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface SingleTripProps {
  toggleModal: any;
  data: orderInformation;
}

export default function SingleTrip(props: SingleTripProps) {
  const { t, i18n } = useTranslation();
  return (
    <TouchableWithoutFeedback onPress={props.toggleModal}>
      <View style={styles.container}>
        
        <MaterialCommunityIcons style={styles.icon} name="map-marker-outline" size={24} color="#757575" />
        <View style={{ paddingLeft: 12, width: "80%" }}>
          <Text
            style={{
              color: "#757575",
              fontSize: 16,
              fontWeight: "700",
              marginVertical: 4,
            }}
          >
            {t("components.singleTrip.orderDetailId")}{" "}
            {props.data.orderDetailId}
          </Text>
          <Text
            style={{ fontSize: 16, fontWeight: "400" }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {t("components.singleTrip.customerAddress")}:{" "}
            {props.data.customerAddress}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    paddingBottom: 16,
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "#FFF3F3",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
