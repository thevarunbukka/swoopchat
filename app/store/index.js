import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer from "./authorization-slice";
import uiReducer from "./ui-slice";

const store = configureStore({
  reducer: { authorization: authorizationReducer, ui: uiReducer },
});

export default store;
