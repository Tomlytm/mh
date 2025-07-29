import { StyleSheet, View, Text, Animated } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useTranslation } from "react-i18next";

export default function SuccessModal() {
  const { t } = useTranslation();
  const scaleAnimation = React.useRef(new Animated.Value(0)).current;
  const fadeAnimation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dragHandle} />
      
      <Animated.View 
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnimation }],
            opacity: fadeAnimation,
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[colors.success, colors.success + "DD"]}
            style={styles.successIcon}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={64}
              color={colors.secondary}
            />
          </LinearGradient>
        </View>
        
        <Text style={styles.title}>
          {t("components.successModal.successTitle")}
        </Text>
        
        <Text style={styles.message}>
          {t("components.successModal.successMessage")}
        </Text>

        <View style={styles.celebrationContainer}>
          <MaterialCommunityIcons
            name="party-popper"
            size={24}
            color={colors.primary}
            style={styles.partyIcon}
          />
          <Text style={styles.celebrationText}>Great job!</Text>
          <MaterialCommunityIcons
            name="party-popper"
            size={24}
            color={colors.primary}
            style={[styles.partyIcon, { transform: [{ scaleX: -1 }] }]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: 320,
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
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 28,
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
    paddingHorizontal: 20,
  },
  celebrationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary + "10",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  partyIcon: {
    marginHorizontal: 8,
  },
  celebrationText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.primary,
  },
});
