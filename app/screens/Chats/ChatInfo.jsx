import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  RefreshControl,
} from "react-native";
import Colors from "../../Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import ProfileButtons from "../../components/buttons/ProfileButtons";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  TopSettingsItem,
  MiddleSettingsItem,
  BottomSettingsItem,
} from "../../components/SettingsItems";
import BackButton from "../../components/BackButton";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingProfileCard from "../../components/Loading/LoadingProfileCard";
import { BACKEND_URL, BACKEND_PROFILE_IMAGE_URL } from "@env";
import { useSelector, useDispatch } from "react-redux";
import {
  loadUserAction,
  removeUserAction,
} from "../../store/authorization-slice";

const ChatInfo = ({ route }) => {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profileNumbersData, setProfileNumbersData] = useState({
    thoughts: 0,
    memories: 0,
    followers: 0,
    following: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [accountPrivacy, setAccountPrivacy] = useState(true);
  const [canViewProfile, setCanViewProfile] = useState(true);
  const [areBothSame, setAreBothSame] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowRequestSent, setIsFollowRequestSent] = useState(false);

  const [isDeleteModelShown, setIsDeleteModelShown] = useState(false);
  const [isClearModelShown, setIsClearModelShown] = useState(false);

  const navigation = useNavigation();
  const userToken = useSelector((state) => state.authorization.token);
  const userName = useSelector((state) => state.authorization.userName);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  const deleteModelToggleClickHandler = () => {
    setIsDeleteModelShown((prev) => !prev);
  };
  const clearModelToggleClickHandler = () => {
    setIsClearModelShown((prev) => !prev);
  };

  const followButtonHandler = async () => {
    try {
      const request = await fetch(
        BACKEND_URL + "/followers-followings/follow",
        {
          method: "POST",
          body: JSON.stringify({
            otherUserName: route.params.otherUserName,
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const response = await request.json();

      if (response.status === "FOLLOW_REQUEST_SENT") {
        onLoadHandlerWithLoading();
      }
      if (response.status === "STARTED_FOLLOWING") {
        onLoadHandlerWithLoading();
      }

      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }

      return response.status;
    } catch (error) {}
  };

  const unfollowHandler = async () => {
    setIsConfirmationModalLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/followers-followings/un-follow",
        {
          method: "POST",
          body: JSON.stringify({
            otherUserName: route.params.otherUserName,
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const response = await request.json();

      if (response.status === "UNFOLLOWED") {
        unfollowModalCloseHandler();
        onLoadHandlerWithLoading();
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }

      return response.status;
    } catch (error) {}
    setIsConfirmationModalLoading(false);
  };

  const [isUnfollowModalShown, setIsUnfollowModalShown] = useState(false);

  const unfollowModalCloseHandler = () => {
    setIsUnfollowModalShown(false);
  };

  const [isConfirmationModalLoading, setIsConfirmationModalLoading] =
    useState(false);

  const unfollowButtonHandler = () => {
    setIsUnfollowModalShown(true);
  };

  const onLoadHandlerWithLoading = async () => {
    setIsLoading(true);
    await onLoadHandler();
    setIsLoading(false);
  };
  const onLoadHandler = async () => {
    try {
      const request = await fetch(
        BACKEND_URL + "/profile/others/" + route.params.otherUserName,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const response = await request.json();

      if (response.status === "OTHER_PROFILE_FETCHED") {
        setBio(response.data.profileDetails.bio);
        setProfileNumbersData(response.data.profileDetails.profileNumbersData);
        setAccountPrivacy(response.data.profileDetails.accountPrivacy);
        setFullName(response.data.profileDetails.fullName);
        setCanViewProfile(true);
        setIsFollowing(response.data.profileDetails.isRequestingUserFollowing);
        setAreBothSame(response.data.areBothSame);
        setIsFollowRequestSent(
          response.data.profileDetails.isFollowRequestSent
        );
      }
      if (response.status === "NOT_FOLLOWING_OTHER_USER") {
        setBio(response.data.profileDetails.bio);
        setProfileNumbersData(response.data.profileDetails.profileNumbersData);
        setAccountPrivacy(response.data.profileDetails.accountPrivacy);
        setFullName(response.data.profileDetails.fullName);
        setCanViewProfile(false);
        setIsFollowing(response.data.profileDetails.isRequestingUserFollowing);
        setAreBothSame(response.data.areBothSame);
        setIsFollowRequestSent(
          response.data.profileDetails.isFollowRequestSent
        );
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
  };
  useEffect(() => {
    onLoadHandlerWithLoading();
  }, []);

  const deleteChatHandler = async () => {
    setIsConfirmationModalLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/chat/", {
        method: "DELETE",
        body: JSON.stringify({
          chatID: route.params.chatID,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "CHAT_DELETED") {
        navigation.navigate("chats-root");
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }

      return response.status;
    } catch (error) {}
    setIsConfirmationModalLoading(false);
  };
  const clearChatHandler = async () => {
    setIsConfirmationModalLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/chat/", {
        method: "PATCH",
        body: JSON.stringify({
          chatID: route.params.chatID,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "CHAT_CLEARED") {
        navigation.goBack();
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }

      return response.status;
    } catch (error) {}
    setIsConfirmationModalLoading(false);
  };

  return (
    <View style={styles.mainContainer}>
      <ConfirmationModal
        visible={isUnfollowModalShown}
        closeModal={unfollowModalCloseHandler}
        confirmButtonText="Unfollow"
        confirmButtonTextColor={Colors.yellow200}
        confirmButtonHandler={unfollowHandler}
        modelFlex={0.75}
        isConfirmationModalLoading={isConfirmationModalLoading}
      >
        <View
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
                  uri:
                    BACKEND_PROFILE_IMAGE_URL +
                    route.params.otherUserName +
                    ".png",
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
              Unfollow {route.params.otherUserName}
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
              Once you unfollow {fullName}, you will not be able to see their
              activity.
            </Text>
          </View>
        </View>
      </ConfirmationModal>
      <ConfirmationModal
        visible={isDeleteModelShown}
        closeModal={deleteModelToggleClickHandler}
        confirmButtonText="Delete"
        confirmButtonTextColor={Colors.error}
        confirmButtonHandler={deleteChatHandler}
        modelFlex={0.8}
        isConfirmationModalLoading={isConfirmationModalLoading}
      >
        <View
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 19,
              }}
            >
              <Image
                style={{
                  bottom: 14,
                  left: 9,
                  height: 47,
                  width: 47,
                  borderRadius: 4.7 * 3,
                  marginTop: 3,
                  backgroundColor: Colors.darkForLoading,
                }}
                source={{
                  uri: BACKEND_PROFILE_IMAGE_URL + userName + ".png",
                }}
              />
              <Image
                style={{
                  top: 8,
                  right: 9,
                  height: 47,
                  width: 47,
                  borderRadius: 4.7 * 3,
                  marginTop: 3,
                  backgroundColor: Colors.darkForLoading,
                }}
                source={{
                  uri:
                    BACKEND_PROFILE_IMAGE_URL +
                    route.params.otherUserName +
                    ".png",
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
              Delete Chat
            </Text>

            <Text
              style={{
                color: Colors.grey,
                fontSize: 16,
                fontWeight: "500",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Are you sure you want to delete chat with @
              {route.params.otherUserName}.
            </Text>
          </View>
        </View>
      </ConfirmationModal>
      <ConfirmationModal
        visible={isClearModelShown}
        closeModal={clearModelToggleClickHandler}
        confirmButtonText="Clear"
        confirmButtonTextColor={Colors.yellow200}
        confirmButtonHandler={clearChatHandler}
        modelFlex={0.8}
        isConfirmationModalLoading={isConfirmationModalLoading}
      >
        <View
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 19,
              }}
            >
              <Image
                style={{
                  bottom: 14,
                  left: 9,
                  height: 47,
                  width: 47,
                  borderRadius: 4.7 * 3,
                  marginTop: 3,
                  backgroundColor: Colors.darkForLoading,
                }}
                source={{
                  uri: BACKEND_PROFILE_IMAGE_URL + userName + ".png",
                }}
              />
              <Image
                style={{
                  top: 8,
                  right: 9,
                  height: 47,
                  width: 47,
                  borderRadius: 4.7 * 3,
                  marginTop: 3,
                  backgroundColor: Colors.darkForLoading,
                }}
                source={{
                  uri:
                    BACKEND_PROFILE_IMAGE_URL +
                    route.params.otherUserName +
                    ".png",
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
              Clear Chat
            </Text>

            <Text
              style={{
                color: Colors.grey,
                fontSize: 16,
                fontWeight: "500",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Are you sure you want to clear all the chats with @
              {route.params.otherUserName}.
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
          <View style={styles.usernameContainer}>
            <Text style={styles.infoOfUsername}>
              {route.params.otherUserName}
            </Text>
            <Text style={styles.headingText}>Chat Info</Text>
          </View>
        </View>

        <ScrollView
          scrollEnabled={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onLoadHandlerWithLoading}
            />
          }
        >
          <View style={{ padding: 2 }} />
          {isLoading && <LoadingProfileCard />}

          {!isLoading && (
            <View style={styles.profileDetailsContainerMain}>
              <View style={styles.profileDetailsContainer}>
                <View style={styles.dpFullnameBioContainer}>
                  <View style={styles.dpFullnameContainer}>
                    <View style={styles.dpContainer}>
                      <Image
                        source={{
                          uri:
                            BACKEND_PROFILE_IMAGE_URL +
                            route.params.otherUserName +
                            ".png",
                        }}
                        style={styles.profileDP}
                      />
                    </View>
                    <View style={styles.fullnameContainer}>
                      <Text style={styles.fullName}>{fullName}</Text>
                      <Text style={styles.userNameInCard}>
                        @{route.params.otherUserName} •{" "}
                        {accountPrivacy === true ? "private" : "public"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bioContainer}>
                    <Text style={styles.bio}>{bio}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.allCategoriesContainer,
                    { marginBottom: areBothSame ? 17 : 0 },
                  ]}
                >
                  <View
                    style={{
                      flex: 0.97,
                    }}
                  >
                    <Text style={styles.categoryName}>Thoughts</Text>
                    <Text style={styles.categoryValue}>
                      {profileNumbersData.thoughts}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={styles.categoryName}>Memories</Text>
                    <Text style={styles.categoryValue}>
                      {profileNumbersData.memories}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={styles.categoryName}>Followers</Text>
                    <Text style={styles.categoryValue}>
                      {profileNumbersData.followers}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={styles.categoryName}>Following</Text>
                    <Text style={styles.categoryValue}>
                      {profileNumbersData.following}
                    </Text>
                  </View>
                  {/* <View style={styles.shareButton}>
                    <Pressable>
                      <Feather name="share" size={20} color={Colors.white} />
                    </Pressable>
                  </View> */}
                </View>
                {!areBothSame && (
                  <View style={styles.buttonControlsContainer}>
                    {isFollowing && (
                      <ProfileButtons
                        buttonText="Following"
                        style={{
                          flex: 1,
                          marginRight: isFollowing ? 3.5 : 0,
                          color: Colors.yellow200,
                          backgroundColor: Colors.yellowTint,
                          paddingVertical: 8.5,
                        }}
                        onPress={unfollowButtonHandler}
                      />
                    )}

                    {!isFollowing && !isFollowRequestSent && (
                      <ProfileButtons
                        buttonText="Follow"
                        style={{
                          flex: 1,
                          marginRight: isFollowing ? 3.5 : 0,
                          color: Colors.dark200,
                          backgroundColor: Colors.yellow200,
                          paddingVertical: 8.5,
                        }}
                        onPress={followButtonHandler}
                      />
                    )}

                    {isFollowRequestSent && (
                      <ProfileButtons
                        buttonText="Requested"
                        style={{
                          flex: 1,
                          marginRight: isFollowing ? 3.5 : 0,
                          color: Colors.white,
                          backgroundColor: Colors.dark40,
                          paddingVertical: 8.5,
                        }}
                        onPress={() => {}}
                      />
                    )}

                    {isFollowing && (
                      <ProfileButtons
                        buttonText="View Profile"
                        style={{
                          flex: 1,
                          marginLeft: 3.5,
                          color: Colors.white,
                          backgroundColor: Colors.dark50,
                          paddingVertical: 8.5,
                        }}
                        onPress={() => {
                          navigation.navigate("others-profile", {
                            usernameToFetch: route.params.otherUserName,
                          });
                        }}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={styles.otherChatControls}>
            <View style={styles.settingsCategory}>
              <Text style={styles.settingsCategoryText}>Actions</Text>
            </View>

            <TopSettingsItem
              settingsName="Clear Chat"
              style={{}}
              onPress={clearModelToggleClickHandler}
            >
              <Feather name="scissors" size={19} color={Colors.white} />
            </TopSettingsItem>
            <BottomSettingsItem
              settingsName="Delete Chat"
              style={{ color: Colors.white }}
              onPress={deleteModelToggleClickHandler}
            >
              {/* <FontAwesome  /> */}
              <Feather name="trash" size={19} color={Colors.white} />
            </BottomSettingsItem>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ChatInfo;

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
    marginTop: 8,
    paddingHorizontal: 18,
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  usernameContainer: {
    marginLeft: 20,
  },
  controlsContainer: {},
  headingText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
  },

  infoOfUsername: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.white,
    textTransform: "uppercase",
  },
  otherChatControls: {
    paddingTop: 9,
    paddingHorizontal: 13,
    paddingBottom: 18,
  },
  settingsCategory: {
    marginBottom: 10,
  },
  settingsCategoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.greyTint,
  },

  /////

  /////

  dpContainer: {
    alignItems: "center",
  },
  allCategoriesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 17,
    marginBottom: 17,
  },
  categoryValue: {
    fontWeight: "700",
    color: Colors.grey,
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
  },
  categoryName: {
    fontWeight: "500",
    color: Colors.grey,
    fontSize: 13,
    textAlign: "center",
  },
  fullnameContainer: {
    // alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginLeft: 8,
    // flex: 1,
    // borderWidth: 1,
    borderColor: Colors.grey,
  },
  fullName: {
    // paddingTop: 7,
    fontWeight: "700",
    color: Colors.white,
    fontSize: 18,
  },
  bioContainer: {
    paddingTop: 15,
    paddingBottom: 4,
    paddingHorizontal: 5,
  },
  bio: {
    paddingTop: 5,
    fontWeight: "500",
    color: Colors.white,
    fontSize: 15,
  },
  buttonControlsContainer: {
    paddingHorizontal: 16,
    marginBottom: 17,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  shareButton: {
    // borderRadius: 9,
    // backgroundColor: Colors.dark50,
    marginLeft: 19,
    marginRight: 2,
    // borderWidth: 0,
    alignItems: "center",
  },
  profileDetailsContainerMain: {
    // paddingHorizontal: 12
  },
  profileDetailsContainer: {
    paddingHorizontal: 6,
    // marginTop: 8,
    marginBottom: 15,
    backgroundColor: Colors.dark200,
    // borderRadius: 17,
    borderBottomWidth: 2.5,
    borderTopWidth: 2.5,
    borderColor: Colors.dark90,
  },
  dpFullnameBioContainer: {
    paddingHorizontal: 14,
  },
  profileDP: {
    height: 50,
    width: 50,
    borderRadius: 5 * 3,
    resizeMode: "contain",
    backgroundColor: Colors.darkForLoading,
  },
  dpFullnameContainer: {
    // alignItems
    flexDirection: "row",
    paddingTop: 15,
  },
  userNameInCard: {
    color: Colors.grey,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 1,
  },
});
