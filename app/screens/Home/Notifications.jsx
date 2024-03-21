import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  RefreshControl,
} from "react-native";
import Colors from "../../Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons, Octicons, Entypo, Feather } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
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
import LoadingNotification from "../../components/Loading/LoadingNotification";
import BackButton from "../../components/BackButton";

const BasicNotification = ({
  _id,
  sender,
  recieve,
  text,
  deleteNotification,
  onPress,
  dateAndTime,
}) => {
  const rightSwipeHandler = () => {
    return (
      <Pressable
        style={styles.basicNotificationDeleteButton}
        onPress={() => deleteNotification(_id)}
      >
        <Feather name="trash" size={22} color={Colors.white} />
      </Pressable>
    );
  };
  return (
    <GestureHandlerRootView>
      <View style={styles.basicNotificationOuter}>
        <Swipeable renderRightActions={rightSwipeHandler}>
          <Pressable
            style={styles.basicNotificationInsideSwipableContainer}
            onPress={onPress}
          >
            <View style={styles.notificationInnerContainer}>
              <View style={styles.basicNotificationDpContainer}>
                <Image
                  source={{ uri: BACKEND_PROFILE_IMAGE_URL + sender + ".png" }}
                  style={styles.dp}
                />
              </View>
              <View style={styles.notificationDataContainer}>
                <View>
                  <Text style={styles.anyNotificationHeading}>{sender}</Text>
                  <Text style={styles.anyNotificationText}>{text}</Text>
                  <Text style={styles.dateAndTime}>{dateAndTime}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
};

const FollowRequestNotification = ({
  _id,
  sender,
  recieve,
  text,
  rejectFollowRequest,
  acceptFollowRequest,
  onPress,
  dateAndTime,
}) => {
  const rightSwipeHandler = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Pressable
          style={styles.followRequestApproveButton}
          onPress={() => acceptFollowRequest(sender, _id)}
        >
          <Feather name="check" size={24} color={Colors.white} />
        </Pressable>
        <Pressable
          style={styles.basicNotificationDeleteButton}
          onPress={() => rejectFollowRequest(sender, _id)}
        >
          <Feather name="x" size={24} color={Colors.white} />
        </Pressable>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.basicNotificationOuter}>
        <Swipeable renderRightActions={rightSwipeHandler}>
          <Pressable
            style={styles.basicNotificationInsideSwipableContainer}
            onPress={onPress}
          >
            <View style={styles.notificationInnerContainer}>
              <View style={styles.basicNotificationDpContainer}>
                <Image
                  source={{ uri: BACKEND_PROFILE_IMAGE_URL + sender + ".png" }}
                  style={styles.dp}
                />
              </View>
              <View style={styles.notificationDataContainer}>
                <View>
                  <Text
                    style={[
                      styles.anyNotificationHeading,
                      // { color: Colors.yellow200 },
                    ]}
                  >
                    Follow Request
                  </Text>
                  <Text style={styles.anyNotificationText}>{text}</Text>
                  <Text style={styles.dateAndTime}>{dateAndTime}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
};

const Notifications = () => {
  const [loadedNotifications, setLoadedNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.authorization.token);

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);
  const onLoadHandlerWithLoading = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/notifications/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();

      console.log(response.status);

      if (response.status === "NOTIFICATIONS_LOADED") {
        setLoadedNotifications(response.data.notifications);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {
      // setEmailOrUsernameError("Unable to reach the server.");
    }
    setIsLoading(false);
  };
  const onLoadHandler = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/notifications/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();

      console.log(response.status);

      if (response.status === "NOTIFICATIONS_LOADED") {
        setLoadedNotifications(response.data.notifications);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {
      // setEmailOrUsernameError("Unable to reach the server.");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    onLoadHandlerWithLoading();
  }, []);

  const acceptFollowRequestHandler = async (otherUserName, notificationId) => {
    try {
      const request = await fetch(
        BACKEND_URL + "/notifications/accept-follow-request",
        {
          method: "POST",
          body: JSON.stringify({
            otherUserName: otherUserName,
            notificationId: notificationId,
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();
      console.log(response);

      if (response.status === "FOLLOW_REQUEST_ACCEPTED") {
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
  const rejectFollowRequestHandler = async (otherUserName, notificationId) => {
    try {
      const request = await fetch(
        BACKEND_URL + "/notifications/reject-follow-request",
        {
          method: "POST",
          body: JSON.stringify({
            otherUserName: otherUserName,
            notificationId: notificationId,
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();
      console.log(response);

      if (response.status === "FOLLOW_REQUEST_REJECTED") {
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
  const deleteNotificationHandler = async (notificationId) => {
    try {
      const request = await fetch(BACKEND_URL + "/notifications/delete", {
        method: "POST",
        body: JSON.stringify({
          notificationId: notificationId,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();
      console.log(response);

      if (response.status === "NOTIFICATION_DELETED") {
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

  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.upperControlsContainer}>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={styles.headingText}>Notifications</Text>
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
          <View style={styles.scrollViewInnerContainer}>
            {isLoading && (
              <>
                <LoadingNotification />
                <LoadingNotification />
                <LoadingNotification />
                <LoadingNotification />
                <LoadingNotification />
                <LoadingNotification />
                <LoadingNotification />
                <LoadingNotification />
                <LoadingNotification />
              </>
            )}

            {loadedNotifications.length > 0 &&
              !isLoading &&
              loadedNotifications.map((item) =>
                item.notification === "FOLLOW_REQUEST" ? (
                  <FollowRequestNotification
                    key={item._id}
                    _id={item._id}
                    sender={item.sender}
                    reciever={item.reciever}
                    text={item.text}
                    rejectFollowRequest={rejectFollowRequestHandler}
                    acceptFollowRequest={acceptFollowRequestHandler}
                    onPress={() => {
                      navigation.navigate("others-profile", {
                        usernameToFetch: item.sender,
                      });
                    }}
                    dateAndTime={item.dateAndTime}
                  />
                ) : (
                  <BasicNotification
                    key={item._id}
                    _id={item._id}
                    sender={item.sender}
                    reciever={item.reciever}
                    text={item.text}
                    deleteNotification={deleteNotificationHandler}
                    onPress={() => {
                      navigation.navigate("others-profile", {
                        usernameToFetch: item.sender,
                      });
                    }}
                    dateAndTime={item.dateAndTime}
                  />
                )
              )}

            {!isLoading && loadedNotifications.length <= 0 && (
              <View style={styles.emptyItemsInCategoryContainer}>
                <View style={styles.emptyItemsInCategoryIcon}>
                  <Octicons name="bell" size={20} color={Colors.grey} />
                </View>
                <Text style={styles.emptyItemsInCategoryText}>
                  No Notifications
                </Text>
                <Text style={styles.emptyItemsInCategoryTextSmall}>
                  When you get, it will be shown here.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Notifications;

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
    backgroundColor: Colors.dark200,
    paddingBottom: 16,
  },
  headingText: {
    fontSize: 21,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 15,
  },
  scrollViewInnerContainer: {
    // paddingTop: 1,
    marginTop: 11,
    paddingHorizontal: 12,
    paddingBottom: 18,
  },
  //
  dp: {
    height: 39,
    width: 39,
    borderRadius: 3.9 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  notificationInnerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 3,
    paddingBottom: 4,
  },
  notificationDataContainer: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },

  //basic not
  basicNotificationOuter: {
    borderWidth: 1.5,
    borderColor: Colors.dark90,
    backgroundColor: Colors.dark100,
    borderRadius: 18,
    marginBottom: 8,
  },
  basicNotificationInsideSwipableContainer: {
    paddingHorizontal: 11,
    paddingVertical: 2,
  },
  basicNotificationDeleteButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    paddingHorizontal: 21,
    borderTopEndRadius: 18,
    borderBottomEndRadius: 18,
  },
  basicNotificationDpContainer: {
    marginRight: 6,
    marginTop: 4,
  },
  followRequestApproveButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2d6a4f",
    paddingHorizontal: 21,
  },
  anyNotificationText: {
    fontSize: 15,
    fontWeight: "400",
    color: Colors.whiteDarker,
  },
  anyNotificationHeading: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 1,
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
  dateAndTime: {
    fontSize: 12.5,
    fontWeight: "500",
    color: Colors.grey,
    marginTop: 6,
  },
});
