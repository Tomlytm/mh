import { Button, Icon } from "@ui-kitten/components";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface PendingOrderDetailProps {
  toggleCancelTripModal: any;
  // confirmDelivery: (e: number) => void;
  toggleVerifyOTPModal: any;
  modalData: any;
}

export default function PendingOrderDetail(props: PendingOrderDetailProps) {
  const { t, i18n } = useTranslation();
  const [checked, setChecked] = useState(false);

  // const renderDeclineIcon = () => (
  //   // <Icon style={styles.icon} fill={colors.primary} name="close-outline" />
  // );
  // const renderAcceptIcon = () => (
  //   // <Icon style={styles.icon} fill="#F5F5F5" name="checkmark-outline" />
  // );
  const renderDeclineIcon = () => (
    <MaterialCommunityIcons
      name="close"
      size={24}
      color="#616161"
      style={styles.icon}
    />
  );
  const renderAcceptIcon = () => (
    <MaterialCommunityIcons
      name="check"
      size={24}
      color="#F5F5F5"
      style={styles.icon}
    />
  );


  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={{ fontSize: 16, fontWeight: "700", paddingVertical: 6 }}>
        {t("components.pendingOrderDetail.title")}
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
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <View style={{ width: "40%" }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#959595",
                }}
              >
                {t("components.pendingOrderDetail.orderNumber")}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "400" }}>
                {props.modalData.orderDetailId}
              </Text>
            </View>
            <View style={{ width: "60%" }}>
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#959595" }}
              >
                {t("components.pendingOrderDetail.orderItems")}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>
                    {props.modalData.orderName}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: "#757575",
                        marginTop: 8,
                        paddingRight: 16,
                      }}
                    >
                      {t("components.pendingOrderDetail.quantity")}:{" "}
                      {props.modalData.orderQuantity}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.addressContainer}>
          {/* <Icon style={styles.icon} fill="#757575" name="pin-outline" /> */}
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={24}
            color="#757575"
            style={styles.icon}
          />
          <View style={{ paddingLeft: 12, width: "80%" }}>
            <Text
              style={{
                color: "#757575",
                fontSize: 16,
                fontWeight: "700",
                marginVertical: 4,
              }}
            >
              {t("components.pendingOrderDetail.address")}
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
            paddingHorizontal: 10,
          }}
        >
          <Button
            accessoryLeft={renderAcceptIcon}
            style={styles.confirmButton}
            onPress={props.toggleVerifyOTPModal}
          >
            {(evaProps:any) => (
              <Text
                {...evaProps}
                style={{
                  paddingLeft: 10,
                  color: "#F5F5F5",
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {t("components.pendingOrderDetail.confirmDeliveryButton")}
              </Text>
            )}
          </Button>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  confirmButton: {
    borderRadius: 12,
    borderWidth: 0,
    display: "flex",
    backgroundColor: "#E60000",
    marginBottom: 30,
  },
  addressContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  container: {
    width: "auto",
    backgroundColor: "#FFF",
    alignItems: "center",
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cancelButton: {
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "#F5F5F5",
    display: "flex",
    backgroundColor: "#F5F5F5",
    marginBottom: 24,
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
    // marginTop: 10,
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    // height: 47,
    paddingVertical: 10,
    justifyContent: "space-between",
    borderTopWidth: 1,
    // backgroundColor: 'blue',
    borderTopColor: "#FFF3F3",
  },
});
