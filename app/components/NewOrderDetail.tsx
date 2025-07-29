import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, TouchableOpacity, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../config/colors";
interface NewOrderDetailProps {
  toggleDeclineModal: any;
  toggleAcceptModal: any;
  modalData: any;
}

export default function NewOrderDetail(props: NewOrderDetailProps) {
  const { t } = useTranslation();
  const declineScale = React.useRef(new Animated.Value(1)).current;
  const acceptScale = React.useRef(new Animated.Value(1)).current;

  const handleDeclinePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(declineScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleDeclinePressOut = () => {
    Animated.spring(declineScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleAcceptPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(acceptScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleAcceptPressOut = () => {
    Animated.spring(acceptScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.dragHandle} />
      <Text style={styles.modalTitle}>
        {t("components.newOrderDetail.title")}
      </Text>
      <View style={{ width: "100%", paddingTop: 10 }}>
        <View style={styles.tripHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.customerAvatar}>
              <Text style={styles.avatarText}>
                {props.modalData.customerFirstName.charAt(0)}
                {props.modalData.customerLastName.charAt(0)}
              </Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>
                {props.modalData.customerFirstName}{" "}
                {props.modalData.customerLastName}
              </Text>
              <Text style={styles.customerPhone}>
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
        <View style={styles.buttonContainer}>
          <Animated.View style={[{ transform: [{ scale: declineScale }] }, styles.buttonWrapper]}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => props.toggleDeclineModal(1)}
              onPressIn={handleDeclinePressIn}
              onPressOut={handleDeclinePressOut}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={colors.textLight}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.declineButtonText}>
                {t("components.newOrderDetail.declineButton")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={[{ transform: [{ scale: acceptScale }] }, styles.buttonWrapper]}>
            <TouchableOpacity
              onPress={() => props.toggleAcceptModal(2)}
              onPressIn={handleAcceptPressIn}
              onPressOut={handleAcceptPressOut}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradient.primary}
                style={styles.acceptButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={colors.secondary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.acceptButtonText}>
                  {t("components.newOrderDetail.acceptButton")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    textAlign: "center",
    marginBottom: 24,
  },
  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  customerAvatar: {
    height: 44,
    width: 44,
    backgroundColor: colors.primary,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 16,
    color: colors.secondary,
    fontFamily: "Inter",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
  },
  orderContainer: {
    backgroundColor: colors.support,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textTitle: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.textLight,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
  declineButton: {
    backgroundColor: colors.support,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.textLight,
  },
  acceptButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.secondary,
  },
});
