import React from "react";
import { StyleSheet, View } from "react-native";
import {Text } from "@ui-kitten/components";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { useStoreState } from "../util/token.store";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "../components/LanguageDropdown";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface AccountHomeScreenProps {
  navigation: any;
}

function AccountHomeScreen(props: AccountHomeScreenProps) {
  const riderFirstName = useStoreState((state) => state.data.riderFirstName);
  const riderLastName = useStoreState((state) => state.data.riderLastName);
  const { t, i18n } = useTranslation();

  const updateProfile = () => {
    props.navigation.navigate("UpdateProfileScreen");
  };

  const accountSettings = () => {
    props.navigation.navigate("AccountSettingsScreen");
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.nameText}>
          {riderFirstName.toUpperCase()} {riderLastName.toUpperCase()}
        </Text>
      </View>
      <TouchableWithoutFeedback onPress={updateProfile}>
        <View style={styles.singleContainer}>
          <Text>
            {t("screens.accountHomeScreen.options.updateProfile.text")}
          </Text><MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#959595"
            style={styles.arrowIcon}
          />

        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={accountSettings}>
        <View style={styles.singleContainer}>
          <Text>
            {t("screens.accountHomeScreen.options.accountSettings.text")}
          </Text><MaterialCommunityIcons
  name="chevron-right"
  size={24}
  color="#959595"
  style={styles.arrowIcon}
/>

        </View>
      </TouchableWithoutFeedback>
      {/* <Text
        style={{
          color: "#959595",
          fontWeight: "700",
          fontSize: 14,
          marginTop: 16,
          marginBottom: 4,
          paddingHorizontal: 10,
        }}
      >
        {t("screens.accountHomeScreen.options.legalSection.title")}
      </Text>
      <View style={styles.singleContainer}>
        <Text>
          {t(
            "screens.accountHomeScreen.options.legalSection.termsAndConditions.text"
          )}
        </Text>
        <Icon
          style={[styles.arrowIcon]}
          fill="#959595"
          name="external-link-outline"
        />
      </View>
      <View style={styles.singleContainer}>
        <Text>
          {t(
            "screens.accountHomeScreen.options.legalSection.privacyPolicy.text"
          )}
        </Text>
        <Icon
          style={[styles.arrowIcon]}
          fill="#959595"
          name="external-link-outline"
        />
      </View> */}
      <View>
        <LanguageDropdown />
      </View>
    </View>
  );
}

export default AccountHomeScreen;

const styles = StyleSheet.create({
  arrowIcon: {
    width: 24,
    height: 24,
  },
  container: {
    height: "100%",
    backgroundColor: "#F9F8F8",
    padding: 10,
  },
  initialsContainer: {
    height: 68,
    width: 68,
    backgroundColor: "#353535",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  nameText: {
    fontWeight: "700",
    fontSize: 21,
    color: "#2B2B2B",
    margin: 28,
  },
  singleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 1.5,
  },
});
