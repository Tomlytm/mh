import { StyleSheet, View, Text, TouchableOpacity, Animated } from "react-native";
import React from "react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useTranslation } from "react-i18next";

interface DeclineTripProps {
  confirmButton: any;
  dismissButton: any;
}

export default function DeclineTrip(props: DeclineTripProps) {
  const { t } = useTranslation();
  const confirmScale = React.useRef(new Animated.Value(1)).current;
  const dismissScale = React.useRef(new Animated.Value(1)).current;

  const handleConfirmPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(confirmScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleConfirmPressOut = () => {
    Animated.spring(confirmScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleDismissPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(dismissScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleDismissPressOut = () => {
    Animated.spring(dismissScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.secondary, colors.support]}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={80}
            color={colors.warning}
          />
        </View>
        
        <Text style={styles.title}>
          {t("components.declineTrip.title")}
        </Text>
        
        <Text style={styles.message}>
          {t("components.declineTrip.confirmationText")}
        </Text>
        
        <View style={styles.buttonContainer}>
          <Animated.View style={[{ transform: [{ scale: confirmScale }] }, styles.buttonWrapper]}>
            <TouchableOpacity
              onPress={props.confirmButton}
              onPressIn={handleConfirmPressIn}
              onPressOut={handleConfirmPressOut}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradient.primary}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>
                  {t("components.declineTrip.confirmButton")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={[{ transform: [{ scale: dismissScale }] }, styles.buttonWrapper]}>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={props.dismissButton}
              onPressIn={handleDismissPressIn}
              onPressOut={handleDismissPressOut}
              activeOpacity={0.8}
            >
              <Text style={styles.dismissButtonText}>
                {t("components.declineTrip.dismissButton")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  gradient: {
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 360,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  buttonWrapper: {
    width: "100%",
  },
  confirmButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
  dismissButton: {
    backgroundColor: colors.support,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
  },
});
