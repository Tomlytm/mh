import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
interface DeliveredOrderDetailProps {
  modalData: any;
}

export default function DeliveredOrderDetail(props: DeliveredOrderDetailProps) {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <View style={styles.dragHandle} />
      
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={colors.success}
          />
          <Text style={styles.statusText}>
            {t("components.deliveredOrderDetail.title")}
          </Text>
        </View>
      </View>

      <View style={styles.customerSection}>
        <LinearGradient
          colors={colors.gradient.primary}
          style={styles.customerAvatar}
        >
          <Text style={styles.avatarText}>
            {props.modalData?.customerFirstName?.charAt(0) || ""}
            {props.modalData?.customerLastName?.charAt(0) || ""}
          </Text>
        </LinearGradient>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>
            {props.modalData?.customerFirstName} {props.modalData?.customerLastName}
          </Text>
          <View style={styles.phoneContainer}>
            <MaterialCommunityIcons
              name="phone"
              size={16}
              color={colors.textLight}
            />
            <Text style={styles.customerPhone}>
              {props.modalData?.customerPhoneNumber}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.orderSection}>
        <View style={styles.orderCard}>
          <View style={styles.orderItem}>
            <Text style={styles.orderLabel}>
              {t("components.deliveredOrderDetail.orderNumber")}
            </Text>
            <Text style={styles.orderValue}>
              #{props.modalData?.orderDetailId}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.orderItem}>
            <Text style={styles.orderLabel}>
              {t("components.deliveredOrderDetail.orderItems")}
            </Text>
            <Text style={styles.orderItemName} numberOfLines={2}>
              {props.modalData?.orderName}
            </Text>
            <Text style={styles.orderQuantity}>
              {t("components.deliveredOrderDetail.orderQuantity")}: {props.modalData?.orderQuantity}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.addressSection}>
        <View style={styles.addressHeader}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.addressLabel}>
            {t("components.deliveredOrderDetail.address")}
          </Text>
        </View>
        <Text style={styles.addressText} numberOfLines={3}>
          {props.modalData?.customerAddress}
        </Text>
      </View>

      <View style={styles.completionBadge}>
        <MaterialCommunityIcons
          name="truck-check"
          size={24}
          color={colors.success}
        />
        <Text style={styles.completionText}>
          Order successfully delivered!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success + "15",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.success + "40",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.success,
    marginLeft: 8,
  },
  customerSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.support,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  customerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 6,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  customerPhone: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    marginLeft: 6,
  },
  orderSection: {
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: colors.support,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  orderItem: {
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.textLight,
    marginBottom: 6,
  },
  orderValue: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.primary,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  orderQuantity: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  addressSection: {
    backgroundColor: colors.support,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    lineHeight: 20,
    paddingLeft: 28,
  },
  completionBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.success + "15",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.success + "40",
  },
  completionText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.success,
    marginLeft: 12,
  },
});
