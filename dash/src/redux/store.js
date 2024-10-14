import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
  },
});

export default store;
