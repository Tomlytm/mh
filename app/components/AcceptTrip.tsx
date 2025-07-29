import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View, Text, TouchableOpacity, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

interface AcceptTripProps {
  dismissModal: any;
}

export default function AcceptTrip(props: AcceptTripProps) {
  const { t } = useTranslation();
  const buttonScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
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
            name="check-circle"
            size={80}
            color={colors.success}
          />
        </View>
        
        <Text style={styles.title}>
          {t("components.acceptTrip.messages.tripAccepted")}
        </Text>
        
        <Text style={styles.message}>
          {t("components.acceptTrip.messages.confirmationText")}
        </Text>
        
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={props.dismissModal}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {t("components.acceptTrip.buttons.dismiss.text")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
    minHeight: 320,
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
  button: {
    backgroundColor: colors.support,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
  },
});
