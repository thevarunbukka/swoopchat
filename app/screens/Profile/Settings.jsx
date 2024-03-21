import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Switch,
  RefreshControl,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  AntDesign,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import LargeButton from "../../components/buttons/LargeButtonFilled";
import Colors from "../../Colors";
import { useNavigation } from "@react-navigation/native";
import LargeTextBox from "../../components/textboxes/LargeTextBox";
import Error from "../../components/Error";
import Info from "../../components/Info";
import {
  TopSettingsItem,
  MiddleSettingsItem,
  BottomSettingsItem,
  MiddleSettingsItemWithSwitch,
} from "../../components/SettingsItems";
import ConfirmationModal from "../../components/ConfirmationModal";

import { useSelector, useDispatch } from "react-redux";
import {
  loadUserAction,
  removeUserAction,
} from "../../store/authorization-slice";
import { BACKEND_URL, BACKEND_PROFILE_IMAGE_URL } from "@env";
import BackButton from "../../components/BackButton";

const Settings = () => {
  // const validateEmail = (email) => {
  //   return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  // };

  const [accountPrivacy, setAccountPrivacy] = useState(false);
  const [isConfirmationModalLoading, setIsConfirmationModalLoading] =
    useState(false);

  const navigation = useNavigation();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUserAction());
  }, []);
  const token = useSelector((state) => state.authorization.token);
  const fullName = useSelector((state) => state.authorization.fullName);
  const userName = useSelector((state) => state.authorization.userName);
  const profilePicture = useSelector(
    (state) => state.authorization.profilePicture
  );

  const [isSignOutShown, setIsSignOutShown] = useState(false);
  const signOutToggleClickHandler = () => {
    setIsSignOutShown((prev) => !prev);
  };

  const [isSearchHistoryModalShown, setIsSearchHistoryModalShown] =
    useState(false);
  const searchHistoryModalToggleClickHandler = () => {
    setIsSearchHistoryModalShown((prev) => !prev);
  };

  const onLoadHandler = async () => {
    try {
      const request = await fetch(BACKEND_URL + "/settings/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();

      if (response.status === "SETTINGS_LOADED") {
        setAccountPrivacy(response.data.accountPrivacy);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
  };
  useEffect(() => {
    onLoadHandler();
  }, []);

  const clearSearchHistoryClickHandler = async () => {
    setIsConfirmationModalLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/settings/clear-search-history/",
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();

      if (response.status === "SEARCH_HISTORY_CLEARED") {
        searchHistoryModalToggleClickHandler();
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {}
    setIsConfirmationModalLoading(false);
  };

  const toggleAccountPrivacyClickHandler = async () => {
    try {
      const request = await fetch(
        BACKEND_URL + "/settings/toggle-account-privacy/",
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();

      if (response.status === "ACCOUNT_PRIVACY_TOGGLED") {
        setAccountPrivacy(response.data.accountPrivacy);
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {
      // setEmailOrUsernameError("Unable to reach the server.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ConfirmationModal
        visible={isSignOutShown}
        closeModal={signOutToggleClickHandler}
        confirmButtonText="Sign Out"
        confirmButtonTextColor={Colors.error}
        confirmButtonHandler={() => {
          setIsConfirmationModalLoading(true);
          dispatch(removeUserAction());
          setIsConfirmationModalLoading(false);
        }}
        modelFlex={0.55}
        isConfirmationModalLoading={isConfirmationModalLoading}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1.2, marginRight: 6 }}>
            <Image
              source={{ uri: BACKEND_PROFILE_IMAGE_URL + profilePicture }}
              style={{
                height: 59,
                width: 59,
                borderRadius: 5.9 * 3,
                resizeMode: "contain",
              }}
            />
          </View>
          <View style={{ marginLeft: 10, flex: 5 }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              Sign Out
            </Text>
            <Text
              style={{
                paddingTop: 5,
                color: Colors.grey,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Do you really want to sign out, as this action cannot be reverted
              after confirming.
            </Text>
          </View>
        </View>
        {/* <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 9,
              }}
            >
              <Image
                style={{
                  height: 69,
                  width: 69,
                  borderRadius: 6.9 * 3,
                  marginTop: 3,
                  backgroundColor: Colors.darkForLoading,
                }}
                source={{
                  uri: BACKEND_PROFILE_IMAGE_URL + profilePicture,
                }}
              />
            </View>
            <Text
              style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 1,
                textAlign: "center",
              }}
            >
              Sign Out
            </Text>

            <Text
              style={{
                color: Colors.grey,
                fontSize: 16,
                fontWeight: "400",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Do you really want to sign out, as this action cannot be reverted
              after confirming.
            </Text>
          </View>
        </View> */}
      </ConfirmationModal>

      <ConfirmationModal
        visible={isSearchHistoryModalShown}
        closeModal={searchHistoryModalToggleClickHandler}
        confirmButtonText="Clear Search History"
        confirmButtonTextColor={Colors.yellow200}
        confirmButtonHandler={clearSearchHistoryClickHandler}
        modelFlex={0.6}
        isConfirmationModalLoading={isConfirmationModalLoading}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1.2,
              marginRight: 6,
            }}
          >
            <Image
              source={{ uri: BACKEND_PROFILE_IMAGE_URL + profilePicture }}
              style={{
                height: 59,
                width: 59,
                borderRadius: 5.9 * 3,
                resizeMode: "contain",
              }}
            />
          </View>
          <View
            style={{
              marginLeft: 10,
              flex: 5,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              Clear Search History
            </Text>
            <Text
              style={{
                paddingTop: 5,
                color: Colors.grey,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Do you really want to clear your search history as this action
              cannot be reverted after confirming.
            </Text>
          </View>
        </View>
      </ConfirmationModal>

      <View style={styles.innerContainer}>
        <View style={styles.upperControlsContainer}>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={styles.headingText}>Settings</Text>
        </View>
        <ScrollView
          scrollEnabled={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onLoadHandler} />
          }
        >
          <View style={styles.scrollViewInnerContainer}>
            <View style={styles.settingsTop}>
              <Image
                style={styles.settingsDP}
                source={{ uri: BACKEND_PROFILE_IMAGE_URL + profilePicture }}
              />
              <View style={styles.settingsProfileMain}>
                <View style={styles.settingsData}>
                  <Text style={styles.settingsDataHeading}>{fullName}</Text>
                  <Text style={styles.settingsDataSubHeading}>@{userName}</Text>
                </View>
                {/* <View style={styles.settingsQRContainer}>
                  <Ionicons
                    name="qr-code-outline"
                    size={28}
                    color={Colors.white}
                  />
                </View> */}
              </View>
            </View>
          </View>

          <View style={styles.scrollViewInnerContainer}>
            <View style={styles.settingsCategory}>
              <Text style={styles.settingsCategoryText}>Profile</Text>
            </View>
            <TopSettingsItem
              settingsName="Edit Profile"
              style={{}}
              onPress={() => {
                navigation.navigate("edit-profile");
              }}
            >
              <Feather name="user" size={20} color={Colors.white} />
            </TopSettingsItem>

            <BottomSettingsItem
              settingsName="Followers & Following"
              style={{}}
              onPress={() =>
                navigation.navigate("followers-followings", {
                  userName: userName,
                  tabToOpen: "followers",
                })
              }
            >
              <Feather name="users" size={20} color={Colors.white} />
            </BottomSettingsItem>
          </View>
          <View style={styles.scrollViewInnerContainer}>
            <View style={styles.settingsCategory}>
              <Text style={styles.settingsCategoryText}>Activity</Text>
            </View>
            <TopSettingsItem
              settingsName="Clear Search History"
              style={{}}
              onPress={searchHistoryModalToggleClickHandler}
            >
              <Feather name="search" size={19} color={Colors.white} />
            </TopSettingsItem>
            <MiddleSettingsItem
              settingsName="Moments"
              style={{}}
              onPress={() => {
                navigation.navigate("moments");
              }}
            >
              <Feather name="radio" size={20} color={Colors.white} />
            </MiddleSettingsItem>
            <MiddleSettingsItem
              settingsName="Liked"
              style={{}}
              onPress={() => {
                navigation.navigate("liked");
              }}
            >
              <Ionicons name="heart-outline" size={20} color={Colors.white} />
            </MiddleSettingsItem>

            <BottomSettingsItem
              settingsName="Saved"
              style={{}}
              onPress={() => {
                navigation.navigate("saved");
              }}
            >
              <Ionicons
                name="bookmark-outline"
                size={20}
                color={Colors.white}
              />
            </BottomSettingsItem>
          </View>
          <View style={styles.scrollViewInnerContainer}>
            <View style={styles.settingsCategory}>
              <Text style={styles.settingsCategoryText}>
                Security & Privacy
              </Text>
            </View>
            <TopSettingsItem
              settingsName="Change Email"
              style={{}}
              onPress={() => {
                navigation.navigate("change-email");
              }}
            >
              <Feather name="at-sign" size={19} color={Colors.white} />
            </TopSettingsItem>
            <MiddleSettingsItemWithSwitch
              settingsName="Account Privacy"
              style={{}}
              switchValue={accountPrivacy}
              onSwitchValueChange={toggleAccountPrivacyClickHandler}
            >
              <Feather name="lock" size={19} color={Colors.white} />
            </MiddleSettingsItemWithSwitch>

            <BottomSettingsItem
              settingsName="Sign Out"
              // style={{ color: Colors.error }}
              onPress={signOutToggleClickHandler}
            >
              <MaterialIcons name="logout" size={21} color={Colors.white} />
            </BottomSettingsItem>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: Colors.dark200,
  },
  innerContainer: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: Colors.dark200,
  },
  upperControlsContainer: {
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headingText: {
    fontSize: 21,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 15,
  },

  scrollViewInnerContainer: {
    marginTop: 14,
    paddingHorizontal: 13,
    paddingBottom: 18,
  },
  settingsTop: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.dark100,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.dark90,
  },
  settingsDP: {
    height: 49,
    width: 49,
    borderRadius: 4.9 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  settingsData: { flex: 1, marginLeft: 11 },
  settingsDataHeading: {
    fontSize: 19,
    fontWeight: "600",
    color: Colors.white,
  },
  settingsDataSubHeading: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.grey,
    marginTop: 1,
  },
  settingsQRContainer: { marginLeft: 1 },
  settingsQR: {},
  settingsProfileMain: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingsCategory: {
    marginBottom: 10,
  },
  settingsCategoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.greyTint,
  },
});
