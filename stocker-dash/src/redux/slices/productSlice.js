import { createSlice } from "@reduxjs/toolkit";

// Initial state for the product slice
const initialState = {
  productName: "",
  productBarcode: "",
  productImage: "",
};

// Create the product slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductName: (state, action) => {
      state.productName = action.payload;
    },
    setProductBarcode: (state, action) => {
      state.productBarcode = action.payload;
    },
    setProductImage: (state, action) => {
      state.productImage = action.payload;
    },
  },
});

// Export actions and reducer
export const { setProductName, setProductBarcode, setProductImage } =
  productSlice.actions;
export default productSlice.reducer;
