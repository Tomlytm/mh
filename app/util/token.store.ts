import { Action, action, createStore, createTypedHooks } from "easy-peasy";
import { globalState } from "./app.interface";

const store = createStore<globalState>({
  data: {
    userId: 0,
    riderProfileId: 0,
    riderEmail: "",
    riderPassword: "",
    riderFirstName: "",
    riderLastName: "",
    riderPhoneNumber: "",
    riderAddress: "",
    riderCity: "",
    riderState: "",
    riderCountry: "",
    riderMFA: false,
  },
  updateData: action((state, payload) => {
    state.data = payload;
  }),
});

const typedHooks = createTypedHooks<globalState>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export default store;
