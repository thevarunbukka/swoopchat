import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // isBottomBarShown: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    // showBottomBar(state, action) {
    //   state.isBottomBarShown = true;
    // },
    // hideBottomBar(state, action) {
    //   state.isBottomBarShown = false;
    // },
    // bottomBarVisibleToggle(state, action) {
    //   state.isBottomBarShown = !state.isBottomBarShown;
    // },
  },
});

export default uiSlice.reducer;

export const uiActions = uiSlice.actions;
