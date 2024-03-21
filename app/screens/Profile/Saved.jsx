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
} from "@expo/vector-icons";
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
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MEMORIES_IMAGE_URL,
} from "@env";
import LoadingThought from "../../components/Loading/LoadingThought";
import BackButton from "../../components/BackButton";

const { width } = Dimensions.get("window");
const windowWidth = width - 24;
const gap = 12;
const itemPerRow = 3;
const totalGapSize = (itemPerRow - 1) * gap;
const childWidth = Math.floor((windowWidth - totalGapSize) / itemPerRow);

const Saved = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.authorization.token);

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  const [currentTab, setCurrentTab] = useState("thoughts");

  const thoughtsTabClickHandler = () => {
    setCurrentTab("thoughts");
  };
  const memoriesTabClickHandler = () => {
    setCurrentTab("memories");
  };

  const [fetchedThoughts, setFetchedThoughts] = useState([]);
  const [fetchedMemories, setFetchedMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onLoadHandlerWithLoading = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/settings/saved/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      console.log(response.status);

      if (response.status === "SAVED_FETCHED") {
        setFetchedMemories(response.data.fetchedMemories);
        setFetchedThoughts(response.data.fetchedThoughts);
      }

      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
    setIsLoading(false);
  };
  const onLoadHandler = async () => {
    try {
      const request = await fetch(BACKEND_URL + "/settings/saved/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      console.log(response.status);

      if (response.status === "SAVED_FETCHED") {
        setFetchedMemories(response.data.fetchedMemories);
        setFetchedThoughts(response.data.fetchedThoughts);
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

  const likeButtonHandler = async (_id) => {
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

      if (response.status === "LIKED") {
        onLoadHandler();
      }
      if (response.status === "UNLIKED") {
        onLoadHandler();
      }

      return response.status;
    } catch (error) {}
  };

  const saveButtonHandler = async (_id) => {
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

      if (response.status === "SAVED") {
        onLoadHandler();
      }
      if (response.status === "UNSAVED") {
        onLoadHandler();
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
          <Text style={styles.headingText}>Saved Posts</Text>
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
                onPress={memoriesTabClickHandler}
                style={[
                  styles.postsAndMemoriesTopButton,
                  {
                    borderColor:
                      currentTab === "memories"
                        ? Colors.yellow200
                        : Colors.dark200,
                  },
                ]}
              >
                <MaterialIcons
                  name="view-carousel"
                  size={18}
                  color={
                    currentTab === "memories" ? Colors.yellow200 : Colors.white
                  }
                />
                <Text
                  style={[
                    styles.postsAndMemoriesTopButtonText,
                    {
                      color:
                        currentTab === "memories"
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
          <View style={styles.scrollViewInnerContainer}>
            {currentTab === "memories" && (
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
                          navigation.navigate("saved-and-liked-memories-page", {
                            what: "saved",
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
                      No Memories Saved
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmall}>
                      When you do, it will be shown here.
                    </Text>
                  </View>
                )}
              </>
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
                      userDP={
                        "" +
                        BACKEND_PROFILE_IMAGE_URL +
                        thought.userName +
                        ".png"
                      }
                      totalComments={thought.comments.length}
                      thoughtType={"others-profile"}
                      likeButtonHandler={likeButtonHandler}
                      saveButtonHandler={saveButtonHandler}
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
                      No Thoughts Saved
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmall}>
                      When you do, it will be shown here.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Saved;

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
    backgroundColor: Colors.dark200,
  },
  headingText: {
    fontSize: 21,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 15,
  },

  scrollViewInnerContainer: {
    marginTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 18,
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

  ////

  postsAndMemoriesContainer: {
    paddingTop: 18,
    paddingBottom: 14,
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
    fontWeight: "500",
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
});
