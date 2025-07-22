import { Icon, Text } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { orderInformation } from "../util/app.interface";
import { useTranslation } from "react-i18next";

interface SingleTripDetailedProps {
  toggleModal: any;
  data: orderInformation;
}

export default function SingleTripDetailed(props: SingleTripDetailedProps) {
  const { t, i18n } = useTranslation();
  return (
    <TouchableWithoutFeedback onPress={props.toggleModal}>
      <View style={styles.tripContainer}>
        <View style={styles.tripHeader}>
          <View style={{ paddingRight: 20 }}>
            <Text style={{ color: "#757575", fontSize: 12 }}>
              {t("components.singleTripDetailed.orderNumber")}
            </Text>
            <Text style={{ fontSize: 14 }}>{props.data.orderDetailId}</Text>
          </View>
          <View style={{ paddingLeft: 20, width: "60%" }}>
            <Text style={{ color: "#757575", fontSize: 12 }}>
              {t("components.singleTripDetailed.productName")}
            </Text>
            <Text style={{ fontSize: 14 }}>{props.data.orderName}</Text>
          </View>
        </View>
        <View style={styles.tripBody}>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              alignItems: "center",
            }}
          >
            {/* <Icon style={styles.icon} fill="#009CDE" name="pin-outline" /> */}
            <View>
              <Text style={{ color: "#757575", fontSize: 12 }}>
                {t("components.singleTripDetailed.address")}
              </Text>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {props.data.customerAddress}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.tripFooter}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: 32,
                width: 32,
                backgroundColor: "#E60000",
                borderRadius: 6,
                marginRight: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                {props.data.customerFirstName.charAt(0)}{" "}
                {props.data.customerLastName.charAt(0)}
              </Text>
            </View>
            <View style={{ paddingLeft: 5 }}>
              <Text>
                {props.data.customerFirstName} {props.data.customerLastName}
              </Text>
              <Text style={{ color: "#757575" }}>
                {props.data.customerPhoneNumber}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 16,
    height: 16,
  },
  tripBody: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  tripContainer: {
    borderRadius: 9,
    padding: 10,
    width: "100%",
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
  tripHeader: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF3F3",
  },
  tripFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#FFF3F3",
  },
});
