import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Image,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../../Colors";
import { useNavigation } from "@react-navigation/native";
import {
  SelfItem,
  FollowerItem,
  FollowingItem,
  FollowItem,
} from "../../components/FollowItems";
import { useSelector, useDispatch } from "react-redux";
import {
  loadUserAction,
  removeUserAction,
} from "../../store/authorization-slice";
import {
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MEMORIES_IMAGE_URL,
} from "@env";
import LoadingSearch from "../../components/Loading/LoadingSearch";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import ConfirmationModal from "../../components/ConfirmationModal";
import BackButton from "../../components/BackButton";

const FollowersAndFollowing = ({ route }) => {
  const [currentTab, setCurrentTab] = useState(route.params.tabToOpen);
  const [loadedFollowing, setLoadedFollowing] = useState([]);
  const [loadedFollowers, setLoadedFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const followersTabClickHandler = () => {
    setCurrentTab("followers");
  };
  const followingTabClickHandler = () => {
    setCurrentTab("following");
  };
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authorization.token);
  const userName = useSelector((state) => state.authorization.userName);

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);
  const onLoadHandler = async () => {
    try {
      const request = await fetch(BACKEND_URL + "/followers-followings/", {
        method: "POST",
        body: JSON.stringify({
          otherUserName: route.params.userName,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();

      if (response.status === "FOLLOWERS_AND_FOLLOWING_FETCHED") {
        setLoadedFollowing(response.data.following);
        setLoadedFollowers(response.data.followers);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
  };
  const onLoadHandlerWithLoading = async () => {
    setIsLoading(true);
    await onLoadHandler();
    setIsLoading(false);
  };

  const [isConfirmationModalLoading, setIsConfirmationModalLoading] =
    useState(false);

  useEffect(() => {
    onLoadHandlerWithLoading();
  }, [route]);

  const followButtonHandler = async (_id) => {
    try {
      const request = await fetch(
        BACKEND_URL + "/followers-followings/follow",
        {
          method: "POST",
          body: JSON.stringify({
            otherUserName: _id,
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();

      if (response.status === "FOLLOW_REQUEST_SENT") {
        onLoadHandler();
      }
      if (response.status === "STARTED_FOLLOWING") {
        onLoadHandler();
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {}
  };

  const unfollowHandler = async (_id) => {
    setIsConfirmationModalLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/followers-followings/un-follow",
        {
          method: "POST",
          body: JSON.stringify({
            otherUserName: _id,
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();

      if (response.status === "UNFOLLOWED") {
        unfollowModalCloseHandler();
        onLoadHandler();
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {}
    setIsConfirmationModalLoading(false);
  };

  const removeHandler = async (_id) => {
    setIsConfirmationModalLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/followers-followings/remove",
        {
          method: "POST",
          body: JSON.stringify({
            otherUserName: _id,
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();

      if (response.status === "FOLLOWER_REMOVED") {
        removeModalCloseHandler();
        onLoadHandler();
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {}
    setIsConfirmationModalLoading(false);
  };

  const [whatToUnfollow, setWhatToUnfollow] = useState(null);
  const [whatToRemove, setWhatToRemove] = useState(null);
  const [isUnfollowModalShown, setIsUnfollowModalShown] = useState(false);
  const [isRemoveModalShown, setIsRemoveModalShown] = useState(false);

  const unfollowModalCloseHandler = () => {
    setWhatToUnfollow(null);
    setIsUnfollowModalShown(false);
  };

  const unfollowButtonHandler = (_id, fullName) => {
    setIsUnfollowModalShown(true);
    setWhatToUnfollow({ _id, fullName });
  };

  const removeModalCloseHandler = () => {
    setWhatToRemove(null);
    setIsRemoveModalShown(false);
  };

  const removeButtonHandler = (_id, fullName) => {
    setIsRemoveModalShown(true);
    setWhatToRemove({ _id, fullName });
  };

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <ConfirmationModal
        visible={isUnfollowModalShown}
        closeModal={unfollowModalCloseHandler}
        confirmButtonText="Unfollow"
        confirmButtonTextColor={Colors.yellow200}
        confirmButtonHandler={() => unfollowHandler(whatToUnfollow._id)}
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
          {whatToUnfollow !== null && (
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
                  style={styles.deletePostProfileImage}
                  source={{
                    uri:
                      BACKEND_PROFILE_IMAGE_URL + whatToUnfollow._id + ".png",
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
                Unfollow {whatToUnfollow._id}
              </Text>

              <Text style={styles.deleteThoughtWarning}>
                Once you unfollow {whatToUnfollow.fullName}, you will not be
                able to see their activity.
              </Text>
            </View>
          )}
        </View>
      </ConfirmationModal>
      <ConfirmationModal
        visible={isRemoveModalShown}
        closeModal={removeModalCloseHandler}
        confirmButtonText="Remove"
        confirmButtonTextColor={Colors.error}
        confirmButtonHandler={() => removeHandler(whatToRemove._id)}
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
          {whatToRemove !== null && (
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
                  style={styles.deletePostProfileImage}
                  source={{
                    uri: BACKEND_PROFILE_IMAGE_URL + whatToRemove._id + ".png",
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
                Unfollow {whatToRemove._id}
              </Text>

              <Text style={styles.deleteThoughtWarning}>
                Once you remove {whatToRemove.fullName}, they will not be able
                to see your activity.
              </Text>
            </View>
          )}
        </View>
      </ConfirmationModal>
      <View style={styles.innerContainer}>
        <View style={styles.upperControlsContainer}>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View
            style={{
              flex: 0.9,
              // alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <Text style={styles.headingText}>{route.params.userName}</Text>
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
          <View style={styles.postsAndMemoriesContainer}>
            <View style={styles.postsAndMemoriesTopBar}>
              <Pressable
                onPress={followersTabClickHandler}
                style={[
                  styles.postsAndMemoriesTopButton,
                  {
                    borderColor:
                      currentTab === "followers"
                        ? Colors.yellow200
                        : Colors.dark200,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.postsAndMemoriesTopButtonText,
                    {
                      color:
                        currentTab === "followers"
                          ? Colors.yellow200
                          : Colors.white,
                    },
                  ]}
                >
                  Followers
                </Text>
              </Pressable>
              <Pressable
                onPress={followingTabClickHandler}
                style={[
                  styles.postsAndMemoriesTopButton,
                  {
                    borderColor:
                      currentTab === "following"
                        ? Colors.yellow200
                        : Colors.dark200,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.postsAndMemoriesTopButtonText,
                    {
                      color:
                        currentTab === "following"
                          ? Colors.yellow200
                          : Colors.white,
                    },
                  ]}
                >
                  Following
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.scrollViewItemsContainer}>
            {currentTab === "followers" && (
              <>
                {isLoading && (
                  <>
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <View style={{ padding: 28 }}></View>
                  </>
                )}
                {loadedFollowers.length > 0 &&
                  route.params.userName === userName &&
                  !isLoading &&
                  loadedFollowers.map((item) => (
                    <FollowerItem
                      key={item._id}
                      _id={item._id}
                      fullName={item.fullName}
                      goToProfile={() => {
                        navigation.navigate("others-profile", {
                          usernameToFetch: item._id,
                        });
                      }}
                      removeButtonHandler={removeButtonHandler}
                    />
                  ))}
                {loadedFollowers.length > 0 &&
                  route.params.userName !== userName &&
                  !isLoading &&
                  loadedFollowers.map((item) =>
                    item._id === userName ? (
                      <SelfItem
                        key={item._id}
                        _id={item._id}
                        fullName={item.fullName}
                      />
                    ) : item.isFollowing === true ? (
                      <FollowingItem
                        key={item._id}
                        _id={item._id}
                        fullName={item.fullName}
                        goToProfile={() => {
                          navigation.navigate("others-profile", {
                            usernameToFetch: item._id,
                          });
                        }}
                        unfollowButtonHandler={unfollowButtonHandler}
                      />
                    ) : (
                      <FollowItem
                        key={item._id}
                        _id={item._id}
                        fullName={item.fullName}
                        isRequested={item.isRequested}
                        goToProfile={() => {
                          navigation.navigate("others-profile", {
                            usernameToFetch: item._id,
                          });
                        }}
                        followButtonHandler={followButtonHandler}
                      />
                    )
                  )}
                {!isLoading && loadedFollowers.length <= 0 && (
                  <View style={styles.emptyItemsInCategoryContainer}>
                    <View style={styles.emptyItemsInCategoryIcon}>
                      <Ionicons name={"people"} size={22} color={Colors.grey} />
                    </View>
                    <Text style={styles.emptyItemsInCategoryText}>
                      No Followers
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmall}>
                      When people follow, will be shown here.
                    </Text>
                  </View>
                )}
              </>
            )}
            {currentTab === "following" && (
              <>
                {isLoading && (
                  <>
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <LoadingSearch />
                    <View style={{ padding: 28 }}></View>
                  </>
                )}
                {loadedFollowing.length > 0 &&
                  route.params.userName === userName &&
                  !isLoading &&
                  loadedFollowing.map((item) => (
                    <FollowingItem
                      key={item._id}
                      _id={item._id}
                      fullName={item.fullName}
                      goToProfile={() => {
                        navigation.navigate("others-profile", {
                          usernameToFetch: item._id,
                        });
                      }}
                      unfollowButtonHandler={unfollowButtonHandler}
                    />
                  ))}
                {loadedFollowing.length > 0 &&
                  route.params.userName !== userName &&
                  !isLoading &&
                  loadedFollowing.map((item) =>
                    item._id === userName ? (
                      <SelfItem
                        key={item._id}
                        _id={item._id}
                        fullName={item.fullName}
                      />
                    ) : item.isFollowing === true ? (
                      <FollowingItem
                        key={item._id}
                        _id={item._id}
                        fullName={item.fullName}
                        goToProfile={() => {
                          navigation.navigate("others-profile", {
                            usernameToFetch: item._id,
                          });
                        }}
                        unfollowButtonHandler={unfollowButtonHandler}
                      />
                    ) : (
                      <FollowItem
                        key={item._id}
                        _id={item._id}
                        fullName={item.fullName}
                        isRequested={item.isRequested}
                        goToProfile={() => {
                          navigation.navigate("others-profile", {
                            usernameToFetch: item._id,
                          });
                        }}
                        followButtonHandler={followButtonHandler}
                      />
                    )
                  )}
                {!isLoading && loadedFollowing.length <= 0 && (
                  <View style={styles.emptyItemsInCategoryContainer}>
                    <View style={styles.emptyItemsInCategoryIcon}>
                      <Ionicons name={"people"} size={22} color={Colors.grey} />
                    </View>
                    <Text style={styles.emptyItemsInCategoryText}>
                      No Followings
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmall}>
                      When{" "}
                      {route.params.userName === userName ? "you " : "they "}
                      follow, will be shown here.
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default FollowersAndFollowing;

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
    // textTransform: "uppercase",
  },

  scrollViewInnerContainer: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 18,
  },

  scrollViewItemsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 18,
  },

  ///

  postsAndMemoriesContainer: {
    paddingTop: 18,
    paddingBottom: 30,
    backgroundColor: Colors.dark200,
  },
  postsAndMemoriesTopBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderColor: Colors.greyTint,
  },
  postsAndMemoriesTopButton: {
    paddingBottom: 9,
    paddingHorizontal: 6,
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
  },
  postsAndMemoriesTopButtonText: {
    paddingLeft: 5,
    fontWeight: "600",
    color: Colors.yellow200,
    fontSize: 15,
  },
  emptyItemsInCategoryContainer: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyItemsInCategoryIcon: {
    borderColor: Colors.grey,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    height: 42,
    width: 42,
    borderRadius: 42,
  },
  emptyItemsInCategoryText: {
    marginTop: 10,
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  emptyItemsInCategoryTextSmall: {
    marginTop: 8,
    color: Colors.grey,
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
    marginHorizontal: 6,
  },

  deletePostProfileImage: {
    height: 69,
    width: 69,
    borderRadius: 6.9 * 3,
    marginTop: 3,
    backgroundColor: Colors.darkForLoading,
  },
  deleteThoughtWarning: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    textAlign: "center",
  },
});
