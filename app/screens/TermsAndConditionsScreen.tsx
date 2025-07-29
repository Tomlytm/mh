import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useTranslation } from "react-i18next";

interface TermsAndConditionScreenProps {
  navigation: any;
}

function TermsAndConditionsScreen(props: TermsAndConditionScreenProps) {
  const { t } = useTranslation();
  const buttonScale = React.useRef(new Animated.Value(1)).current;

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const loadRootTab = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    props.navigation.navigate("MyTabs");
  };

  const termsData = [
    {
      icon: "shield-check-outline",
      title: "Data Protection & Privacy",
      content: "We are committed to protecting your personal information and respecting your privacy. All data collected is used solely for improving your delivery experience and is stored securely using industry-standard encryption.",
    },
    {
      icon: "map-marker-check-outline", 
      title: "Location Tracking",
      content: "Location services are used to optimize delivery routes, provide real-time tracking to customers, and ensure accurate delivery confirmations. Location data is only collected during active delivery periods.",
    },
    {
      icon: "clock-check-outline",
      title: "Time Tracking & Scheduling",
      content: "Working hours and delivery times are tracked to ensure fair compensation and maintain service quality standards. This helps us optimize scheduling and provide accurate delivery estimates to customers.",
    },
    {
      icon: "account-check-outline",
      title: "Account Responsibilities",
      content: "As a delivery rider, you agree to maintain professional conduct, handle deliveries with care, and communicate effectively with customers. Your account must remain active and in good standing.",
    },
    {
      icon: "handshake-outline",
      title: "Service Agreement",
      content: "This agreement outlines the terms of service between you and Markethub. By using this application, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary + "10", colors.support]}
        style={styles.headerSection}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="file-document-check-outline"
            size={64}
            color={colors.primary}
          />
        </View>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.subtitle}>
          Please review our terms of service and privacy policy
        </Text>
      </LinearGradient>

      <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introText}>
            Welcome to Markethub Logistics Rider Mobile. By using this application, 
            you agree to comply with and be bound by the following terms and conditions.
          </Text>
        </View>

        {termsData.map((item, index) => (
          <View key={index} style={styles.termCard}>
            <View style={styles.termHeader}>
              <View style={styles.termIconContainer}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.termTitle}>{item.title}</Text>
            </View>
            <Text style={styles.termContent}>{item.content}</Text>
          </View>
        ))}

        <View style={styles.footerSection}>
          <View style={styles.agreementBox}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={colors.primary}
              style={styles.infoIcon}
            />
            <Text style={styles.agreementText}>
              By tapping "Agree & Continue", you acknowledge that you have read, 
              understood, and agree to be bound by Markethub's{" "}
              <Text style={styles.linkText}>Terms & Conditions</Text> and{" "}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={loadRootTab}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={colors.gradient.primary}
                style={styles.agreeButton}
              >
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={20}
                  color={colors.secondary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.agreeButtonText}>Agree & Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.support,
  },
  headerSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 24,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  introText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.text,
    lineHeight: 24,
    textAlign: "center",
  },
  termCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  termHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  termIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  termTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    flex: 1,
  },
  termContent: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    lineHeight: 22,
  },
  footerSection: {
    marginTop: 24,
    marginBottom: 40,
  },
  agreementBox: {
    flexDirection: "row",
    backgroundColor: colors.primary + "08",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  agreementText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.text,
    lineHeight: 20,
    flex: 1,
  },
  linkText: {
    color: colors.primary,
    fontWeight: "600",
  },
  agreeButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  agreeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
});
export default TermsAndConditionsScreen;
