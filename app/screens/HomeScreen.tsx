import { useFocusEffect } from "@react-navigation/native";
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
import { TripCardSkeleton, DetailedTripCardSkeleton } from "../components/SkeletonLoader";
import constants from "../config/constants";
import colors from "../config/colors";
import ApiService from "../config/services";
import { orderInformation } from "../util/app.interface";
import { useStoreState } from "../util/token.store";
import LottieView from "../components/LottieViewMock";
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
            contentContainerStyle={styles.scrollContent}
          >
            <View onStartShouldSetResponder={() => true}>
              <Text style={styles.sectionTitle}>
                {t("screens.homeScreen.text.nextRecommendedTrip")}
              </Text>
              {isLoading && (
                <DetailedTripCardSkeleton />
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
                <View style={styles.emptyStateContainer}>
                  <MaterialCommunityIcons 
                    name="package-variant" 
                    size={48} 
                    color={colors.textLight} 
                  />
                  <Text style={styles.emptyStateText}>
                    {t("screens.homeScreen.text.noNextRecommendedTrip")}
                  </Text>
                </View>
              )}
              <Text style={styles.sectionTitle}>
                {t("screens.homeScreen.text.newlyAssignedTrips")}
              </Text>
              {isLoading && (
                <>
                  <TripCardSkeleton />
                  <TripCardSkeleton />
                  <TripCardSkeleton />
                </>
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
                <View style={styles.emptyStateContainer}>
                  <MaterialCommunityIcons 
                    name="truck-delivery" 
                    size={48} 
                    color={colors.textLight} 
                  />
                  <Text style={styles.emptyStateText}>
                    {t("screens.homeScreen.text.noNewlyAssignedTrips")}
                  </Text>
                </View>
              )}
              <TouchableWithoutFeedback
                onPress={() => props.navigation.navigate("TripsTab")}
              >
                <View style={styles.seeAllTripsContainer}>
                  <View style={styles.seeAllTripsContent}>
                    <MaterialCommunityIcons
                      name="arrow-right-circle"
                      size={20}
                      color={colors.primary}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.seeAllTripsText}>
                      {t("screens.homeScreen.text.seeAllTrips")}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={colors.textLight}
                  />
                </View>
              </TouchableWithoutFeedback>
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
    flex: 1,
    backgroundColor: colors.support,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginVertical: 16,
    marginTop: 24,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    marginVertical: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter",
    color: colors.textLight,
    marginTop: 12,
    textAlign: "center",
  },
  seeAllTripsContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  seeAllTripsContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllTripsText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
  },
});

