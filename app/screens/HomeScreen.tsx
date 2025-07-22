import { useFocusEffect } from "@react-navigation/native";
// import { Icon } from "@ui-kitten/components";
import React, { SetStateAction, useCallback, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import AcceptTrip from "../components/AcceptTrip";
import DeclineTrip from "../components/DeclineTrip";
import NewOrderDetail from "../components/NewOrderDetail";
import SingleTrip from "../components/SingleTrip";
import SingleTripDetailed from "../components/SingleTripDetailed";
import constants from "../config/constants";
import ApiService from "../config/services";
import { orderInformation } from "../util/app.interface";
import { useStoreState } from "../util/token.store";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen(props: HomeScreenProps) {
  const [nextRecommended, setNextRecommended] = useState<orderInformation>();
  const [noNextRecommended, setNoNextRecommended] = useState(false);
  const [noNewlyAssigned, setNoNewlyAssigned] = useState(false);
  const [newlyAssigned, setNewlyAssigned] = useState<orderInformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [singleTripmodalVisible, setSingleTripModalVisible] = useState(false);
  const [modalType, setModalType] = useState<Number>();
  const [modalData, setModalData] = useState<orderInformation>();
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const riderId = useStoreState((state) => state.data.riderProfileId);
  const { t, i18n } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      getHomeScreenData();
    }, [])
  );

  const getHomeScreenData = async () => {
    setNextRecommended(undefined);
    setNewlyAssigned([]);
    setNoNextRecommended(false);
    setNoNewlyAssigned(false);
    setIsLoading(true);

    const responseNextRecommended = await ApiService.getNextRecommendedTrip(
      riderId
    );
    const responseNewlyAssigned = await ApiService.getNewlyAssignedTrips(
      riderId
    );

    if (responseNextRecommended == 401) {
      props.navigation.navigate("LoginScreen");
      Toast.show({
        type: "error",
        text1: "Session timeout",
        text2: "Please login again",
      });
      return;
    }

    if (responseNextRecommended !== 400) {
      const individualTripObject: orderInformation = {
        logisticsOrderId: responseNextRecommended[0]?.id,
        orderDetailId: responseNextRecommended[0]?.orderId,
        customerId: responseNextRecommended[0]?.customerId,
        customerFirstName: responseNextRecommended[0]?.customerFirstName,
        customerLastName: responseNextRecommended[0]?.customerLastName,
        customerAddress: responseNextRecommended[0]?.deliveryAddress,
        customerPhoneNumber: responseNextRecommended[0]?.customerPhoneNumber,
        orderPrice: responseNextRecommended[0]?.orderPrice,
        orderName: responseNextRecommended[0]?.orderName,
        orderQuantity: responseNextRecommended[0]?.orderQuantity,
        deliveryDate: responseNextRecommended[0]?.deliveryDate,
        logisticsPrice: responseNextRecommended[0]?.logisticsPrice,
      };
      setNextRecommended(individualTripObject);
    } else {
      setNoNextRecommended(true);
    }
    if (responseNewlyAssigned !== 400) {
      const dataArray = responseNewlyAssigned.map((iterator: any) => {
        let individualTripObject: orderInformation = {
          logisticsOrderId: iterator?.id,
          orderDetailId: iterator?.orderId,
          customerId: iterator?.customerId,
          customerFirstName: iterator?.customerFirstName,
          customerLastName: iterator?.customerLastName,
          customerAddress: iterator?.deliveryAddress,
          customerPhoneNumber: iterator?.customerPhoneNumber,
          orderPrice: iterator?.orderPrice,
          orderName: iterator?.orderName,
          orderQuantity: iterator?.orderQuantity,
          deliveryDate: iterator?.deliveryDate,
          logisticsPrice: iterator?.logisticsPrice,
        };
        return individualTripObject;
      });
      setNewlyAssigned(dataArray as SetStateAction<orderInformation[]>);
    } else {
      setNoNewlyAssigned(true);
    }
    setIsLoading(false);
  };

  // const hideSingleTripModal = (value: Number) => {
  //   setModalType(value);
  // };

  const hideSingleTripModal = async (
    value: Number,
    logisticsOrderId: number
  ) => {
    if (value == 1) {
      setSingleTripModalVisible(!singleTripmodalVisible);
      setModalType(value);
    }

    if (value == 2) {
      setAcceptLoading(!acceptLoading);
      const response = await ApiService.acceptTrip(logisticsOrderId);

      setAcceptLoading(false);
      setSingleTripModalVisible(!singleTripmodalVisible);

      if (response == 401) {
        props.navigation.navigate("LoginScreen");
        Toast.show({
          type: "error",
          text1: "Session timeout",
          text2: "Please login again",
        });
        return;
      }

      if (response.id == logisticsOrderId) {
        setModalType(value);
      }
    }
  };

  const confirmButton = async (logisticsOrderId: number) => {
    setDeclineLoading(!declineLoading);
    const response = await ApiService.declineTrip(logisticsOrderId);
    setDeclineLoading(!declineLoading);
    if (response == 401) {
      props.navigation.navigate("LoginScreen");
      Toast.show({
        type: "error",
        text1: "Session timeout",
        text2: "Please login again",
      });
      return;
    }

    if (response.id == logisticsOrderId) {
      setDeclineModalVisible(!declineModalVisible);
      Toast.show({
        type: "success",
        text1: "Trip Declined",
        text2: "You have successfully declined the trip",
      });
      getHomeScreenData();
    }
  };

  const dismissButton = () => {
    setAcceptModalVisible(!acceptModalVisible);
  };

  const dismissDeclineModal = () => {
    setDeclineModalVisible(!declineModalVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, width: "auto", height: SCREEN_HEIGHT }}>
        <StatusBar barStyle={"dark-content"} />
        <View style={{ width: "auto", height: "32%" }}>
          <ImageBackground
            style={{ height: "100%" }}
            source={require("../assets/HomeImage.png")}
            resizeMode="cover"
          >
            <Toast />
          </ImageBackground>
        </View>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            <View onStartShouldSetResponder={() => true}>
              <Text
                style={{ fontSize: 16, fontWeight: "700", marginVertical: 14 }}
              >
                {t("screens.homeScreen.text.nextRecommendedTrip")}
              </Text>
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
              {nextRecommended && (
                <SingleTripDetailed
                  data={nextRecommended}
                  toggleModal={() => {
                    setModalData(nextRecommended);
                    setSingleTripModalVisible(!singleTripmodalVisible);
                  }}
                />
              )}
              {noNextRecommended && (
                <Text>
                  {t("screens.homeScreen.text.noNextRecommendedTrip")}
                </Text>
              )}
              <Text
                style={{ fontSize: 16, fontWeight: "700", marginVertical: 14 }}
              >
                {t("screens.homeScreen.text.newlyAssignedTrips")}
              </Text>
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
              {newlyAssigned.length > 0 &&
                newlyAssigned.map((trip) => (
                  <SingleTrip
                    key={trip.logisticsOrderId}
                    data={trip}
                    toggleModal={() => {
                      setModalData(trip);
                      setSingleTripModalVisible(!singleTripmodalVisible);
                    }}
                  />
                ))}
              {noNewlyAssigned && (
                <Text>{t("screens.homeScreen.text.noNewlyAssignedTrips")}</Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 12,
                  alignItems: "center",
                }}
              ><MaterialCommunityIcons
                  name="arrow-right-circle"
                  size={24}
                  color="#E60000"
                  style={{ marginRight: 12 }}
                />


                <Text
                  style={{ fontSize: 16, fontWeight: "700" }}
                  onPress={() => props.navigation.navigate("Trips")}
                >
                  {t("screens.homeScreen.text.seeAllTrips")}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <Modal
          backdropOpacity={0.15}
          style={{ margin: 0, flex: 1, justifyContent: "flex-end" }}
          isVisible={singleTripmodalVisible}
          swipeDirection="down"
          onSwipeComplete={() => setSingleTripModalVisible(false)}
          onModalHide={() =>
            modalType == 1
              ? setDeclineModalVisible(!declineModalVisible)
              : setAcceptModalVisible(!acceptModalVisible)
          }
        >
          {acceptLoading && (
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
          <NewOrderDetail
            modalData={modalData}
            toggleAcceptModal={(e: Number) =>
              hideSingleTripModal(e, modalData?.logisticsOrderId)
            }
            toggleDeclineModal={(e: Number) =>
              hideSingleTripModal(e, modalData?.logisticsOrderId)
            }
          />
        </Modal>
        <Modal
          backdropOpacity={0.15}
          style={{ flex: 1, justifyContent: "flex-end" }}
          isVisible={acceptModalVisible}
          onModalHide={() => {
            getHomeScreenData();
          }}
        >
          <AcceptTrip dismissModal={dismissButton} />
        </Modal>
        <Modal
          backdropOpacity={0.15}
          style={{ flex: 1, justifyContent: "flex-end" }}
          isVisible={declineModalVisible}
        >
          {declineLoading && (
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
          <DeclineTrip
            confirmButton={() => confirmButton(modalData?.logisticsOrderId)}
            dismissButton={dismissDeclineModal}
          />
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "92%",
    backgroundColor: "#F5F5F5",
    marginHorizontal: "4%",
  },
  icon: {
    width: 32,
    height: 32,
  },
  input: {
    width: "100%",
    height: 55,
    marginTop: 16,
  },
  scrollView: {
    height: "68%",
  },
});

/* import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "@ui-kitten/components";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import AcceptTrip from "../components/AcceptTrip";
import DeclineTrip from "../components/DeclineTrip";
import NewOrderDetail from "../components/NewOrderDetail";
import SingleTrip from "../components/SingleTrip";
import SingleTripDetailed from "../components/SingleTripDetailed";
import constants from "../config/constants";
import ApiService from "../config/services";
import { orderInformation } from "../util/app.interface";
import { useStoreState } from "../util/token.store";
import LottieView from "lottie-react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen(props: HomeScreenProps) {
  const [nextRecommended, setNextRecommended] = useState<orderInformation>();
  const [noNextRecommended, setNoNextRecommended] = useState(false);
  const [noNewlyAssigned, setNoNewlyAssigned] = useState(false);
  const [newlyAssigned, setNewlyAssigned] = useState<orderInformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [singleTripmodalVisible, setSingleTripModalVisible] = useState(false);
  const [modalType, setModalType] = useState<Number>();
  const [modalData, setModalData] = useState<orderInformation>();
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const riderId = useStoreState((state) => state.data.riderProfileId);

  useFocusEffect(
    useCallback(() => {
      getHomeScreenData();
    }, [])
  );

  const getHomeScreenData = async () => {
    setIsLoading(true);
    setNoNextRecommended(false);
    setNoNewlyAssigned(false);

    try {
      const [responseNextRecommended, responseNewlyAssigned] =
        await Promise.all([
          ApiService.getNextRecommendedTrip(riderId),
          ApiService.getNewlyAssignedTrips(riderId),
        ]);

      handleNextRecommendedResponse(responseNextRecommended);
      handleNewlyAssignedResponse(responseNewlyAssigned);
    } catch (error) {
      console.error("Error fetching home screen data:", error);
    }

    setIsLoading(false);
  };

  const handleNextRecommendedResponse = (responseNextRecommended: any) => {
    if (responseNextRecommended === 401) {
      handleSessionTimeout();
    } else if (responseNextRecommended !== 400) {
      setNextRecommended(parseOrderInformation(responseNextRecommended[0]));
    } else {
      setNoNextRecommended(true);
    }
  };

  const handleNewlyAssignedResponse = (responseNewlyAssigned: any) => {
    if (responseNewlyAssigned !== 400) {
      const dataArray = responseNewlyAssigned.map((trip: any) =>
        parseOrderInformation(trip)
      );
      setNewlyAssigned(dataArray);
    } else {
      setNoNewlyAssigned(true);
    }
  };

  const parseOrderInformation = (data: any) => ({
    logisticsOrderId: data?.id,
    orderDetailId: data?.orderId,
    customerId: data?.customerId,
    customerFirstName: data?.customerFirstName,
    customerLastName: data?.customerLastName,
    customerAddress: data?.deliveryAddress,
    customerPhoneNumber: data?.customerPhoneNumber,
    orderPrice: data?.orderPrice,
    orderName: data?.orderName,
    orderQuantity: data?.orderQuantity,
    deliveryDate: data?.deliveryDate,
  });

  const handleSessionTimeout = () => {
    props.navigation.navigate("LoginScreen");
    Toast.show({
      type: "error",
      text1: "Session timeout",
      text2: "Please login again",
    });
  };

  const toggleSingleTripModal = (value: Number, data: orderInformation) => {
    setModalType(value);
    setModalData(data);
    setSingleTripModalVisible(!singleTripmodalVisible);
  };

  const toggleAcceptDismissModal = async (logisticsOrderId: number) => {
    if (modalType === 1) {
      // setSingleTripModalVisible(!singleTripmodalVisible);
      setDeclineModalVisible(!declineModalVisible);
    } else if (modalType === 2) {
      setAcceptLoading(!acceptLoading);
      const response = await ApiService.acceptTrip(logisticsOrderId);
      // setSingleTripModalVisible(!singleTripmodalVisible);
      setAcceptLoading(!acceptLoading);
      if (response === 401) {
        handleSessionTimeout();
      } else if (response.id === logisticsOrderId) {
        setAcceptModalVisible(!acceptModalVisible);
      }
    }
    setModalType(0);
  };

  const confirmButton = async (logisticsOrderId: number) => {
    setDeclineLoading(!declineLoading);
    const response = await ApiService.declineTrip(logisticsOrderId);
    setDeclineLoading(!declineLoading);
    if (response === 401) {
      handleSessionTimeout();
    } else if (response.id === logisticsOrderId) {
      setDeclineModalVisible(!declineModalVisible);
      Toast.show({
        type: "success",
        text1: "Trip Declined",
        text2: "You have successfully declined the trip",
      });
      getHomeScreenData();
    }
  };

  const dismissButton = () => {
    setAcceptModalVisible(!acceptModalVisible);
  };

  const dismissDeclineModal = () => {
    setDeclineModalVisible(!declineModalVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, width: "auto", height: SCREEN_HEIGHT }}>
        <StatusBar barStyle={"dark-content"} />
        <View style={{ width: "auto", height: "32%" }}>
          <ImageBackground
            style={{ height: "100%" }}
            source={require("../assets/HomeImage.png")}
            resizeMode="cover"
          >
            <Toast />
          </ImageBackground>
        </View>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            <View onStartShouldSetResponder={() => true}>
              <Text
                style={{ fontSize: 16, fontWeight: "700", marginVertical: 14 }}
              >
                NEXT RECOMMENDED TRIP
              </Text>
              {isLoading ? (
                <LottieView
                  style={{
                    alignSelf: "center",
                    width: 56,
                    height: 56,
                  }}
                  source={constants.LOADING_TWO}
                  autoPlay
                />
              ) : (
                <>
                  {nextRecommended && (
                    <SingleTripDetailed
                      data={nextRecommended}
                      toggleModal={() =>
                        toggleSingleTripModal(0, nextRecommended)
                      }
                    />
                  )}
                  {noNextRecommended && <Text>No recommended trip found</Text>}
                </>
              )}
              <Text
                style={{ fontSize: 16, fontWeight: "700", marginVertical: 14 }}
              >
                NEWLY ASSIGNED TRIPS
              </Text>
              {isLoading ? (
                <LottieView
                  style={{
                    alignSelf: "center",
                    width: 56,
                    height: 56,
                  }}
                  source={constants.LOADING_TWO}
                  autoPlay
                />
              ) : (
                <>
                  {newlyAssigned.length > 0 &&
                    newlyAssigned.map((trip) => (
                      <SingleTrip
                        key={trip.logisticsOrderId}
                        data={trip}
                        toggleModal={() => toggleSingleTripModal(0, trip)}
                      />
                    ))}
                  {noNewlyAssigned && (
                    <Text>No Newly Assigned trips found</Text>
                  )}
                </>
              )}
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 12,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => props.navigation.navigate("Trips")}
                >
                  <Icon
                    style={{ width: 24, height: 24, marginRight: 12 }}
                    fill="#E60000"
                    name="arrow-circle-right"
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      textAlignVertical: "center",
                    }}
                  >
                    SEE ALL TRIPS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        <Modal
        backdropOpacity={0.15}
          style={{ margin: 0, flex: 1, justifyContent: "flex-end" }}
          isVisible={singleTripmodalVisible}
          swipeDirection="down"
          onSwipeComplete={() => setSingleTripModalVisible(false)}
          onModalHide={() =>
            toggleAcceptDismissModal(modalData?.logisticsOrderId)
          }
        >
          {acceptLoading && (
            <LottieView
              style={{
                alignSelf: "center",
                width: 56,
                height: 56,
              }}
              source={constants.LOADING_TWO}
              autoPlay
            />
          )}

          <NewOrderDetail
            modalData={modalData}
            toggleAcceptModal={toggleSingleTripModal}
            toggleDeclineModal={toggleSingleTripModal}
          />
        </Modal>
        <Modal
          style={{ flex: 1, justifyContent: "flex-end" }}
          isVisible={acceptModalVisible}
          onModalHide={getHomeScreenData}
        >
          <AcceptTrip dismissModal={dismissButton} />
        </Modal>
        <Modal
          style={{ flex: 1, justifyContent: "flex-end" }}
          isVisible={declineModalVisible}
        >
          {" "}
          {declineLoading && (
            <LottieView
              style={{
                alignSelf: "center",
                width: 56,
                height: 56,
              }}
              source={constants.LOADING_TWO}
              autoPlay
            />
          )}
          <DeclineTrip
            confirmButton={() => confirmButton(modalData?.logisticsOrderId)}
            dismissButton={dismissDeclineModal}
          />
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "92%",
    backgroundColor: "#F5F5F5",
    marginHorizontal: "4%",
  },
  icon: {
    width: 32,
    height: 32,
  },
  input: {
    width: "100%",
    height: 55,
    marginTop: 16,
  },
  scrollView: {
    height: "68%",
  },
}); */
