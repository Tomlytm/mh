import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Button, Text, Input } from "@ui-kitten/components";
import { useStoreActions, useStoreState } from "../util/token.store";
import ApiService from "../config/services";
import Toast from "react-native-toast-message";
import constants from "../config/constants";
import LottieView from "lottie-react-native";
import { Divider } from "react-native-paper";
import { riderData } from "../util/app.interface";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";

interface UpdateProfileScreenProps {
  navigation: any;
}

function UpdateProfileScreen(props: UpdateProfileScreenProps) {
  const riderDetail = useStoreState((state) => state.data);
  const setRiderData = useStoreActions((actions) => actions.updateData);

  const [firstName, setFirstName] = useState(riderDetail.riderFirstName);
  const [lastName, setLastName] = useState(riderDetail.riderLastName);
  const [phoneNumber, setPhoneNumber] = useState(riderDetail.riderPhoneNumber);
  const [address, setAddress] = useState(riderDetail.riderAddress);
  const [city, setCity] = useState(riderDetail.riderCity);
  const [state, setState] = useState(riderDetail.riderState);
  const [country, setCountry] = useState(riderDetail.riderCountry);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const updateRiderDetail = async () => {
    Keyboard.dismiss();

    setIsLoading(true);
    const requestObject = {
      firstName,
      lastName,
      phoneNumber,
      address_street: address,
      address_town: city,
      address_province: state,
      address_country: country,
    };

    const response = await ApiService.updateRiderDetail(
      riderDetail.userId,
      requestObject
    );
    setIsLoading(false);

    if (response === 401) {
      props.navigation.navigate("LoginScreen");
      Toast.show({
        type: "error",
        text1: t(
          "screens.updateProfileScreen.toastMessages.sessionTimeout.title"
        ),
        text2: t(
          "screens.updateProfileScreen.toastMessages.sessionTimeout.message"
        ),
      });
      return;
    }

    if (response !== 400) {
      const riderData: riderData = {
        ...riderDetail,
        riderFirstName: firstName,
        riderLastName: lastName,
        riderPhoneNumber: phoneNumber,
        riderAddress: address,
        riderCity: city,
        riderState: state,
        riderCountry: country,
      };
      setRiderData(riderData);
      Toast.show({
        type: "success",
        text1: t("screens.updateProfileScreen.toastMessages.success.title"),
        text2: t("screens.updateProfileScreen.toastMessages.success.message"),
      });
      return;
    } else {
      Toast.show({
        type: "error",
        text1: t("screens.updateProfileScreen.toastMessages.error.title"),
        text2: t("screens.updateProfileScreen.toastMessages.error.message"),
      });
      return;
    }
  };

  return (
    <KeyboardAwareScrollView>
      <TouchableOpacity onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={{ alignItems: "center", height: 120 }}>
            <View style={styles.initialsContainer}>
              <Text
                style={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                {riderDetail.riderFirstName.charAt(0).toUpperCase()}
                {riderDetail.riderLastName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.nameText}>
              {riderDetail.riderFirstName.toUpperCase()}{" "}
              {riderDetail.riderLastName.toUpperCase()}
            </Text>
          </View>

          <View style={styles.singleContainer}>
            <Text style={styles.inputText}>
              {t("screens.updateProfileScreen.fields.firstName.label")}
            </Text>
            <Input
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              style={styles.input}
              size="large"
              placeholder={t(
                "screens.updateProfileScreen.fields.firstName.placeholder"
              )}
            />
          </View>
          <Divider />
          <View style={styles.singleContainer}>
            <Text style={styles.inputText}>
              {t("screens.updateProfileScreen.fields.lastName.label")}
            </Text>
            <Input
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              style={styles.input}
              size="large"
              placeholder={t(
                "screens.updateProfileScreen.fields.lastName.placeholder"
              )}
            />
          </View>
          <Text
            style={{
              color: "#959595",
              fontWeight: "700",
              fontSize: 14,
              marginTop: 16,
              marginBottom: 4,
              paddingHorizontal: 10,
            }}
          >
            {t("screens.updateProfileScreen.fields.contactDetails.label")}
          </Text>
          <View style={styles.singleContainer}>
            <Text style={styles.inputText}>
              {t("screens.updateProfileScreen.fields.phoneNumber.label")}
            </Text>
            <Input
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              style={styles.input}
              size="large"
              placeholder={t(
                "screens.updateProfileScreen.fields.phoneNumber.placeholder"
              )}
            />
          </View>
          <Divider />
          <View style={styles.singleContainer}>
            <Text style={styles.inputText}>
              {t("screens.updateProfileScreen.fields.address.label")}
            </Text>
            <Input
              value={address}
              onChangeText={(text) => setAddress(text)}
              style={styles.input}
              size="large"
              placeholder={t(
                "screens.updateProfileScreen.fields.address.placeholder"
              )}
            />
          </View>
          <Divider />
          <View style={styles.singleContainer}>
            <Text style={styles.inputText}>
              {t("screens.updateProfileScreen.fields.city.label")}
            </Text>
            <Input
              value={city}
              onChangeText={(text) => setCity(text)}
              style={styles.input}
              size="large"
              placeholder={t(
                "screens.updateProfileScreen.fields.city.placeholder"
              )}
            />
          </View>
          <Divider />
          <View style={styles.singleContainer}>
            <Text style={styles.inputText}>
              {t("screens.updateProfileScreen.fields.state.label")}
            </Text>
            <Input
              value={state}
              onChangeText={(text) => setState(text)}
              style={styles.input}
              size="large"
              placeholder={t(
                "screens.updateProfileScreen.fields.state.placeholder"
              )}
            />
          </View>
          <Divider />
          <View style={styles.singleContainer}>
            <Text style={styles.inputText}>
              {t("screens.updateProfileScreen.fields.country.label")}
            </Text>
            <Input
              value={country}
              onChangeText={(text) => setCountry(text)}
              style={styles.input}
              size="large"
              placeholder={t(
                "screens.updateProfileScreen.fields.country.placeholder"
              )}
            />
          </View>
          {isLoading && (
            <LottieView
              style={{
                alignSelf: "center",
                width: 72,
                height: 72,
              }}
              source={constants.LOADING_TWO}
              autoPlay
            />
          )}
          <Button style={styles.acceptTrueButton} onPress={updateRiderDetail}>
            {(evaProps:any) => (
              <Text
                {...evaProps}
                style={{
                  paddingLeft: 10,
                  fontWeight: "700",
                  fontSize: 14,
                  color: "#F5F5F5",
                }}
              >
                {t("screens.updateProfileScreen.buttons.saveChanges.text")}
              </Text>
            )}
          </Button>
          <Toast />
        </View>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

export default UpdateProfileScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// inner: {
//   padding: 24,
//   flex: 1,
//   justifyContent: "space-around",
// },
//   header: {
//     fontSize: 36,
//     marginBottom: 48,
//   },
//   textInput: {
//     height: 40,
//     borderColor: "#000000",
//     borderBottomWidth: 1,
//     marginBottom: 36,
//   },
//   btnContainer: {
//     backgroundColor: "white",
//     marginTop: 12,
//   },
// });

const styles = StyleSheet.create({
  acceptTrueButton: {
    borderRadius: 16,
    borderWidth: 0,
    height: 40,
    justifyContent: "center",
    backgroundColor: "#E60000",
    marginTop: 30,
    alignSelf: "center",
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  container: {
    // display: "flex",
    // paddingTop: 10,
    flex: 1,

    // height: 1000,
    backgroundColor: "#F9F8F8",
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
  input: {
    width: "100%",
    // height: "100%",
    backgroundColor: "#FFF",
    borderWidth: 0,
  },
  inputText: {
    width: 100,
  },
  inner: {
    flex: 1,
    justifyContent: "space-around",
  },
  nameText: {
    fontWeight: "700",
    fontSize: 21,
    color: "#2B2B2B",
    marginBottom: 28,
  },
  singleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 52,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 1.6,
  },
});
