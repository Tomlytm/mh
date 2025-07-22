import { Icon } from "@ui-kitten/components";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface DeliveredOrderDetailProps {
  modalData: any;
}

export default function DeliveredOrderDetail(props: DeliveredOrderDetailProps) {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={{ fontSize: 16, fontWeight: "700", paddingVertical: 6 }}>
        {t("components.deliveredOrderDetail.title")}
      </Text>
      <View style={{ width: "100%", paddingTop: 10 }}>
        <View style={styles.tripHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 36,
                width: 36,
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
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                {props.modalData.customerFirstName.charAt(0)}{" "}
                {props.modalData.customerLastName.charAt(0)}
              </Text>
            </View>
            <View style={{ paddingLeft: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                {props.modalData.customerFirstName}{" "}
                {props.modalData.customerLastName}
              </Text>
              <Text style={{ color: "#757575" }}>
                {props.modalData.customerPhoneNumber}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.orderContainer}>
          <View style={{ width: "50%" }}>
            <Text style={styles.textTitle}>
              {t("components.deliveredOrderDetail.orderNumber")}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400" }}>
              {props.modalData.orderDetailId}
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text style={styles.textTitle}>
              {t("components.deliveredOrderDetail.orderItems")}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  flexShrink: 1,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {props.modalData.orderName}
              </Text>
              <Text
                style={{
                  color: "#757575",
                  marginTop: 8,
                  paddingRight: 16,
                }}
              >
                {t("components.deliveredOrderDetail.orderQuantity")}:{" "}
                {props.modalData.orderQuantity}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.addressContainer}><MaterialCommunityIcons
  name="map-marker-outline"
  size={24}
  color="#757575"
  style={styles.icon}
/>



          <View style={{ paddingLeft: 12, width: "80%" }}>
            <Text style={styles.textTitle}>
              {t("components.deliveredOrderDetail.address")}
            </Text>
            <Text
              style={{ fontSize: 14, fontWeight: "400" }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {props.modalData.customerAddress}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addressContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  container: {
    width: "auto",
    backgroundColor: "#FFF",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
  },
  deliveredText: {
    backgroundColor: "#E1FFF2",
    width: 117,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    fontWeight: "700",
  },
  line: {
    width: 45,
    height: 5,
    backgroundColor: "#D5D5D5",
    marginBottom: 2,
  },
  orderContainer: {
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    marginTop: 10,
    padding: 10,
    flexDirection: "row",
    marginBottom: 20,
  },
  tripFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#FFF3F3",
  },

  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#FFF3F3",
  },
  textTitle: { fontSize: 14, fontWeight: "700", color: "#959595" },
});
