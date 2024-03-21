import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  token: null,
  fullName: "",
  userName: "",
  profilePicture: "",
};

const authorizationSlice = createSlice({
  name: "authorization",
  initialState: initialState,
  reducers: {
    loadUser(state, action) {
      state.token = action.payload.token;
      state.fullName = action.payload.fullName;
      state.userName = action.payload.userName;
      state.profilePicture = action.payload.profilePicture;
    },
    removeUser(state, action) {
      state.token = action.payload.token;
      state.fullName = action.payload.fullName;
      state.userName = action.payload.userName;
      state.profilePicture = action.payload.profilePicture;
    },
  },
});

export const loadUserAction = () => {
  return async (dispatch) => {
    try {
      const getToken = await AsyncStorage.getItem("token");
      const getFullName = await AsyncStorage.getItem("fullName");
      const getUserName = await AsyncStorage.getItem("userName");
      const getProfilePicture = await AsyncStorage.getItem("profilePicture");
      // console.log("loadUserAction start");
      // console.log(getToken);
      // console.log(getFullName);
      // console.log(getUserName);
      // console.log(getProfilePicture);
      // console.log("loadUserAction end");

      dispatch(
        authorizationSlice.actions.loadUser({
          token: getToken,
          fullName: getFullName,
          userName: getUserName,
          profilePicture: getProfilePicture,
        })
      );
    } catch (error) {
      console.log("loadUserAction error");
      console.log(error);
    }
  };
};

export const removeUserAction = () => {
  return async (dispatch) => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("fullName");
      await AsyncStorage.removeItem("userName");
      await AsyncStorage.removeItem("profilePicture");
      dispatch(
        authorizationSlice.actions.removeUser({
          token: null,
          fullName: "",
          userName: "",
          profilePicture: "",
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export default authorizationSlice.reducer;

// export const authorizationActions = authorizationSlice.actions;
