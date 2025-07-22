import { Button, Icon } from "@ui-kitten/components";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface NewOrderDetailProps {
  toggleDeclineModal: any;
  toggleAcceptModal: any;
  modalData: any;
}

export default function NewOrderDetail(props: NewOrderDetailProps) {
  const { t, i18n } = useTranslation();
  // const renderDeclineIcon = () => (
  //   // <Icon style={styles.icon} fill="#616161" name="close-outline" />
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
        {t("components.newOrderDetail.title")}
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
            <View style={{ width: "50%" }}>
              <Text style={styles.textTitle}>
                {t("components.newOrderDetail.orderNumber")}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "400" }}>
                {props.modalData.orderDetailId}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "50%" }}>
              <Text style={styles.textTitle}>
                {t("components.newOrderDetail.productName")}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "400" }}>
                {props.modalData.orderName}
              </Text>
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
            <Text style={styles.textTitle}>
              {t("components.newOrderDetail.address")}
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
            justifyContent: "space-between",
            paddingHorizontal: 24,
          }}
        >
          <Button
            accessoryLeft={renderDeclineIcon}
            style={styles.declineButton}
            onPress={() => props.toggleDeclineModal(1)}
          >
            {(evaProps: any) => (
              <Text {...evaProps} style={{ paddingLeft: 10, color: "#616161" }}>
                {t("components.newOrderDetail.declineButton")}
              </Text>
            )}
          </Button>
          <Button
            accessoryLeft={renderAcceptIcon}
            style={styles.acceptButton}
            onPress={() => props.toggleAcceptModal(2)}
          >
            {(evaProps: any) => (
              <Text {...evaProps} style={{ paddingLeft: 10, color: "#F5F5F5" }}>
                {t("components.newOrderDetail.acceptButton")}
              </Text>
            )}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  acceptButton: {
    borderRadius: 12,
    borderWidth: 0,
    display: "flex",
    backgroundColor: "#E60000",
    marginBottom: 30,
  },
  declineButton: {
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "#F5F5F5",
    display: "flex",
    backgroundColor: "#F5F5F5",
    marginBottom: 24,
  },
  container: {
    width: "auto",
    // height: "50%",
    backgroundColor: "#FFF",
    alignItems: "center",
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // justifyContent: "space-between",
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
    // height: "32%",
    // marginTop: 16,
    padding: 10,
  },
  addressContainer: {
    // height: 128,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
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

  textTitle: { fontSize: 14, fontWeight: "700", color: "#959595" },
});
