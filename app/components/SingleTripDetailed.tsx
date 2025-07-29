import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View, Text, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { orderInformation } from "../util/app.interface";
import { useTranslation } from "react-i18next";
import colors from "../config/colors";

interface SingleTripDetailedProps {
  toggleModal: any;
  data: orderInformation;
}

export default function SingleTripDetailed(props: SingleTripDetailedProps) {
  const { t } = useTranslation();
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  return (
    <TouchableWithoutFeedback 
      onPress={props.toggleModal}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          styles.tripContainer,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        <LinearGradient
          colors={[colors.secondary, colors.support]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.recommendedBadge}>
            <MaterialCommunityIcons name="star" size={12} color={colors.secondary} />
            <Text style={styles.recommendedText}>Recommended</Text>
          </View>
          
          <View style={styles.tripHeader}>
            <View style={styles.headerItem}>
              <Text style={styles.labelText}>
                {t("components.singleTripDetailed.orderNumber")}
              </Text>
              <Text style={styles.valueText}>#{props.data.orderDetailId}</Text>
            </View>
            <View style={styles.headerItem}>
              <Text style={styles.labelText}>
                {t("components.singleTripDetailed.productName")}
              </Text>
              <Text style={styles.valueText} numberOfLines={1}>
                {props.data.orderName}
              </Text>
            </View>
          </View>
          
          <View style={styles.tripBody}>
            <View style={styles.addressRow}>
              <View style={styles.locationIconContainer}>
                <MaterialCommunityIcons 
                  name="map-marker" 
                  size={16} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.labelText}>
                  {t("components.singleTripDetailed.address")}
                </Text>
                <Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">
                  {props.data.customerAddress}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.tripFooter}>
            <View style={styles.customerRow}>
              <View style={styles.customerAvatar}>
                <Text style={styles.avatarText}>
                  {props.data.customerFirstName.charAt(0)}
                  {props.data.customerLastName.charAt(0)}
                </Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>
                  {props.data.customerFirstName} {props.data.customerLastName}
                </Text>
                <Text style={styles.customerPhone}>
                  {props.data.customerPhoneNumber}
                </Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>${props.data.logisticsPrice}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  tripContainer: {
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  gradientBackground: {
    padding: 20,
  },
  recommendedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  recommendedText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Inter",
    marginLeft: 4,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 8,
  },
  headerItem: {
    flex: 1,
    marginRight: 16,
  },
  labelText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Inter",
    marginBottom: 4,
  },
  valueText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
  },
  tripBody: {
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  locationIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    lineHeight: 20,
  },
  tripFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  customerAvatar: {
    height: 40,
    width: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 14,
    color: colors.secondary,
    fontFamily: "Inter",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
    marginBottom: 2,
  },
  customerPhone: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Inter",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceLabel: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Inter",
    marginBottom: 2,
  },
  priceValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
  },
});
