import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  RefreshControl,
  Image,
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
import Thought from "../../components/Thought";
import Post from "../../components/Post";
import { useSelector, useDispatch } from "react-redux";
import {
  loadUserAction,
  removeUserAction,
} from "../../store/authorization-slice";
import {
  BACKEND_MEMORIES_IMAGE_URL,
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MOMENTS_IMAGE_URL,
} from "@env";
import Moment, { LoadingMoment } from "../../components/Moment";
import FullMoment from "../../components/FullMoment";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingThought from "../../components/Loading/LoadingThought";
import LoadingMemory from "../../components/Loading/LoadingMemory";
import LoadingProfileCard from "../../components/Loading/LoadingProfileCard";

const { width } = Dimensions.get("window");
const windowWidth = width - 24;
const gap = 12;
const itemPerRow = 3;
const totalGapSize = (itemPerRow - 1) * gap;
const childWidth = Math.floor((windowWidth - totalGapSize) / itemPerRow);

const windowWidthForStory = width - 36;
let storyWidth = Math.floor(width / 3.09);
let storyHeight = Math.floor(width / 3.09);

const ProfileRoot = () => {
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState("recent");

  const memoriesTabClickHandler = () => {
    setCurrentTab("recent");
  };
  const postsTabClickHandler = () => {
    setCurrentTab("posts");
  };
  const thoughtsTabClickHandler = () => {
    setCurrentTab("thoughts");
  };

  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.authorization.token);
  const fullName = useSelector((state) => state.authorization.fullName);
  const userName = useSelector((state) => state.authorization.userName);
  const profilePicture = useSelector(
    (state) => state.authorization.profilePicture
  );

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  const [bio, setBio] = useState("");
  const [profileNumbersData, setProfileNumbersData] = useState({
    thoughts: 0,
    memories: 0,
    followers: 0,
    following: 0,
  });
  const [fetchedThoughts, setFetchedThoughts] = useState([]);
  const [fetchedMemories, setFetchedMemories] = useState([]);
  const [fetchedRecents, setFetchedRecents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accountPrivacy, setAccountPrivacy] = useState(true);
  const [fetchedMoments, setFetchedMoments] = useState([]);

  const onLoadHandlerWithLoading = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/profile/my/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "PROFILE_FETCHED") {
        setBio(response.data.profileDetails.bio);
        setProfileNumbersData(response.data.profileDetails.profileNumbersData);
        setFetchedMemories(response.data.fetchedMemories);
        setFetchedThoughts(response.data.fetchedThoughts);
        setFetchedRecents(response.data.fetchedRecents);
        setAccountPrivacy(response.data.profileDetails.accountPrivacy);
        setFetchedMoments(response.data.fetchedMoments);
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
    // CHANGE LOGIC
    setFetchedThoughts((thoughts) => {
      const updatedThoughts = thoughts.map((thought) => {
        if (thought._id !== _id) {
          return thought;
        } else {
          let updatedThought = thought;
          if (updatedThought.isLiked === true) {
            updatedThought.isLiked = false;
            updatedThought.likes = updatedThought.likes.filter(
              (userID) => userID !== userName
            );
            console.log("1.1", updatedThought.likes);
          } else {
            updatedThought.isLiked = true;
            updatedThought.likes.push(userName);
            console.log("1.2", updatedThought.likes);
          }
          return updatedThought;
        }
      });
      return updatedThoughts;
    });
    setFetchedMemories((memories) => {
      const updatedMemories = memories.map((memory) => {
        if (memory._id !== _id) {
          return memory;
        } else {
          let updatedMemory = memory;
          if (updatedMemory.isLiked === true) {
            updatedMemory.isLiked = false;
            updatedMemory.likes = updatedMemory.likes.filter(
              (userID) => userID !== userName
            );
            console.log("2.1", updatedMemory.likes);
          } else {
            updatedMemory.isLiked = true;
            updatedMemory.likes.push(userName);
            console.log("2.2", updatedMemory.likes);
          }
          return updatedMemory;
        }
      });
      return updatedMemories;
    });
    setFetchedRecents((recents) => {
      const updatedRecents = recents.map((recent) => {
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
      return updatedRecents;
    });
    try {
      const request = await fetch(BACKEND_URL + "/post/like/", {
        method: "POST",
        body: JSON.stringify({
          postID: _id,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });
      const response = await request.json();
      return response.status;
    } catch (error) {}
  };

  const saveButtonHandler = async (_id) => {
    // CHANGE LOGIC
    setFetchedThoughts((thoughts) => {
      const updatedThoughts = thoughts.map((thought) => {
        if (thought._id !== _id) {
          return thought;
        } else {
          let updatedThought = thought;
          if (updatedThought.isSaved === true) {
            updatedThought.isSaved = false;
            updatedThought.saves = updatedThought.saves.filter(
              (userID) => userID !== userName
            );
            console.log("1.1", updatedThought.saves);
          } else {
            updatedThought.isSaved = true;
            updatedThought.saves.push(userName);
            console.log("1.2", updatedThought.saves);
          }
          return updatedThought;
        }
      });
      return updatedThoughts;
    });
    setFetchedMemories((memories) => {
      const updatedMemories = memories.map((memory) => {
        if (memory._id !== _id) {
          return memory;
        } else {
          let updatedMemory = memory;
          if (updatedMemory.isSaved === true) {
            updatedMemory.isSaved = false;
            updatedMemory.saves = updatedMemory.saves.filter(
              (userID) => userID !== userName
            );
            console.log("2.1", updatedMemory.saves);
          } else {
            updatedMemory.isSaved = true;
            updatedMemory.saves.push(userName);
            console.log("2.2", updatedMemory.saves);
          }
          return updatedMemory;
        }
      });
      return updatedMemories;
    });
    setFetchedRecents((recents) => {
      const updatedRecents = recents.map((recent) => {
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
      return updatedRecents;
    });
    try {
      const request = await fetch(BACKEND_URL + "/post/save/", {
        method: "POST",
        body: JSON.stringify({
          postID: _id,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      return response.status;
    } catch (error) {}
  };

  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const deleteModalCloseHandler = () => {
    setIsDeleteModalShown(false);
    setToDelete(null);
  };

  const deletePostHandler = async () => {
    try {
      const request = await fetch(BACKEND_URL + "/post/delete/", {
        method: "POST",
        body: JSON.stringify({
          postID: toDelete._id,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "POST_DELETED") {
        setFetchedMemories(
          fetchedMemories.filter((memory) => memory._id !== toDelete._id)
        );
        setFetchedThoughts(
          fetchedThoughts.filter((thought) => thought._id !== toDelete._id)
        );
        setFetchedRecents(
          fetchedRecents.filter((recent) => recent._id !== toDelete._id)
        );

        deleteModalCloseHandler();
      }

      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
  };

  const deleteButtonHandler = async (_id) => {
    setIsDeleteModalShown(true);
    const getPost = fetchedRecents.find((item) => item._id == _id);
    setToDelete(getPost);
  };

  const [isMomentShown, setIsMomentShown] = useState(false);
  const [currentMoment, setCurrentMoment] = useState({
    _id: "",
    caption: "",
    momentImage: "",
    userDP: "",
    userName: "",
    postedOn: "",
  });

  const openMomentHandler = (
    _id,
    caption,
    momentImage,
    userDP,
    userName,
    postedOn
  ) => {
    setCurrentMoment({
      _id: _id,
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
      _id: "",
      caption: "",
      momentImage: "",
      userDP: "",
      userName: "",
      postedOn: "",
    });
  };

  const removeMomentFromProfileHandler = async (momentID) => {
    // CHANGE LOGIC
    setFetchedMoments((moments) => {
      const updatedMoments = moments.filter(
        (moment) => moment._id !== momentID
      );
      return updatedMoments;
    });
    try {
      const request = await fetch(
        BACKEND_URL + "/profile/my/remove-moment-from-profile/" + momentID,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const response = await request.json();

      if (response.status === "MOMENT_REMOVED_FROM_PROFILE") {
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
  };

  return (
    <View style={styles.mainContainer}>
      <ConfirmationModal
        visible={isDeleteModalShown}
        closeModal={deleteModalCloseHandler}
        confirmButtonText="Delete"
        confirmButtonTextColor={Colors.error}
        confirmButtonHandler={deletePostHandler}
        modelFlex={0.85}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            flex: 1,
          }}
        >
          {toDelete !== null && (
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
                  textTransform: "capitalize",
                }}
              >
                Delete {toDelete.postType}
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
                Once a {toDelete.postType} is deleted, it cannot be reverted
                again. Verify the caption.
              </Text>
              <Text
                style={{
                  color: Colors.whiteDarker,
                  fontSize: 15,
                  fontWeight: "500",
                  marginTop: 19,
                  marginLeft: 4,
                  textAlign: "center",
                  maxHeight: 40,
                }}
              >
                {'" '}
                {toDelete.caption.length <= 29
                  ? toDelete.caption
                  : toDelete.caption.substring(0, 26) + "..."}
                {' "'}
              </Text>
            </View>
          )}
        </View>
      </ConfirmationModal>
      <View style={styles.innerContainer}>
        <FullMoment
          visible={isMomentShown}
          closeModal={closeMomentHandler}
          imageSize={windowWidthForStory}
          caption={currentMoment.caption}
          momentImage={currentMoment.momentImage}
          userDP={currentMoment.userDP}
          userName={currentMoment.userName}
          postedOn={currentMoment.postedOn}
          myProfile
          removeFromProfileHandler={() => {
            closeMomentHandler();
            removeMomentFromProfileHandler(currentMoment._id);
          }}
        />
        <View style={styles.upperControlsContainer}>
          <View style={styles.usernameContainer}>
            <Text style={styles.usernameText}>{userName}</Text>
          </View>
          <Pressable
            style={styles.controlsContainer}
            onPress={() => {
              navigation.navigate("settings");
            }}
          >
            <Ionicons name="settings-outline" size={25} color={Colors.white} />
          </Pressable>
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
          {isLoading && <LoadingProfileCard />}
          {!isLoading && (
            <View style={styles.profileDetailsContainerMain}>
              <View style={styles.profileDetailsContainer}>
                <View style={styles.dpFullnameBioContainer}>
                  <View style={styles.dpFullnameContainer}>
                    <View style={styles.dpContainer}>
                      <Image
                        source={{
                          uri: BACKEND_PROFILE_IMAGE_URL + profilePicture,
                        }}
                        style={styles.profileDP}
                      />
                    </View>
                    <View style={styles.fullnameContainer}>
                      <Text style={styles.fullName}>{fullName}</Text>
                      <Text style={styles.userNameInCard}>
                        @{userName} •{" "}
                        {accountPrivacy === true ? "private" : "public"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bioContainer}>
                    <Text style={styles.bio}>{bio}</Text>
                  </View>
                </View>
                <View style={styles.allCategoriesContainer}>
                  <Pressable
                    style={{
                      flex: 0.97,
                    }}
                  >
                    <Text style={styles.categoryName}>Thoughts</Text>
                    <Text style={styles.categoryValue}>
                      {profileNumbersData.thoughts}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text style={styles.categoryName}>Memories</Text>
                    <Text style={styles.categoryValue}>
                      {profileNumbersData.memories}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      flex: 1,
                    }}
                    onPress={() => {
                      navigation.navigate("followers-followings", {
                        userName: userName,
                        tabToOpen: "followers",
                      });
                    }}
                  >
                    <Text style={styles.categoryName}>Followers</Text>
                    <Text style={styles.categoryValue}>
                      {profileNumbersData.followers}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      flex: 1,
                    }}
                    onPress={() => {
                      navigation.navigate("followers-followings", {
                        userName: userName,
                        tabToOpen: "following",
                      });
                    }}
                  >
                    <Text style={styles.categoryName}>Following</Text>
                    <Text style={styles.categoryValue}>
                      {profileNumbersData.following}
                    </Text>
                  </Pressable>
                  {/* <View style={styles.shareButton}>
                    <Pressable>
                      <Feather name="share" size={20} color={Colors.white} />
                    </Pressable>
                  </View> */}
                </View>
              </View>
            </View>
          )}
          {/*  */}
          {isLoading && (
            <View style={{ flex: 1, marginTop: 13 }}>
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
              {/* <View
                style={{
                  borderColor: Colors.dark90,
                  borderBottomWidth: 2.5,
                  marginTop: 15,
                }}
              /> */}
            </View>
          )}
          {!isLoading && fetchedMoments.length > 0 && (
            <View style={{ flex: 1, marginTop: 16 }}>
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
                      profile
                      openMomentHandler={() =>
                        openMomentHandler(
                          item._id,
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
              {/* <View
                style={{
                  borderColor: Colors.dark90,
                  borderBottomWidth: 2.5,
                  marginTop: 15,
                }}
              /> */}
            </View>
          )}
          {/*  */}
          <View style={styles.postsAndMemoriesContainer}>
            <View style={styles.postsAndMemoriesTopBar}>
              <Pressable
                onPress={memoriesTabClickHandler}
                style={[
                  styles.postsAndMemoriesTopButton,
                  {
                    borderColor:
                      currentTab === "recent"
                        ? Colors.yellow200
                        : Colors.dark200,
                  },
                ]}
              >
                <Feather
                  name="activity"
                  size={18}
                  color={
                    currentTab === "recent" ? Colors.yellow200 : Colors.white
                  }
                />
                <Text
                  style={[
                    styles.postsAndMemoriesTopButtonText,
                    {
                      color:
                        currentTab === "recent"
                          ? Colors.yellow200
                          : Colors.white,
                    },
                  ]}
                >
                  Recent
                </Text>
              </Pressable>
              <Pressable
                onPress={thoughtsTabClickHandler}
                style={[
                  styles.postsAndMemoriesTopButton,
                  {
                    borderColor:
                      currentTab === "thoughts"
                        ? Colors.yellow200
                        : Colors.dark200,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="brain"
                  size={18}
                  color={
                    currentTab === "thoughts" ? Colors.yellow200 : Colors.white
                  }
                />
                <Text
                  style={[
                    styles.postsAndMemoriesTopButtonText,
                    {
                      color:
                        currentTab === "thoughts"
                          ? Colors.yellow200
                          : Colors.white,
                    },
                  ]}
                >
                  Thoughts
                </Text>
              </Pressable>
              <Pressable
                onPress={postsTabClickHandler}
                style={[
                  styles.postsAndMemoriesTopButton,
                  {
                    borderColor:
                      currentTab === "posts"
                        ? Colors.yellow200
                        : Colors.dark200,
                  },
                ]}
              >
                <MaterialIcons
                  name="view-carousel"
                  size={18}
                  color={
                    currentTab === "posts" ? Colors.yellow200 : Colors.white
                  }
                />
                <Text
                  style={[
                    styles.postsAndMemoriesTopButtonText,
                    {
                      color:
                        currentTab === "posts"
                          ? Colors.yellow200
                          : Colors.white,
                    },
                  ]}
                >
                  Memories
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.loadedDataContainer}>
            {currentTab === "recent" && (
              <View>
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

                {fetchedRecents.length > 0 &&
                  !isLoading &&
                  fetchedRecents.map((item) =>
                    item.postType === "thought" ? (
                      <Thought
                        key={item._id}
                        _id={item._id}
                        caption={item.caption}
                        userName={item.userName}
                        postedOn={item.postedOn}
                        userDP={"" + BACKEND_PROFILE_IMAGE_URL + profilePicture}
                        totalComments={item.comments.length}
                        thoughtType={"my-profile"}
                        likeButtonHandler={likeButtonHandler}
                        saveButtonHandler={saveButtonHandler}
                        deleteButtonHandler={deleteButtonHandler}
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
                        userDP={"" + BACKEND_PROFILE_IMAGE_URL + profilePicture}
                        memoryImage={
                          "" + BACKEND_MEMORIES_IMAGE_URL + item.memoryImage
                        }
                        comments={item.comments}
                        totalComments={item.comments.length}
                        memoryType={"my-profile"}
                        tags={item.tags}
                        likeButtonHandler={likeButtonHandler}
                        saveButtonHandler={saveButtonHandler}
                        deleteButtonHandler={deleteButtonHandler}
                        isLiked={item.isLiked}
                        isSaved={item.isSaved}
                        totalLikes={item.likes.length}
                        totalSaves={item.saves.length}
                      />
                    )
                  )}

                {!isLoading && fetchedRecents.length <= 0 && (
                  <View style={styles.emptyItemsInCategoryContainer}>
                    <View style={styles.emptyItemsInCategoryIcon}>
                      <Feather name="activity" size={22} color={Colors.grey} />
                    </View>
                    <Text style={styles.emptyItemsInCategoryText}>
                      No Recent Activity
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmall}>
                      When they do, it will be shown here.
                    </Text>
                  </View>
                )}
              </View>
            )}
            {currentTab === "thoughts" && (
              <View>
                {isLoading && (
                  <>
                    <LoadingThought />
                    <LoadingThought />
                    <LoadingThought />
                    <LoadingThought />
                    <LoadingThought />
                    <LoadingThought />
                    <LoadingThought />
                  </>
                )}
                {fetchedThoughts.length > 0 &&
                  !isLoading &&
                  fetchedThoughts.map((thought) => (
                    <Thought
                      key={thought._id}
                      _id={thought._id}
                      caption={thought.caption}
                      userName={thought.userName}
                      postedOn={thought.postedOn}
                      userDP={"" + BACKEND_PROFILE_IMAGE_URL + profilePicture}
                      totalComments={thought.comments.length}
                      thoughtType={"my-profile"}
                      likeButtonHandler={likeButtonHandler}
                      saveButtonHandler={saveButtonHandler}
                      deleteButtonHandler={deleteButtonHandler}
                      isLiked={thought.isLiked}
                      isSaved={thought.isSaved}
                      totalLikes={thought.likes.length}
                      totalSaves={thought.saves.length}
                    />
                  ))}
                {!isLoading && fetchedThoughts.length <= 0 && (
                  <View style={styles.emptyItemsInCategoryContainer}>
                    <View style={styles.emptyItemsInCategoryIcon}>
                      <MaterialCommunityIcons
                        name="brain"
                        size={22}
                        color={Colors.grey}
                      />
                    </View>
                    <Text style={styles.emptyItemsInCategoryText}>
                      No Thoughts Yet
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmall}>
                      When they do, it will be shown here.
                    </Text>
                  </View>
                )}
              </View>
            )}
            {currentTab === "posts" && (
              <>
                {isLoading && (
                  <View style={styles.postsWrapper}>
                    <View style={styles.singlePostItemLoading} />
                    <View style={styles.singlePostItemLoading} />
                    <View style={styles.singlePostItemLoading} />
                    <View style={styles.singlePostItemLoading} />
                    <View style={styles.singlePostItemLoading} />
                    <View style={styles.singlePostItemLoading} />
                    <View style={styles.singlePostItemLoading} />
                    <View style={styles.singlePostItemLoading} />
                    <View style={styles.singlePostItemLoading} />
                  </View>
                )}
                {fetchedMemories.length > 0 && !isLoading && (
                  <View style={styles.postsWrapper}>
                    {fetchedMemories.map((memory) => (
                      <Pressable
                        key={memory._id}
                        onPress={() =>
                          navigation.navigate("posts-page", {
                            usernameToFetch: memory.userName,
                            _id: memory._id,
                          })
                        }
                      >
                        <Image
                          key={memory._id}
                          _id={memory._id}
                          source={{
                            uri:
                              BACKEND_MEMORIES_IMAGE_URL + memory.memoryImage,
                          }}
                          style={styles.singlePostItem}
                        />
                      </Pressable>
                    ))}
                  </View>
                )}
                {!isLoading && fetchedMemories.length <= 0 && (
                  <View style={styles.emptyItemsInCategoryContainer}>
                    <View style={styles.emptyItemsInCategoryIcon}>
                      <MaterialIcons
                        name="view-carousel"
                        size={22}
                        color={Colors.grey}
                      />
                    </View>
                    <Text style={styles.emptyItemsInCategoryText}>
                      No Memories Yet
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmall}>
                      When they do, it will be shown here.
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

export default ProfileRoot;

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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  usernameContainer: {},
  controlsContainer: {
    paddingLeft: 12,
  },
  usernameText: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.white,
  },

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
  postsAndMemoriesContainer: {
    marginTop: 15,
    paddingTop: 25,
    paddingBottom: 22,
    backgroundColor: Colors.dark200,
  },
  loadedDataContainer: { paddingHorizontal: 12, paddingBottom: 18 },
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
    fontWeight: "500",
    color: Colors.white,
    fontSize: 13,
  },
  postsWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: -(gap / 2),
    marginHorizontal: -(gap / 2),
  },
  singlePostItem: {
    marginHorizontal: gap / 2,
    marginVertical: gap / 2,
    minWidth: childWidth,
    maxWidth: childWidth,
    minHeight: childWidth,
    maxHeight: childWidth,
    borderRadius: 9,
    resizeMode: "contain",
    backgroundColor: Colors.yellowTintSecondary,
  },

  singlePostItemLoading: {
    marginHorizontal: gap / 2,
    marginVertical: gap / 2,
    minWidth: childWidth,
    maxWidth: childWidth,
    minHeight: childWidth,
    maxHeight: childWidth,
    borderRadius: 9,
    resizeMode: "contain",
    backgroundColor: Colors.darkForLoading,
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
  ////
  // for

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

  deletePostUsernameCaption: {
    paddingLeft: 8,
    flex: 1,
  },
  deletePostContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    borderRadius: 9,
    padding: 9,
    borderWidth: 1.5,
    borderColor: Colors.dark95,
  },
  deletePostProfileImage: {
    height: 30,
    width: 30,
    borderRadius: 3 * 3,
    marginTop: 3,
  },
  deleteThoughtCaption: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "400",
    marginTop: 3,
  },
  deleteThoughtWarning: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
  },
  deletePostUsername: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "600",
  },
});
