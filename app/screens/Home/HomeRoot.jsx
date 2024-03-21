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
import {
  Octicons,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import ProfileButtons from "../../components/buttons/ProfileButtons";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MEMORIES_IMAGE_URL,
  BACKEND_MOMENTS_IMAGE_URL,
} from "@env";
import LoadingThought from "../../components/Loading/LoadingThought";
import LoadingMemory from "../../components/Loading/LoadingMemory";
import Thought from "../../components/Thought";
import Post from "../../components/Post";
import Moment, { LoadingMoment } from "../../components/Moment";
import FullMoment from "../../components/FullMoment";
import ShareMoment from "./ShareMoment";
import * as ImagePicker from "expo-image-picker";
import Suggestion from "../../components/Suggestion";

const { width } = Dimensions.get("window");
const windowWidth = width - 24;
const windowWidthForStory = width - 36;
let storyWidth = Math.floor(width / 3.09);
let storyHeight = Math.floor(width / 3.09);

const HomeRoot = () => {
  const navigation = useNavigation();

  const token = useSelector((state) => state.authorization.token);
  const userName = useSelector((state) => state.authorization.userName);
  const fullName = useSelector((state) => state.authorization.fullName);

  const dispatch = useDispatch();
  const [feed, setFeed] = useState([]);
  const [fetchedMoments, setFetchedMoments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMomentShown, setIsMomentShown] = useState(false);
  const [notifications, setNotifications] = useState(0);

  const [isShareMomentShown, setIsShareMomentShown] = useState(false);

  const openShareMomentModal = () => {
    setIsShareMomentShown(true);
  };
  const closeShareMomentModal = () => {
    setIsShareMomentShown(false);
  };

  const onLoadHandlerWithLoading = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/activity/feed/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();

      if (response.status === "FEED_FETCHED") {
        setFeed(response.data.feed);
        setFetchedMoments(response.data.moments);
        setNotifications(response.data.notification);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
    setIsLoading(false);
  };

  useEffect(() => {
    onLoadHandlerWithLoading();
  }, []);

  const likeButtonHandler = async (_id) => {
    try {
      setFeed((recents) => {
        const updatedFeed = recents.map((recent) => {
          if (recent._id !== _id) {
            return recent;
          } else {
            let updatedRecent = recent;
            if (updatedRecent.isLiked === true) {
              updatedRecent.isLiked = false;
              updatedRecent.likes = updatedRecent.likes.filter(
                (userID) => userID !== userName
              );
              console.log("3.1", updatedRecent.likes);
            } else {
              updatedRecent.isLiked = true;
              updatedRecent.likes.push(userName);
              console.log("3.2", updatedRecent.likes);
            }
            return updatedRecent;
          }
        });
        return updatedFeed;
      });
      const request = await fetch(BACKEND_URL + "/post/like/", {
        method: "POST",
        body: JSON.stringify({
          postID: _id,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();
      return response.status;
    } catch (error) {}
  };

  const saveButtonHandler = async (_id) => {
    try {
      setFeed((recents) => {
        const updatedFeed = recents.map((recent) => {
          if (recent._id !== _id) {
            return recent;
          } else {
            let updatedRecent = recent;
            if (updatedRecent.isSaved === true) {
              updatedRecent.isSaved = false;
              updatedRecent.saves = updatedRecent.saves.filter(
                (userID) => userID !== userName
              );
              console.log("3.1", updatedRecent.saves);
            } else {
              updatedRecent.isSaved = true;
              updatedRecent.saves.push(userName);
              console.log("3.2", updatedRecent.saves);
            }
            return updatedRecent;
          }
        });
        return updatedFeed;
      });
      const request = await fetch(BACKEND_URL + "/post/save/", {
        method: "POST",
        body: JSON.stringify({
          postID: _id,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();
      return response.status;
    } catch (error) {}
  };

  const [currentMoment, setCurrentMoment] = useState({
    caption: "",
    momentImage: "",
    userDP: "",
    userName: "",
    postedOn: "",
  });
  const openMomentHandler = (
    caption,
    momentImage,
    userDP,
    userName,
    postedOn
  ) => {
    setCurrentMoment({
      caption: caption,
      momentImage: momentImage,
      userDP: userDP,
      userName: userName,
      postedOn: postedOn,
    });
    setIsMomentShown(true);
  };
  const closeMomentHandler = () => {
    setIsMomentShown(false);
    setCurrentMoment({
      caption: "",
      momentImage: "",
      userDP: "",
      userName: "",
      postedOn: "",
    });
  };

  const [momentImage, setMomentImage] = useState(null);
  const chooseMomentImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setMomentImage(result.assets[0].uri);
      openShareMomentModal();
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ShareMoment
        key={momentImage}
        visible={isShareMomentShown}
        closeModal={closeShareMomentModal}
        momentImageFromRoot={momentImage}
      />
      <FullMoment
        visible={isMomentShown}
        closeModal={closeMomentHandler}
        imageSize={windowWidthForStory}
        caption={currentMoment.caption}
        momentImage={currentMoment.momentImage}
        userDP={currentMoment.userDP}
        userName={currentMoment.userName}
        postedOn={currentMoment.postedOn}
      />

      <View style={styles.innerContainer}>
        <View style={styles.upperControlsContainer}>
          <Image
            source={require("../../assets/images/full_logo.png")}
            style={styles.logo}
          />
          {/* <View style={styles.usernameContainer}>
            <Text style={styles.headingText}>Activity</Text>
          </View> */}
          <View style={styles.upperButtonsContainer}>
            <Pressable
              style={styles.momentsButtonContainer}
              onPress={chooseMomentImageHandler}
            >
              <Feather name="radio" size={25} color={Colors.white} />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate("notifications");
              }}
              style={styles.bellButton}
            >
              <Feather name="bell" size={25} color={Colors.white} />
              {notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {notifications}
                  </Text>
                </View>
              )}
            </Pressable>
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
          {isLoading && (
            <View style={{ flex: 1, marginBottom: 15 }}>
              <View
                style={{
                  borderColor: Colors.dark98,
                  borderBottomWidth: 3,
                  marginBottom: 13,
                }}
              ></View>

              <ScrollView
                scrollEnabled={true}
                bounces={true}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ padding: 3 }} />
                  <LoadingMoment width={storyWidth} height={storyHeight} />
                  <LoadingMoment width={storyWidth} height={storyHeight} />
                  <LoadingMoment width={storyWidth} height={storyHeight} />
                  <LoadingMoment width={storyWidth} height={storyHeight} />
                  <LoadingMoment width={storyWidth} height={storyHeight} />
                  <LoadingMoment width={storyWidth} height={storyHeight} />
                  <LoadingMoment width={storyWidth} height={storyHeight} />
                  <LoadingMoment width={storyWidth} height={storyHeight} />
                  <LoadingMoment width={storyWidth} height={storyHeight} />
                  <View style={{ padding: 3 }} />
                </View>
              </ScrollView>

              <View
                style={{
                  borderColor: Colors.dark98,
                  borderBottomWidth: 3,
                  marginTop: 13,
                }}
              ></View>
            </View>
          )}
          {!isLoading && fetchedMoments.length > 0 && (
            <View style={styles.momentsMainContainer}>
              {/* <Text style={styles.subheadingTextMoment}>Moments</Text> */}

              <View style={styles.momentsContainerBorderTop}></View>

              <ScrollView
                scrollEnabled={true}
                bounces={true}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ padding: 3 }} />

                  {fetchedMoments.map((item) => (
                    <Moment
                      key={item._id}
                      width={storyWidth}
                      height={storyHeight}
                      momentImage={item.momentImage}
                      momentDateAndTime={item.postedOn}
                      userName={item.userName}
                      openMomentHandler={() =>
                        openMomentHandler(
                          item.caption,
                          BACKEND_MOMENTS_IMAGE_URL + item.momentImage,
                          BACKEND_PROFILE_IMAGE_URL + item.userName + ".png",
                          item.userName,
                          item.postedOn
                        )
                      }
                    />
                  ))}
                  <View style={{ padding: 3 }} />
                </View>
              </ScrollView>

              <View style={styles.momentsContainerBorderBottom}></View>
            </View>
          )}
          {!isLoading && fetchedMoments.length <= 0 && (
            <View style={styles.momentsMainContainer}>
              {/* <Text style={styles.subheadingTextMoment}>Moments</Text> */}
              <View style={styles.momentsContainerBorderTop}></View>

              <View style={{ flexDirection: "row" }}>
                <View style={{ padding: 3 }} />
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <View
                    height={storyHeight + 40}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={[
                        styles.emptyItemsInCategoryContainer,
                        { marginTop: 0 },
                      ]}
                    >
                      <View style={styles.emptyItemsInCategoryIcon}>
                        <Feather name="radio" size={22} color={Colors.grey} />
                      </View>
                      <Text style={styles.emptyItemsInCategoryText}>
                        No Moments
                      </Text>
                      <Text style={styles.emptyItemsInCategoryTextSmall}>
                        When people do, it will be shown here.
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ padding: 3 }} />
              </View>

              <View style={styles.momentsContainerBorderBottom}></View>
            </View>
          )}

          <ScrollView
            scrollEnabled={true}
            bounces={true}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            <View style={styles.feedContainer}>
              {isLoading && (
                <>
                  <LoadingThought />
                  <LoadingMemory imageSize={windowWidth} />
                  <LoadingThought />
                  <LoadingMemory imageSize={windowWidth} />
                  <LoadingThought />
                  <LoadingMemory imageSize={windowWidth} />
                  <LoadingThought />
                  <LoadingMemory imageSize={windowWidth} />
                </>
              )}

              {/* <View
                style={styles.suggestionMainContainer}
                key={Math.random() * 1000000}
              >
                <View style={styles.suggestionLabel}>
                  <Feather name="users" size={21} color={Colors.grey} />
                  <Text style={styles.suggestionLabelText}>Suggestions</Text>
                </View>
                <ScrollView
                  scrollEnabled={true}
                  bounces={true}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Suggestion fullName={fullName} userName={userName} />
                    <Suggestion fullName={fullName} userName={userName} />
                    <Suggestion fullName={fullName} userName={userName} />
                    <Suggestion fullName={fullName} userName={userName} />
                  </View>
                </ScrollView>
              </View> */}

              {feed.length > 0 &&
                !isLoading &&
                feed.map((item) =>
                  item.postType === "thought" ? (
                    <Thought
                      key={item._id}
                      _id={item._id}
                      caption={item.caption}
                      userName={item.userName}
                      postedOn={item.postedOn}
                      userDP={
                        "" + BACKEND_PROFILE_IMAGE_URL + item.userName + ".png"
                      }
                      totalComments={item.comments.length}
                      comments={item.comments}
                      thoughtType={"others-profile"}
                      likeButtonHandler={likeButtonHandler}
                      saveButtonHandler={saveButtonHandler}
                      isLiked={item.isLiked}
                      isSaved={item.isSaved}
                      totalLikes={item.likes.length}
                      totalSaves={item.saves.length}
                    />
                  ) : (
                    <Post
                      imageSize={windowWidth}
                      key={item._id}
                      _id={item._id}
                      memoryCaption={item.caption}
                      userName={item.userName}
                      postedOn={item.postedOn}
                      userDP={
                        "" + BACKEND_PROFILE_IMAGE_URL + item.userName + ".png"
                      }
                      memoryImage={
                        "" + BACKEND_MEMORIES_IMAGE_URL + item.memoryImage
                      }
                      comments={item.comments}
                      totalComments={item.comments.length}
                      memoryType={"others-profile"}
                      tags={item.tags}
                      likeButtonHandler={likeButtonHandler}
                      saveButtonHandler={saveButtonHandler}
                      isLiked={item.isLiked}
                      isSaved={item.isSaved}
                      totalLikes={item.likes.length}
                      totalSaves={item.saves.length}
                    />
                  )
                )}

              {!isLoading && feed.length <= 0 && (
                <View style={styles.emptyItemsInCategoryContainer}>
                  <View style={styles.emptyItemsInCategoryIcon}>
                    <Feather name="activity" size={22} color={Colors.grey} />
                  </View>
                  <Text style={styles.emptyItemsInCategoryText}>
                    No Activity
                  </Text>
                  <Text style={styles.emptyItemsInCategoryTextSmall}>
                    When people do, it will be shown here.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeRoot;

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 19,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: Colors.dark200,
  },
  headingText: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.white,
  },

  scrollViewInnerContainer: {
    marginTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 18,
  },
  logo: {
    height: 32,
    width: 142,
    resizeMode: "contain",
    // borderWidth: 1,
    // borderColor: Colors.error,
  },
  bellButton: {
    // marginTop: 1,
    // borderWidth: 1,
    // borderColor: Colors.error,
    paddingLeft: 12,
  },

  storyItem: {
    // position: "absolute",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: 7,
  },
  storyItemImage: {
    height: 69,
    width: 69,
    borderRadius: 69,
    margin: 4,
  },
  storyItemImageContainer: {
    borderRadius: 69,
    borderWidth: 2,
    borderColor: Colors.greyTint,
    // borderColor: Colors.yellow100,
    // marginRight: 5,
    borderStyle: "dashed",
  },
  storyItemUsername: {
    color: Colors.grey,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  upperButtonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  momentsButtonContainer: {
    marginRight: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
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
  activityCategory: {
    marginTop: 9,
    marginBottom: 13,
    borderColor: Colors.dark98,
    borderBottomWidth: 3,
    paddingBottom: 4,
  },
  feedContainer: { flexDirection: "column", paddingHorizontal: 12 },
  // activityCategoryText: {
  //   marginHorizontal: 18,
  //   color: Colors.whiteDarker,
  //   fontSize: 16,
  //   fontWeight: "600",
  //   marginBottom: 3,
  // },
  userDP: {
    height: 29,
    width: 29,
    borderRadius: 14,
  },
  clearImageButton: {
    margin: 5,
    position: "absolute",
    bottom: -8,
    right: -10,
    width: 14,
    height: 14,
    backgroundColor: Colors.dark100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  subheadingTextMoment: {
    marginTop: 8,
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  subheadingText: {
    marginTop: 8,
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  suggestionLabel: {
    marginTop: 5,
    paddingHorizontal: 7,
    paddingBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionLabelText: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
    marginLeft: 11,
  },
  suggestionMainContainer: {
    marginTop: 0,
    marginBottom: 19,
    paddingTop: 10,
    paddingBottom: 16,
    // borderTopWidth: 2,
    // borderBottomWidth: 2,
    // borderColor: Colors.dark90,
  },
  ///

  momentsMainContainer: { flex: 1, marginBottom: 29 },
  momentsContainerBorderTop: {
    borderColor: Colors.dark98,
    borderBottomWidth: 3,
    marginBottom: 13,
  },
  momentsContainerBorderBottom: {
    borderColor: Colors.dark98,
    borderBottomWidth: 3,
    marginTop: 13,
  },
  notificationBadge: {
    margin: 5,
    position: "absolute",
    bottom: 12,
    left: 16,
    width: 23,
    height: 19,
    backgroundColor: Colors.dark39,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17,
  },
  notificationBadgeText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
  },
});
