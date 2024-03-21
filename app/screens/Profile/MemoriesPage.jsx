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
  FlatList,
} from "react-native";
import Colors from "../../Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import ProfileButtons from "../../components/buttons/ProfileButtons";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
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
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingMemory from "../../components/Loading/LoadingMemory";
import BackButton from "../../components/BackButton";

const { width, height } = Dimensions.get("window");
const imageSize = width - 24;

const MemoriesPage = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const flatListRef = useRef();

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  const scrollToPos = (id) => {
    const index = fetchedMemories.findIndex((item) => item._id === id);
    console.log(index, id);
    if (index !== -1) {
      flatListRef.current.scrollToIndex({ index });
    }
  };

  const [fetchedMemories, setFetchedMemories] = useState([]);
  const [whosMemories, setWhosMemories] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const userToken = useSelector((state) => state.authorization.token);

  const onLoadHandlerWithLoading = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/profile/memories/" + route.params.usernameToFetch,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const response = await request.json();

      if (response.status === "MEMORIES_FETCHED") {
        setFetchedMemories(response.data.fetchedMemories);
        setWhosMemories(response.data.whosMemories);
        setUserProfilePicture(response.data.userProfilePicture);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onLoadHandler = async () => {
    try {
      const request = await fetch(
        BACKEND_URL + "/profile/memories/" + route.params.usernameToFetch,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const response = await request.json();

      if (response.status === "MEMORIES_FETCHED") {
        setFetchedMemories(response.data.fetchedMemories);
        setWhosMemories(response.data.whosMemories);
        setUserProfilePicture(response.data.userProfilePicture);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {
      console.log(error);
    }
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

      console.log(response.status);
      if (response.status === "POST_DELETED") {
        setFetchedMemories(
          fetchedMemories.filter((memory) => memory._id !== toDelete._id)
        );
        deleteModalCloseHandler();
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
  };

  const deleteButtonHandler = async (_id) => {
    setIsDeleteModalShown(true);
    const getPost = fetchedMemories.find((item) => item._id == _id);
    setToDelete(getPost);
  };

  return (
    <View style={styles.mainContainer}>
      <ConfirmationModal
        visible={isDeleteModalShown}
        closeModal={deleteModalCloseHandler}
        confirmButtonText="Delete"
        confirmButtonTextColor={Colors.error}
        confirmButtonHandler={deletePostHandler}
        modelFlex={0.8}
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
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: "600",
                  textTransform: "capitalize",
                  marginBottom: 20,
                }}
              >
                Delete {toDelete.postType}
              </Text>
              <View style={styles.deletePostContainer}>
                <Image
                  style={styles.deletePostProfileImage}
                  source={{
                    uri: BACKEND_PROFILE_IMAGE_URL + userProfilePicture,
                  }}
                />
                <View style={styles.deletePostUsernameCaption}>
                  <Text style={styles.deletePostUsername}>
                    {toDelete.userName}
                  </Text>
                  <Text style={styles.deleteThoughtCaption}>
                    {toDelete.caption.length <= 59
                      ? toDelete.caption
                      : toDelete.caption.substring(0, 54) + "....."}
                  </Text>
                </View>
              </View>
              <Text style={styles.deleteThoughtWarning}>
                Once a {toDelete.postType} is deleted, it cannot be reverted
                again. Verify the caption.
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
          <View style={{ marginTop: 6 }}>
            <Text style={styles.postsOfUsername}>
              {route.params.usernameToFetch}
            </Text>
            <Text style={styles.headingText}>Memories</Text>
          </View>
        </View>

        <View style={styles.scrollViewInnerContainer}>
          {isLoading && (
            <ScrollView
              scrollEnabled={true}
              bounces={true}
              showsVerticalScrollIndicator={false}
            >
              <LoadingMemory imageSize={imageSize} />
              <LoadingMemory imageSize={imageSize} />
              <LoadingMemory imageSize={imageSize} />
              <LoadingMemory imageSize={imageSize} />
            </ScrollView>
          )}

          {fetchedMemories.length > 0 && !isLoading && (
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={onLoadHandlerWithLoading}
                />
              }
              data={fetchedMemories}
              ref={flatListRef}
              renderItem={(memory) => (
                <Post
                  imageSize={imageSize}
                  key={memory.item._id}
                  _id={memory.item._id}
                  memoryCaption={memory.item.caption}
                  userName={memory.item.userName}
                  postedOn={memory.item.postedOn}
                  userDP={"" + BACKEND_PROFILE_IMAGE_URL + userProfilePicture}
                  memoryImage={
                    "" + BACKEND_MEMORIES_IMAGE_URL + memory.item.memoryImage
                  }
                  comments={memory.item.comments}
                  totalComments={memory.item.comments.length}
                  memoryType={whosMemories}
                  tags={memory.item.tags}
                  likeButtonHandler={likeButtonHandler}
                  saveButtonHandler={saveButtonHandler}
                  deleteButtonHandler={deleteButtonHandler}
                  isLiked={memory.item.isLiked}
                  isSaved={memory.item.isSaved}
                  totalLikes={memory.item.likes.length}
                  totalSaves={memory.item.saves.length}
                />
              )}
              onLayout={() => {
                if (fetchedMemories.length > 0) {
                  scrollToPos(route.params._id);
                }
              }}
              getItemLayout={(data, index) => ({
                length: imageSize + 158 + fetchedMemories.length,
                offset: (imageSize + 158 + fetchedMemories.length) * index,
                index,
              })}
              ListFooterComponent={<View style={{ paddingBottom: 70 }}></View>}
            />
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
                When they have, it will be shown here.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MemoriesPage;

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
    marginBottom: 10,
  },
  postsOfUsername: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 15,
    textTransform: "uppercase",
  },
  headingText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 15,
  },

  scrollViewInnerContainer: {
    paddingTop: 6,
    paddingHorizontal: 12,
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
    borderWidth: 1,
    borderColor: Colors.yellowTint,
  },
  deletePostProfileImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
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
    marginLeft: 4,
  },
  deletePostUsername: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "600",
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
});
