import * as SecureStore from "expo-secure-store";

const BACKEND_API = {
  BASE_URL_RBAC: `https://api-grandmarche.m-pesa.vodacom.cd/rbac/`,
  LOGIN: `api/userDetail/rider-sign-in`,
  BASE_URL_LOGISTICS: `https://api-grandmarche.m-pesa.vodacom.cd/logistics/`,
  BASE_URL_PRODUCT: `https://api-grandmarche.m-pesa.vodacom.cd/product/`,
  VALIDATE_OTP: `api/userDetail/validate-otp-user`,
  GET_CUSTOMER_DETAIL: `api/userDetail/get_userDetail/`,
  GET_ORDER_DETAIL: `api/get_order_detail_by_order_detail_id/`,
  GET_NEW_TRIPS: `api/all-orders-by-order-status-with-riderId/`,
  GET_RIDER_PROFILE: `api/rider-profile-by-user-id/`,
  GET_NEXT_RECOMMENDED_TRIP: `api/next-recommended-trip/`,
  GET_NEWLY_ASSIGNED_TRIPS: `api/newly-assigned-trips/`,
  RESEND_VERIFICATION_OTP: `api/userDetail/resend_rider_confirmation_code`,
  UPDATE_STATUS: `api/update_delivery_status/`,
  COMPLETE_DELIVERY: `api/userDetail/validate_rider_confirmation_code/`,
  FORGOT_PASSWORD_OTP_REQUEST: `api/userDetail/forget_password_otp_request`,
  RESET_PASSWORD: `api/userDetail/reset_user_passord`,
  TOGLE_MFA: `api/userDetail/update_multi_factor`,
  UPDATE_RIDER_DETAIL: `api/userDetail/update_userDetail`,
};

const LOADING = require("../assets/loading.json");
const LOADING_TWO = require("../assets/loading2.json");
const LOADING_THREE = require("../assets/loading-three.json");
const SECURE_TOKEN = "secure_token";
const STORE_LANGUAGE_KEY = "settings.lang";

export async function useAuthAxios() {
  const token = await SecureStore.getItemAsync(SECURE_TOKEN);

  const authConfig: {
    headers: { Authorization: string };
  } = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return { authConfig };
}

export default {
  BACKEND_API,
  LOADING,
  LOADING_TWO,
  LOADING_THREE,
  SECURE_TOKEN,
  STORE_LANGUAGE_KEY,
};
