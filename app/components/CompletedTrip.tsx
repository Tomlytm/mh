import React, { useRef } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { orderInformation } from "../util/app.interface";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

interface CompletedTripProps {
  toggleModal: any;
  data: orderInformation;
}

export default function CompletedTrip(props: CompletedTripProps) {
  const { t } = useTranslation();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableWithoutFeedback
        onPress={props.toggleModal}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.container}>
          <LinearGradient
            colors={[colors.success + "15", colors.success + "08"]}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={28}
              color={colors.success}
            />
          </LinearGradient>

          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.orderIdText}>
                {t("components.completedTrip.orderDetailId")}: #{props.data.orderDetailId}
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>

            <Text style={styles.customerName}>
              {props.data.customerFirstName} {props.data.customerLastName}
            </Text>

            {props.data?.deliveryDate && (
              <View style={styles.dateRow}>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={16}
                  color={colors.textLight}
                  style={styles.dateIcon}
                />
                <Text style={styles.dateText}>
                  {t("components.completedTrip.deliveryDate")}: {new Date(
                    props.data.deliveryDate.toString()
                  ).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.arrowContainer}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.textLight}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  iconContainer: {
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.textLight,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: colors.success + "15",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.success,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.support,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});