import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import AcceptTrip from "../components/AcceptTrip";
import CancellingReasonModal from "../components/CancellingReasonModal";
import CompletedTrip from "../components/CompletedTrip";
import DeclineTrip from "../components/DeclineTrip";
import DeliveredOrderDetail from "../components/DeliveredOrderDetail";
import NewOrderDetail from "../components/NewOrderDetail";
import PendingOrderDetail from "../components/PendingOrderDetail";
import SingleTrip from "../components/SingleTrip";
import SingleTripDetailed from "../components/SingleTripDetailed";
import SuccessModal from "../components/SuccessModal";
import VerifyDeliveryOTPModal from "../components/VerifyDeliveryOTPModal";
import ApiService from "../config/services";
import { orderInformation } from "../util/app.interface";
import { useStoreState } from "../util/token.store";
import LottieView from "lottie-react-native";
import constants from "../config/constants";
import colors from "../config/colors";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";


interface TripsScreenProps {
  navigation: any;
}

type Mode = "new" | "pending" | "completed" | "cancelled";
type StatusFlags = {
  noNewTrip: boolean;
  noPendingTrip: boolean;
  noCompletedTrip: boolean;
  noCancelledTrip: boolean;
};
export default function TripsScreen(props: TripsScreenProps) {
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState({
    newTrip: false,
    pendingTrip: false,
    completedTrip: false,
    cancelTrip: false,
    accept: false,
    success: false,
    decline: false,
    delivered: false,
    dismissDecline: false,
    verifyOTP: false,
    verifyOTPComplete: false,
    verifyOTPLoading: false,
    cancelTripLoading: false,
    acceptTripLoading: false,
    declineTripLoading: false,
  });
  const [isSwipe, setIsSwipe] = useState(true);
  const [modalType, setModalType] = useState<Number>();
  const [mode, setMode] = useState<Mode>("new");
  const [modalData, setModalData] = useState<orderInformation>();
  const [tripData, setTripData] = useState<{
    new: orderInformation[];
    pending: orderInformation[];
    completed: orderInformation[];
    cancelled: orderInformation[];
  }>({
    new: [],
    pending: [],
    completed: [],
    cancelled: [],
  });
  const [statusFlags, setStatusFlags] = useState<StatusFlags>({
    noNewTrip: false,
    noPendingTrip: false,
    noCompletedTrip: false,
    noCancelledTrip: false,
  });
  const [filteredDataSource, setFilteredDataSource] = useState<
    orderInformation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetailFlag, setOrderDetailFlag] = useState<Number>(0);
  const riderDetail = useStoreState((state) => state.data);

  const searchBorderColor = React.useRef(new Animated.Value(0)).current;
  const tabAnimations = React.useRef({
    new: new Animated.Value(1),
    pending: new Animated.Value(0.7),
    completed: new Animated.Value(0.7),
  }).current;

  const animatedSearchBorderColor = searchBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  const handleSearchFocus = () => {
    setSearchFocused(true);
    Animated.timing(searchBorderColor, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    Animated.timing(searchBorderColor, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animateTabSwitch = (selectedMode: Mode) => {
    const tabs = ["new", "pending", "completed"] as Mode[];
    tabs.forEach((tab) => {
      Animated.timing(tabAnimations[tab], {
        toValue: tab === selectedMode ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const fetchTrips = async (mode: string) => {
    setFilteredDataSource([]);
    setIsLoading(true);
    const response = await ApiService.getTrips(
      riderDetail.riderProfileId,
      mode
    );

    handleApiResponse(response, mode);
    setIsLoading(false);
  };

  const handleApiResponse = (response: any, tripType: string) => {
    if (response === 401) {
      props.navigation.navigate("LoginScreen");
      showToast(
        "error",
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.title"),
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.message")
      );
      return;
    }

    if (response !== 400) {
      const dataArray = response.map(
        (iterator: any): orderInformation => ({
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
        })
      );

      setTripData((prev) => ({
        ...prev,
        [tripType]: dataArray,
      }));

      if (mode === tripType) setFilteredDataSource(dataArray);
    } else {
      setStatusFlags((prev) => ({
        ...prev,
        [`no${capitalize(tripType)}Trip`]: true,
      }));
    }
  };

  const getStatusFlagKey = (type: Mode): keyof StatusFlags => {
    return `no${capitalize(type)}Trip` as keyof StatusFlags;
  };

  const convertStringToMode = (type: string): Mode => {
    return type as Mode;
  };

  useFocusEffect(
    useCallback(() => {
      setMode("new");
      animateTabSwitch("new");
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      setStatusFlags({
        noNewTrip: false,
        noPendingTrip: false,
        noCompletedTrip: false,
        noCancelledTrip: false,
      });
      fetchTrips(mode);
    }, [mode])
  );

  const showToast = (type: string, text1: string, text2: string) => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const confirmButton = async (logisticsOrderId: number) => {
    handleModalToggle("declineTripLoading", !modalVisible.declineTripLoading);
    const response = await ApiService.declineTrip(logisticsOrderId);
    handleModalToggle("declineTripLoading", false);
    if (response == 401) {
      props.navigation.navigate("LoginScreen");
      showToast(
        "error",
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.title"),
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.message")
      );
      return;
    }

    if (response.id == logisticsOrderId) {
      handleModalToggle("decline", !modalVisible.decline);
      showToast(
        "success",
        t("screens.tripsScreen.text.toastMessages.tripDeclined.title"),
        t("screens.tripsScreen.text.toastMessages.tripDeclined.message")
      );
      fetchTrips("new");
    }
  };

  const toggleDismiss = () => {
    Keyboard.dismiss;
    handleModalToggle("cancelTrip", !modalVisible.cancelTrip);
    setIsSwipe(true);
  };

  const searchFilterFunction = (searchParam: string) => {
    if (searchParam) {
      const filtered = tripData[mode].filter((item) =>
        item.orderDetailId.toString().includes(searchParam)
      );
      setFilteredDataSource(filtered);
      setSearchValue(searchParam);
    } else {
      setFilteredDataSource(tripData[mode]);
      setSearchValue(searchParam);
    }
  };

  const toggleSubmit = async (
    reason: string,
    reasonValue: string,
    logisticsOrderId: number
  ) => {
    handleModalToggle("cancelTripLoading", !modalVisible.cancelTripLoading);
    Keyboard.dismiss();
    const response = await ApiService.cancelDelivery(
      logisticsOrderId,
      reason,
      reasonValue
    );
    handleModalToggle("cancelTripLoading", false);
    if (response == 401) {
      props.navigation.navigate("LoginScreen");
      showToast(
        "error",
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.title"),
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.message")
      );
      return;
    }

    if (response.id == logisticsOrderId) {
      handleModalToggle("cancelTrip", !modalVisible.cancelTrip);
      fetchTrips("pending");
    }
  };

  const handleModalToggle = (modalName: string, value: boolean) => {
    // console.log(modalName, value);
    setTimeout(() => {
      // handleModalToggle(`verifyOTP`, true);
      setModalVisible((prev) => ({
        ...prev,
        [modalName]: value,
      }));
    }, 100);
  };

  const hideSingleTripModal = (value: Number) => {
    setModalType(value);
    handleModalToggle("newTrip", !modalVisible.newTrip);
  };

  const toggleAcceptDismissModal = async (logisticsOrderId: number) => {
    if (modalType == 1) {
      handleModalToggle("decline", !modalVisible.decline);
      setModalType(0);
    }

    if (modalType == 2) {
      handleModalToggle("acceptTripLoading", !modalVisible.acceptTripLoading);
      const response = await ApiService.acceptTrip(logisticsOrderId);
      handleModalToggle("acceptTripLoading", false);

      if (response == 401) {
        props.navigation.navigate("LoginScreen");
        showToast(
          "error",
          t("screens.tripsScreen.text.toastMessages.sessionTimeout.title"),
          t("screens.tripsScreen.text.toastMessages.sessionTimeout.message")
        );
        return;
      }

      if (response.id == logisticsOrderId) {
        handleModalToggle("accept", !modalVisible.accept);
        setModalType(0);
      }
    }
  };

  const toggleSuccessModal = async (
    orderId: number,
    userId: number,
    confirmationCode: string
  ) => {
    if (confirmationCode === "") {
      showToast(
        "error",
        t("screens.tripsScreen.text.toastMessages.error.title"),
        t("screens.tripsScreen.text.toastMessages.error.OtpError")
      );
      return;
    }
    handleModalToggle("verifyOTPLoading", !modalVisible.verifyOTPLoading);
    const response = await ApiService.confirmDelivery(
      orderId,
      userId,
      confirmationCode
    );

    handleModalToggle("verifyOTPLoading", false);
    if (response?.status === 401) {
      props.navigation.navigate("LoginScreen");
      showToast(
        "error",
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.title"),
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.message")
      );
      return;
    }

    if (response?.status === 400 || response?.status === 404) {
      showToast(
        "error",
        t("screens.tripsScreen.text.toastMessages.error.title"),
        response.message.toUpperCase()
      );
      return;
    }

    if (response?.responseCode === 200) {
      handleModalToggle("verifyOTP", false);
      handleModalToggle("verifyOTPComplete", true);
    }
  };

  const resendVerificationOTP = async (userId: number, orderId: number) => {
    handleModalToggle("verifyOTPLoading", !modalVisible.verifyOTPLoading);
    const response = await ApiService.resendVerificationOTP(userId, orderId);
    handleModalToggle("verifyOTPLoading", false);
    if (response?.status === 401) {
      showToast(
        "error",
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.title"),
        t("screens.tripsScreen.text.toastMessages.sessionTimeout.message")
      );
      props.navigation.navigate("LoginScreen");
      return;
    }

    if (response?.status === 400 || response?.status === 404) {
      showToast(
        "error",
        t("screens.tripsScreen.text.toastMessages.error.title"),
        response.message.toUpperCase()
      );
      return;
    }

    if (response?.responseCode === 200) {
      showToast(
        "success",
        t("screens.tripsScreen.text.toastMessages.otpResent.title"),
        t("screens.tripsScreen.text.toastMessages.otpResent.message")
      );
    }
  };
  const renderSearchIcon = () => (
    <MaterialCommunityIcons
      name="magnify"
      size={20}
      color={searchFocused ? colors.primary : colors.textLight}
      style={styles.searchIcon}
    />
  );

  const renderNoTripsView = (message: string) => (
    <View style={styles.noTripsContainer}>
      <View style={styles.emptyStateIcon}>
        <MaterialCommunityIcons
          name="package-variant-closed"
          size={48}
          color={colors.textLight}
        />
      </View>
      <Text style={styles.emptyStateText}>{message}</Text>
      <Text style={styles.emptyStateSubtext}>
        {mode === "new" 
          ? "New trips will appear here when available"
          : mode === "pending"
          ? "Active trips will be shown here"
          : "Your completed trips history"
        }
      </Text>
    </View>
  );
  const { t, i18n } = useTranslation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.primary + "08", colors.support]}
          style={styles.headerSection}
        >
          <Text style={styles.headerText}>{t("screens.tripsScreen.title")}</Text>
          
          <Animated.View
            style={[
              styles.searchContainer,
              { borderColor: animatedSearchBorderColor },
            ]}
          >
            {renderSearchIcon()}
            <TextInput
              value={searchValue}
              style={styles.searchInput}
              placeholder={t("screens.tripsScreen.text.inputPlaceholder")}
              placeholderTextColor={colors.textLight}
              onChangeText={searchFilterFunction}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {searchValue.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchValue("");
                  setFilteredDataSource(tripData[mode]);
                }}
                style={styles.clearButton}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={20}
                  color={colors.textLight}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        </LinearGradient>

        <View style={styles.tabContainer}>
          {(["new", "pending", "completed"] as Mode[]).map((type) => (
            <Animated.View
              key={type}
              style={[
                styles.tabItem,
                { opacity: tabAnimations[type] },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTripData({
                    new: [],
                    pending: [],
                    completed: [],
                    cancelled: [],
                  });
                  setMode(type);
                  animateTabSwitch(type);
                  setFilteredDataSource(tripData[type]);
                }}
                style={[
                  styles.tabButton,
                  mode === type && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === type && styles.tabTextActive,
                  ]}
                >
                  {t(`screens.tripsScreen.text.tabs.${type}`)}
                </Text>
                {mode === type && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.contentSection}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <LottieView
                style={styles.loadingAnimation}
                source={constants.LOADING_TWO}
                autoPlay
              />
              <Text style={styles.loadingText}>Loading trips...</Text>
            </View>
          )}

          {!isLoading && (
            <>
              {["new", "pending", "completed"].map((type) => (
                <React.Fragment key={type}>
                  {mode === type && filteredDataSource.length > 0 && (
                    <FlatList
                      data={filteredDataSource}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.listContainer}
                      renderItem={({ item }) => {
                        const TripComponent =
                          type === "new"
                            ? SingleTrip
                            : type === "pending"
                            ? SingleTripDetailed
                            : CompletedTrip;
                        return (
                          <TripComponent
                            data={item}
                            toggleModal={() => {
                              setModalData(item);
                              handleModalToggle(`${type}Trip`, true);
                            }}
                          />
                        );
                      }}
                      keyExtractor={(item) => item.logisticsOrderId.toString()}
                    />
                  )}
                </React.Fragment>
              ))}
              
              {statusFlags[getStatusFlagKey(mode)] &&
                renderNoTripsView(
                  t(
                    `screens.tripsScreen.text.statusMessages.no${capitalize(
                      mode
                    )}Trip`
                  )
                )}
            </>
          )}
        </View>
        <Modal
          backdropOpacity={0.15}
          style={styles.modal}
          isVisible={modalVisible.newTrip}
          swipeDirection="down"
          onSwipeComplete={() => handleModalToggle(`${mode}Trip`, false)}
          onModalHide={() =>
            toggleAcceptDismissModal(modalData?.logisticsOrderId)
          }
        >
          {modalVisible.acceptTripLoading && (
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
            toggleAcceptModal={hideSingleTripModal}
            toggleDeclineModal={hideSingleTripModal}
          />
        </Modal>

        <Modal
          backdropOpacity={0.15}
          style={styles.modal}
          isVisible={modalVisible.pendingTrip}
          swipeDirection="down"
          onSwipeComplete={() => {
            handleModalToggle(`${mode}Trip`, false);
            setIsSwipe(true);
          }}
          onModalHide={() => {
            if (!isSwipe) {
              handleModalToggle(`verifyOTP`, true);
            }
          }}
        >
          <PendingOrderDetail
            toggleCancelTripModal={() => {
              handleModalToggle(`${mode}Trip`, false);
              setIsSwipe(false);
              setOrderDetailFlag(2);
            }}
            toggleVerifyOTPModal={() => {
              handleModalToggle(`${mode}Trip`, false);
              setIsSwipe(false);
              setOrderDetailFlag(1);
            }}
            modalData={modalData}
          />
        </Modal>

        <Modal
          backdropOpacity={0.15}
          style={styles.modal}
          isVisible={modalVisible.cancelTrip}
          avoidKeyboard={true}
          onBackButtonPress={() => handleModalToggle("cancelTrip", false)}
          onBackdropPress={() => handleModalToggle("cancelTrip", false)}
        >
          {modalVisible.cancelTripLoading && (
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
          <CancellingReasonModal
            toggleDismiss={toggleDismiss}
            toggleSubmit={(reason, reasonValue) =>
              toggleSubmit(reason, reasonValue, modalData?.logisticsOrderId)
            }
          />
        </Modal>

        <Modal
          backdropOpacity={0.15}
          style={styles.modal}
          isVisible={modalVisible.accept}
        >
          <AcceptTrip
            dismissModal={() => {
              handleModalToggle("accept", false);
              fetchTrips(mode);
            }}
          />
        </Modal>

        <Modal
          backdropOpacity={0.15}
          style={styles.modal}
          isVisible={modalVisible.decline}
        >
          {modalVisible.declineTripLoading && (
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
            dismissButton={() =>
              handleModalToggle("decline", !modalVisible.decline)
            }
          />
        </Modal>

        <Modal
          backdropOpacity={0.15}
          style={styles.modal}
          isVisible={modalVisible.completedTrip}
          swipeDirection="down"
          onSwipeComplete={() => handleModalToggle("completedTrip", false)}
        >
          <DeliveredOrderDetail modalData={modalData} />
        </Modal>

        <Modal
          backdropOpacity={0.15}
          style={{
            margin: 0,
            flex: 1,
            justifyContent: "flex-end",
          }}
          isVisible={modalVisible.verifyOTP}
          avoidKeyboard={true}
          onModalHide={() => {
            if (modalVisible.verifyOTPComplete)
              handleModalToggle("success", !modalVisible.success);
            else {
              handleModalToggle("pendingTrip", !modalVisible.pendingTrip);
            }
          }}
        >
          {modalVisible.verifyOTPLoading && (
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
          <VerifyDeliveryOTPModal
            toggleDismiss={() => {
              handleModalToggle("verifyOTP", false);
              handleModalToggle("verifyOTPComplete", false);
            }}
            resendVerificationOTP={() => {
              resendVerificationOTP(
                modalData?.customerId,
                modalData?.orderDetailId
              );
            }}
            confirmDelivery={(e) => {
              toggleSuccessModal(
                modalData?.orderDetailId,
                modalData?.customerId,
                e
              );
            }}
          />
          {/* <Toast /> */}
        </Modal>

        <Modal
          backdropOpacity={0.15}
          style={styles.modal}
          isVisible={modalVisible.success}
          swipeDirection="down"
          onSwipeComplete={() => {
            handleModalToggle("success", false);
            fetchTrips(mode);
          }}
        >
          <SuccessModal />
        </Modal>
        <Toast />
      </View>
    </TouchableWithoutFeedback>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.support,
  },
  headerSection: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter",
    color: colors.text,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter",
    color: colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  tabItem: {
    flex: 1,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    position: "relative",
  },
  tabButtonActive: {
    backgroundColor: colors.primary + "10",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter",
    color: colors.textLight,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  loadingAnimation: {
    width: 80,
    height: 80,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter",
    color: colors.textLight,
    marginTop: 16,
  },
  listContainer: {
    paddingVertical: 16,
  },
  noTripsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyStateIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Inter",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Inter",
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: "flex-end",
  },
});
