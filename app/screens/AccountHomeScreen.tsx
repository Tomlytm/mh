import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useStoreState } from "../util/token.store";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "../components/LanguageDropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

interface AccountHomeScreenProps {
  navigation: any;
}

function AccountHomeScreen(props: AccountHomeScreenProps) {
  const riderFirstName = useStoreState((state) => state.data.riderFirstName);
  const riderLastName = useStoreState((state) => state.data.riderLastName);
  const { t } = useTranslation();
  
  const profileScale = React.useRef(new Animated.Value(1)).current;
  const settingsScale = React.useRef(new Animated.Value(1)).current;

  const updateProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    props.navigation.navigate("UpdateProfileScreen");
  };

  const accountSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    props.navigation.navigate("AccountSettingsScreen");
  };

  const handleProfilePressIn = () => {
    Animated.spring(profileScale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleProfilePressOut = () => {
    Animated.spring(profileScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleSettingsPressIn = () => {
    Animated.spring(settingsScale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handleSettingsPressOut = () => {
    Animated.spring(settingsScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.primary + "15", colors.support]}
        style={styles.headerSection}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {riderFirstName?.charAt(0)?.toUpperCase() || 'U'}
                {riderLastName?.charAt(0)?.toUpperCase() || 'S'}
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.nameText}>
            {riderFirstName} {riderLastName}
          </Text>
          <Text style={styles.roleText}>Logistics Rider</Text>
        </View>
      </LinearGradient>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <Animated.View style={{ transform: [{ scale: profileScale }] }}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={updateProfile}
            onPressIn={handleProfilePressIn}
            onPressOut={handleProfilePressOut}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <LinearGradient
                colors={[colors.primary + "20", colors.primary + "10"]}
                style={styles.menuIcon}
              >
                <MaterialCommunityIcons
                  name="account-edit"
                  size={20}
                  color={colors.primary}
                />
              </LinearGradient>
              <Text style={styles.menuText}>
                {t("screens.accountHomeScreen.options.updateProfile.text")}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: settingsScale }] }}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={accountSettings}
            onPressIn={handleSettingsPressIn}
            onPressOut={handleSettingsPressOut}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <LinearGradient
                colors={[colors.primary + "20", colors.primary + "10"]}
                style={styles.menuIcon}
              >
                <MaterialCommunityIcons
                  name="cog"
                  size={20}
                  color={colors.primary}
                />
              </LinearGradient>
              <Text style={styles.menuText}>
                {t("screens.accountHomeScreen.options.accountSettings.text")}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.languageSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <LanguageDropdown />
      </View>
    </ScrollView>
  );
}

export default AccountHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.support,
  },
  headerSection: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.secondary,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter",
    color: colors.textLight,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    flex: 1,
  },
  languageSection: {
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 32,
  },
});
