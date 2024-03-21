import Colors from "./Colors";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwsome from "@expo/vector-icons/FontAwesome";
import { Entypo, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, View } from "react-native";

// screens
import Welcome from "./screens/Welcome";
import Authenticator from "./screens/Authenticator";
import FinishAccountSetup from "./screens/FinishAccountSetup";
import ProfileRoot from "./screens/Profile/ProfileRoot";
import OthersProfile from "./screens/Profile/OthersProfile";
import EditProfile from "./screens/Profile/EditProfile";
import ChatsRoot from "./screens/Chats/ChatsRoot";
import Saved from "./screens/Profile/Saved";
import Liked from "./screens/Profile/Liked";
import Settings from "./screens/Profile/Settings";
import FollowersAndFollowing from "./screens/Profile/FollowersAndFollowings";
import MemoriesPage from "./screens/Profile/MemoriesPage";
import Search from "./screens/Search";
import ThoughtPage from "./screens/Profile/ThoughtPage";
import ChatPage from "./screens/Chats/ChatPage";
import { useEffect, useMemo, useState } from "react";
import ChatInfo from "./screens/Chats/ChatInfo";
import HomeRoot from "./screens/Home/HomeRoot";
import Notifications from "./screens/Home/Notifications";
import New from "./screens/New";

import { useSelector, useDispatch } from "react-redux";
import { loadUserAction } from "./store/authorization-slice";
import ChangeEmail from "./screens/Profile/ChangeEmail";
import SavedAndLikedMemoriesPage from "./screens/Profile/SavedAndLikedMemoriesPage";
import Moments from "./screens/Profile/Moments";

//Main Stack
const UnAuthenticatedStack = createNativeStackNavigator();
//Inner Bottom Stack
const Tabs = createBottomTabNavigator();

//Nested Stacks of Bottom Stack
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const ChatsStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const NewStack = createNativeStackNavigator();

const HomeComponent = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="home-root" component={HomeRoot} />
      <HomeStack.Screen name="notifications" component={Notifications} />
      <ProfileStack.Screen name="thought-page" component={ThoughtPage} />
    </HomeStack.Navigator>
  );
};

const ChatsComponent = () => {
  return (
    <ChatsStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatsStack.Screen name="chats-root" component={ChatsRoot} />
      <ChatsStack.Screen name="chat" component={ChatPage} />
      <ChatsStack.Screen name="chat-info" component={ChatInfo} />
      <ChatsStack.Screen name="others-profile" component={OthersProfile} />
    </ChatsStack.Navigator>
  );
};
const ProfileComponent = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="profile-root" component={ProfileRoot} />
      <ProfileStack.Screen name="others-profile" component={OthersProfile} />
      <ProfileStack.Screen name="settings" component={Settings} />
      <ProfileStack.Screen name="edit-profile" component={EditProfile} />
      <ProfileStack.Screen name="saved" component={Saved} />
      <ProfileStack.Screen name="liked" component={Liked} />
      <ProfileStack.Screen name="moments" component={Moments} />
      <ProfileStack.Screen
        name="followers-followings"
        component={FollowersAndFollowing}
      />

      <ProfileStack.Screen name="posts-page" component={MemoriesPage} />
      <ProfileStack.Screen
        name="saved-and-liked-memories-page"
        component={SavedAndLikedMemoriesPage}
      />
      <ProfileStack.Screen name="thought-page" component={ThoughtPage} />
      <ProfileStack.Screen name="change-email" component={ChangeEmail} />
    </ProfileStack.Navigator>
  );
};
const SearchComponent = () => {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="search-root" component={Search} />
      <SearchStack.Screen name="others-profile" component={OthersProfile} />
      <ProfileStack.Screen name="thought-page" component={ThoughtPage} />
      <ProfileStack.Screen name="posts-page" component={MemoriesPage} />
      <ProfileStack.Screen
        name="followers-followings"
        component={FollowersAndFollowing}
      />
    </SearchStack.Navigator>
  );
};
const AuthenticatedStackScreens = () => {
  // to bring outside specific stack : chat page , chat info , change email

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  function EmptyComponent() {
    return null;
  }

  return (
    <>
      <New visible={modalVisible} closeModal={closeModal} />
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.yellow200,
          tabBarInactiveTintColor: Colors.tabInactive,
          tabBarStyle: {
            paddingTop: 8,
            backgroundColor: Colors.dark200,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          component={HomeComponent}
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chats"
          component={ChatsComponent}
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              // <Entypo name="message" size={size + 1} color={color} />
              <Feather name="message-square" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="new"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <Feather name="edit" size={size - 1} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              openModal();
            },
          }}
          component={EmptyComponent}
        />

        <Tabs.Screen
          name="search"
          component={SearchComponent}
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              // <Ionicons name="ios-search-sharp" size={size} color={color} />
              // <FontAwsome name="search" size={size - 1} color={color} />
              <Feather name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          component={ProfileComponent}
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              // <MaterialIcons name="account-circle" size={size} color={color} />
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tabs.Navigator>
    </>
  );
};

const UnAuthenticatedStackScreens = () => {
  return (
    <UnAuthenticatedStack.Navigator screenOptions={{ headerShown: false }}>
      <UnAuthenticatedStack.Screen name="welcome" component={Welcome} />
      <UnAuthenticatedStack.Screen
        name="authenticator"
        component={Authenticator}
      />
      <UnAuthenticatedStack.Screen
        name="finish-account-setup"
        component={FinishAccountSetup}
      />
    </UnAuthenticatedStack.Navigator>
  );
};

const Navigations = () => {
  const dispatch = useDispatch();
  dispatch(loadUserAction());
  let token = useSelector((state) => state.authorization.token);

  const RenderedScreen = useMemo(
    () => () => {
      if (token !== null) {
        return <AuthenticatedStackScreens />;
      }
      if (token === null) {
        return <UnAuthenticatedStackScreens />;
      }
      return <View></View>;
    },
    [token]
  );
  return (
    <>
      <NavigationContainer style={styles.container}>
        <RenderedScreen />
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Navigations;

//  "expo": "~49.0.8",
