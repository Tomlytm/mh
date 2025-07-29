import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { orderInformation } from "../util/app.interface";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
interface SingleTripProps {
  toggleModal: any;
  data: orderInformation;
}

export default function SingleTrip(props: SingleTripProps) {
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
          styles.container,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name="map-marker" 
            size={20} 
            color={colors.primary} 
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.orderIdText}>
            {t("components.singleTrip.orderDetailId")} #{props.data.orderDetailId}
          </Text>
          <Text
            style={styles.addressText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {props.data.customerAddress}
          </Text>
        </View>
        <View style={styles.chevronContainer}>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={20} 
            color={colors.textLight} 
          />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
  },
  orderIdText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.text,
    fontFamily: "Inter",
    lineHeight: 20,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
