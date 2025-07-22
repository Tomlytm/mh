import { Action } from "easy-peasy";

export interface logisticsOrder {
  logisticsOrderId: any;
  orderDetailId: any;
  customerId: any;
}

export interface orderInformation {
  logisticsOrderId: any;
  orderDetailId: any;
  customerId: any;
  orderName: any;
  orderQuantity: any;
  customerFirstName: any;
  customerLastName: any;
  customerPhoneNumber: any;
  customerAddress: any;
  orderPrice: any;
  deliveryDate: any;
  logisticsPrice: any;
}

export interface newTripSample {
  id: any;
  orderId: any;
  orderName: any;
  orderQuantity: any;
  customerId: any;
  customerName: any;
  customerAddress: any;
  orderPrice: any;
  deliveryType: any;
  paymentStatus: any;
  deliveryStatus: any;
  deliveryDate: any;
}

export interface riderData {
  userId: number;
  riderProfileId: number;
  riderEmail: string;
  riderPassword: string;
  riderFirstName: string;
  riderLastName: string;
  riderPhoneNumber: string;
  riderAddress: string;
  riderCity: string;
  riderState: string;
  riderCountry: string;
  riderMFA: boolean;
}

export interface globalState {
  data: riderData;
  updateData: Action<globalState, riderData>;
}
