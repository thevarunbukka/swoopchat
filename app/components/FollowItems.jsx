import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import Colors from "../Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import {
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MEMORIES_IMAGE_URL,
} from "@env";

export const FollowerItem = ({
  _id,
  fullName,
  goToProfile,
  removeButtonHandler,
}) => {
  const rightSwipeHandler = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Pressable
          style={styles.removeButton}
          onPress={() => removeButtonHandler(_id, fullName)}
        >
          {/* <Feather name="trash" size={23} color={Colors.white} /> */}
          <Text style={styles.removeButtonText}>Remove</Text>
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
            onPress={goToProfile}
          >
            <View style={styles.notificationInnerContainer}>
              <View style={styles.basicNotificationDpContainer}>
                <Image
                  source={{ uri: BACKEND_PROFILE_IMAGE_URL + _id + ".png" }}
                  style={styles.dp}
                />
              </View>
              <View style={styles.notificationDataContainer}>
                <View>
                  <Text style={styles.anyNotificationHeading}>{_id}</Text>
                  <Text style={styles.anyNotificationText}>{fullName}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );

  // return (
  //   <Pressable style={styles.outerContainer} onPress={onPress}>
  //     <View style={styles.innerContainer}>
  //       <View style={styles.dpContainer}>
  //         <Image
  //           source={require("../assets/images/dummy_image.png")}
  //           style={styles.profileDP}
  //         />
  //       </View>
  //       <View style={styles.allDetailsAndControlsContainer}>
  //         <View style={styles.dataContainer}>
  //           <Text style={styles.username}>
  //             {str0.length > 16 ? str0.substring(0, 16) + "..." : str0}
  //           </Text>
  //           <Text style={styles.fullname}>
  //             {str.length > 56 ? str.substring(0, 56) + "..." : str}
  //           </Text>
  //         </View>
  //         <View style={styles.controlsContainer}>
  //           {following && (
  //             <Pressable
  //               // onPress={onPress}
  //               style={styles.topButtonWrapper}
  //             >
  //               <Text style={styles.buttonText}>Unfollow</Text>
  //             </Pressable>
  //           )}
  //           {!following && (
  //             <Pressable
  //               // onPress={onPress}
  //               style={[styles.topButtonWrapper, styles.followButton]}
  //             >
  //               <Text style={[styles.buttonText, styles.followButtonText]}>
  //                 Follow
  //               </Text>
  //             </Pressable>
  //           )}
  //           {follower && (
  //             <Pressable
  //               // onPress={onPress}
  //               style={[styles.bottomButtonWrapper, styles.removeButton]}
  //             >
  //               <Text style={styles.buttonText}>Remove</Text>
  //             </Pressable>
  //           )}
  //           {!follower && (
  //             <Pressable
  //               // onPress={onPress}
  //               style={[styles.bottomButtonWrapper, styles.dosentButton]}
  //             >
  //               <Text style={[styles.buttonText, styles.dosentButtonText]}>
  //                 Dosen't Follow You
  //               </Text>
  //             </Pressable>
  //           )}
  //         </View>
  //       </View>
  //     </View>
  //   </Pressable>
  // );
};

export const FollowingItem = ({
  _id,
  fullName,
  goToProfile,
  unfollowButtonHandler,
}) => {
  const rightSwipeHandler = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Pressable
          style={styles.followingButton}
          onPress={() => unfollowButtonHandler(_id, fullName)}
        >
          {/* <Feather name="trash" size={23} color={Colors.white} /> */}
          <Text style={styles.followingButtonText}>Following</Text>
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
            onPress={goToProfile}
          >
            <View style={styles.notificationInnerContainer}>
              <View style={styles.basicNotificationDpContainer}>
                <Image
                  source={{ uri: BACKEND_PROFILE_IMAGE_URL + _id + ".png" }}
                  style={styles.dp}
                />
              </View>
              <View style={styles.notificationDataContainer}>
                <View>
                  <Text style={styles.anyNotificationHeading}>{_id}</Text>
                  <Text style={styles.anyNotificationText}>{fullName}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
};

export const FollowItem = ({
  _id,
  fullName,
  goToProfile,
  isRequested,
  followButtonHandler,
}) => {
  const rightSwipeHandler = () => {
    return isRequested === true ? (
      <View style={{ flexDirection: "row" }}>
        <Pressable style={styles.requestedButton}>
          <Text style={styles.requestedButtonText}>Requested</Text>
        </Pressable>
      </View>
    ) : (
      <View style={{ flexDirection: "row" }}>
        <Pressable
          style={styles.followButton}
          onPress={() => followButtonHandler(_id)}
        >
          <Text style={styles.followButtonText}>Follow</Text>
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
            onPress={goToProfile}
          >
            <View style={styles.notificationInnerContainer}>
              <View style={styles.basicNotificationDpContainer}>
                <Image
                  source={{ uri: BACKEND_PROFILE_IMAGE_URL + _id + ".png" }}
                  style={styles.dp}
                />
              </View>
              <View style={styles.notificationDataContainer}>
                <View>
                  <Text style={styles.anyNotificationHeading}>{_id}</Text>
                  <Text style={styles.anyNotificationText}>
                    {fullName + " "}
                    {!isRequested && (
                      <Text style={{ color: Colors.grey, fontWeight: "500" }}>
                        • Follow
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
};

export const SelfItem = ({ _id, fullName }) => {
  return (
    <View style={styles.basicNotificationOuter}>
      <Pressable style={styles.basicNotificationInsideSwipableContainer}>
        <View style={styles.notificationInnerContainer}>
          <View style={styles.basicNotificationDpContainer}>
            <Image
              source={{ uri: BACKEND_PROFILE_IMAGE_URL + _id + ".png" }}
              style={styles.dp}
            />
          </View>
          <View style={styles.notificationDataContainer}>
            <View>
              <Text style={styles.anyNotificationHeading}>{_id}</Text>
              <Text style={styles.anyNotificationText}>{fullName}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  ///
  ///

  dp: {
    height: 37,
    width: 37,
    borderRadius: 3.7 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  notificationInnerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginBottom: 9,
  },
  basicNotificationInsideSwipableContainer: {
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    paddingHorizontal: 16,
    borderTopEndRadius: 18,
    borderBottomEndRadius: 18,
  },
  followingButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.yellowTint,
    paddingHorizontal: 16,
    borderTopEndRadius: 18,
    borderBottomEndRadius: 18,
  },
  followButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.yellow200,
    paddingHorizontal: 20,
    borderTopEndRadius: 18,
    borderBottomEndRadius: 18,
  },
  basicNotificationDpContainer: {
    marginRight: 6,
    marginTop: 4,
  },
  anyNotificationText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.whiteDarker,
    marginBottom: 1,
  },
  anyNotificationHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 1,
  },
  //
  removeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  followingButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.yellow200,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark200,
  },

  requestedButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.darkForLoading,
    paddingHorizontal: 16,
    borderTopEndRadius: 18,
    borderBottomEndRadius: 18,
  },
  requestedButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.whiteDarker,
  },
});
