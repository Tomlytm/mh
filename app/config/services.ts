// import * as Sentry from "@sentry/react-native";
import axios from "axios";
import constants, { useAuthAxios } from "./constants";

const ApiRbac = axios.create({
  baseURL: constants.BACKEND_API.BASE_URL_RBAC,
});

const ApiLogistics = axios.create({
  baseURL: constants.BACKEND_API.BASE_URL_LOGISTICS,
});

const ApiProduct = axios.create({
  baseURL: constants.BACKEND_API.BASE_URL_PRODUCT,
});

class ApiService {
  static async login(user: any) {
    try {
      let requestBody = {
        email: user?.riderEmail,
        password: user?.riderPassword,
      };
      console.log("API Service - Request body being sent:", requestBody);
      console.log("API Service - Request URL:", constants.BACKEND_API.LOGIN);
      console.log("API Service - Base URL:", constants.BACKEND_API.BASE_URL_RBAC);
      
      let response = await ApiRbac.post(
        constants.BACKEND_API.LOGIN,
        requestBody
      );
      return response;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      return error.response;
    }
  }

  static async validateOTP(riderEmail: string, otp: Number) {
    const { authConfig } = await useAuthAxios();
    let requestBody = {
      token: otp.toString(),
      email: riderEmail,
    };
    try {
      let response = await ApiRbac.post(
        `${constants.BACKEND_API.VALIDATE_OTP}`,
        requestBody
        // authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      return error.response;
    }
  }

  static async getCustomerDetail(customerId: number) {
    const { authConfig } = await useAuthAxios();

    try {
      let response = await ApiRbac.get(
        `${constants.BACKEND_API.GET_CUSTOMER_DETAIL}${customerId}`,
        authConfig
      );
      return response;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      return error.response;
    }
  }

  static async getRiderProfile(userId: number) {
    const { authConfig } = await useAuthAxios();

    try {
      let response = await ApiLogistics.get(
        `${constants.BACKEND_API.GET_RIDER_PROFILE}${userId}`,
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 404) {
        return {
          status: 404,
          message: "Oops, No rider profile for specified user id",
        };
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async getTrips(riderId: number, orderStatus: string) {
    const { authConfig } = await useAuthAxios();

    try {
      let response = await ApiLogistics.get(
        `${constants.BACKEND_API.GET_NEW_TRIPS}/${riderId}?orderStatus=${orderStatus}`,
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async getNextRecommendedTrip(riderId: number) {
    const { authConfig } = await useAuthAxios();

    try {
      let response = await ApiLogistics.get(
        `${constants.BACKEND_API.GET_NEXT_RECOMMENDED_TRIP}/${riderId}`,
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async getNewlyAssignedTrips(riderId: number) {
    const { authConfig } = await useAuthAxios();

    try {
      let response = await ApiLogistics.get(
        `${constants.BACKEND_API.GET_NEWLY_ASSIGNED_TRIPS}/${riderId}`,
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async getOrderDetail(orderDetailId: number) {
    const { authConfig } = await useAuthAxios();

    try {
      let response = await ApiProduct.get(
        `${constants.BACKEND_API.GET_ORDER_DETAIL}${orderDetailId}`,
        authConfig
      );
      return response;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      return error.response;
    }
  }

  static async declineTrip(logisticsOrderId: number) {
    const { authConfig } = await useAuthAxios();

    try {
      let response = await ApiLogistics.put(
        `${constants.BACKEND_API.UPDATE_STATUS}/${logisticsOrderId}?deliveryStatus=decline`,
        {},
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async acceptTrip(logisticsOrderId: number) {
    const { authConfig } = await useAuthAxios();

    try {
      let response = await ApiLogistics.put(
        `${constants.BACKEND_API.UPDATE_STATUS}/${logisticsOrderId}?deliveryStatus=inTransit`,
        {},
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async confirmDelivery(
    orderId: number,
    userId: number,
    confirmationCode: string
  ) {
    const { authConfig } = await useAuthAxios();

    let requestBody = {
      userId,
      orderId,
      confirmationCode,
    };

    try {
      let response = await ApiRbac.post(
        `${constants.BACKEND_API.COMPLETE_DELIVERY}`,
        requestBody,
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return { status: 401, message: null };
      }
      if (error.response?.status === 400) {
        return { status: 400, message: error.response?.data?.message };
      }
      if (error.response?.status === 404) {
        return { status: 404, message: error.response?.data?.message };
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async cancelDelivery(
    logisticsOrderId: number,
    reason: string,
    reasonValue: string
  ) {
    const { authConfig } = await useAuthAxios();

    try {
      let requestBody = {
        cancelReason: reason,
        additionalInformation: reasonValue,
      };

      let response = await ApiLogistics.put(
        `${constants.BACKEND_API.UPDATE_STATUS}/${logisticsOrderId}?deliveryStatus=failed`,
        requestBody,
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async resendVerificationOTP(userId: number, orderId: number) {
    const { authConfig } = await useAuthAxios();

    try {
      let requestBody = {
        userId,
        orderId,
      };
      console.log(requestBody);
      let response = await ApiRbac.post(
        `${constants.BACKEND_API.RESEND_VERIFICATION_OTP}`,
        requestBody,
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return { status: 401, message: null };
      }
      if (error.response?.status === 400) {
        return { status: 400, message: error.response?.data?.message };
      }
      if (error.response?.status === 404) {
        return { status: 404, message: error.response?.data?.message };
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async forgotPasswordOTPRequest(riderEmail: string) {
    const { authConfig } = await useAuthAxios();

    try {
      let requestBody = {
        username: riderEmail,
      };

      let response = await ApiRbac.post(
        `${constants.BACKEND_API.FORGOT_PASSWORD_OTP_REQUEST}`,
        requestBody
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async resetPassword(resetPasswordObject: any) {
    const { authConfig } = await useAuthAxios();

    try {
      let requestBody = resetPasswordObject;

      let response = await ApiRbac.post(
        `${constants.BACKEND_API.RESET_PASSWORD}`,
        requestBody
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async toggleMFA(riderId: number, flag: boolean) {
    const { authConfig } = await useAuthAxios();

    try {
      let status = flag ? "enable" : "disable";

      let response = await ApiRbac.put(
        `${constants.BACKEND_API.TOGLE_MFA}/${riderId}?status=${status}`,
        {},
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }

  static async updateRiderDetail(
    riderId: number,
    updateRiderDetailObject: any
  ) {
    const { authConfig } = await useAuthAxios();

    try {
      let requestBody = updateRiderDetailObject;

      let response = await ApiRbac.put(
        `${constants.BACKEND_API.UPDATE_RIDER_DETAIL}/${riderId}`,
        requestBody,
        authConfig
      );
      return response?.data;
    } catch (error: any) {
      // if (!error.response) Sentry.captureException(error.toString());
      if (error.response?.status === 401) {
        return 401;
      }
      if (error.response?.status === 400) {
        return 400;
      }
      return { staus: false, message: "Oops, Something went wrong. Try again" };
    }
  }
}
export default ApiService;
