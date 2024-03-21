import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Colors from "../Colors";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL, BACKEND_PROFILE_IMAGE_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { loadUserAction, removeUserAction } from "../store/authorization-slice";
import LoadingSearch from "../components/Loading/LoadingSearch";

const { height, width } = Dimensions.get("window");

let imageWidth = width - 34;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const People = ({
  tagPersonHandler,
  profilePicture,
  userName,
  fullName,
  closeModal,
}) => {
  return (
    <Pressable
      style={styles.searchResultOuterContainer}
      onPress={() => {
        tagPersonHandler(userName);
        closeModal();
      }}
    >
      <View style={styles.searchResultInnerContainer}>
        <View style={styles.dpContainer}>
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + profilePicture }}
            style={styles.dp}
          />
        </View>
        <View style={styles.searchResultDataContainer}>
          <View style={styles.searchResultDataLeftContainer}>
            <Text style={styles.searchResultUserName}>{userName}</Text>
            <Text style={styles.searchResultFullName}>{fullName}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const TagPeopleModal = ({
  visible,
  closeModal,
  loadedPeople,
  tagPersonHandler,
  isLoading,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <Pressable
        onPress={closeModal}
        style={[styles.modalCloseContainer]}
      ></Pressable>
      <KeyboardAvoidingView
        style={styles.modalMainContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalInnerContainer}>
          <View style={styles.modalUpperControlsContainer}>
            <Text style={styles.modalHeadingText}>Tag People</Text>
          </View>
          <View
            style={styles.modalPeopleContainer}
            // showsVerticalScrollIndicator={false}
            // scrollEnabled={true}
            // bounces={true}
          >
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
              </>
            )}
            {!isLoading && (
              <FlatList
                style={{ flex: 1, paddingTop: 18 }}
                scrollEnabled={true}
                bounces={true}
                showsVerticalScrollIndicator={false}
                data={loadedPeople}
                renderItem={(people) => {
                  return (
                    <People
                      key={people.item._id}
                      userName={people.item._id}
                      fullName={
                        people.item.firstName + " " + people.item.lastName
                      }
                      profilePicture={people.item.profilePicture}
                      tagPersonHandler={tagPersonHandler}
                      closeModal={closeModal}
                    />
                  );
                }}
              />
            )}
            {!isLoading && loadedPeople.length <= 0 && (
              <View style={styles.emptyItemsInCategoryContainer}>
                <View style={styles.emptyItemsInCategoryIcon}>
                  <Ionicons
                    name="people-outline"
                    size={22}
                    color={Colors.grey}
                  />
                </View>
                <Text style={styles.emptyItemsInCategoryText}>No People</Text>
                <Text style={styles.emptyItemsInCategoryTextSmall}>
                  You can tag people in your followers and followings.
                </Text>
              </View>
            )}
            <View style={{ padding: 16 }}></View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const New = ({ visible, closeModal }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authorization.token);
  useEffect(() => {
    dispatch(loadUserAction());
  }, []);
  const navigation = useNavigation();
  const date = new Date();
  let fullDate =
    date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

  const fullName = useSelector((state) => state.authorization.fullName);
  const userName = useSelector((state) => state.authorization.userName);
  const profilePicture = useSelector(
    (state) => state.authorization.profilePicture
  );

  const [memoryPicture, setMemoryPicture] = useState(null);
  const [postType, setPostType] = useState("thought");
  const [caption, setCaption] = useState("");
  const [taggedPeople, setTaggedPeople] = useState([]);
  const [loadedPeople, setLoadedPeople] = useState([]);

  const chooseMemoryPictureHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setMemoryPicture(result.assets[0].uri);
      setPostType("memory");
    }
  };

  const removeMemoryPictureHandler = () => {
    setMemoryPicture(null);
    setPostType("thought");
  };

  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (counter == 1) {
        setMemoryPicture(null);
        setPostType("thought");
        setCaption("");
        setTaggedPeople([]);
      }
      if (counter == 0) {
        closeModal();
        clearInterval(interval);
      } else {
        setCounter((prev) => prev - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  const [isLoadingForShare, setIsLoadingForShare] = useState(false);

  const shareButtonClickHandler = async () => {
    if (caption.length > 0) {
      setIsLoadingForShare(true);
      if (postType === "thought") {
        try {
          let postID = Math.floor(
            Math.random() * 100000000000000 + 1
          ).toString();

          const request = await fetch(BACKEND_URL + "/post/thought/", {
            method: "POST",
            body: JSON.stringify({
              postID: postID,
              postType: postType,
              caption: caption,
              taggedPeople: taggedPeople,
            }),
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + token,
            },
          });

          const response = await request.json();

          if (response.status === "THOUGHT_CREATED") {
            setCounter(2);
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
      }
      if (postType === "memory") {
        try {
          const formData = new FormData();
          let postID = Math.floor(
            Math.random() * 100000000000000 + 1
          ).toString();

          formData.append("memoryImage", {
            name: postID + ".png",
            type: "image/png",
            uri: memoryPicture,
          });
          formData.append("postID", postID);
          formData.append("postType", postType);
          formData.append("caption", caption);
          formData.append("taggedPeople", JSON.stringify(taggedPeople));

          const request = await fetch(BACKEND_URL + "/post/memory/", {
            method: "POST",
            body: formData,
            headers: {
              "content-type": "multipart/form-data",
              Authorization: "Bearer " + token,
            },
          });

          const response = await request.json();

          if (response.status === "MEMORY_CREATED") {
            setCounter(2);
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
      }
      setIsLoadingForShare(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const onLoadHandler = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/post/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();

      if (response.status === "PEOPLE_FETCHED") {
        setLoadedPeople(response.data.loadedPeople);
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
    onLoadHandler();
  }, []);

  const TagItem = ({ taggedUserName, unTagPersonHandler }) => {
    return (
      <View style={styles.tagItem}>
        <Text style={styles.tagItemText}>{taggedUserName}</Text>
        <Pressable onPress={() => unTagPersonHandler(taggedUserName)}>
          <MaterialIcons name="cancel" size={16} color={Colors.white} />
        </Pressable>
      </View>
    );
  };

  const [isTagPeopleModelShown, setIsTagPeopleModelShown] = useState(false);
  const tagPeopleModelToggleClickHandler = () => {
    setIsTagPeopleModelShown((prev) => !prev);
  };

  const tagPersonHandler = (userName) => {
    const checkIfAlreadyExists = taggedPeople.find(
      (person) => person === userName
    );
    if (!checkIfAlreadyExists) {
      setTaggedPeople([...taggedPeople, userName]);
    }
  };
  const unTagPersonHandler = (userName) => {
    setTaggedPeople(taggedPeople.filter((person) => person !== userName));
  };

  const cancelButtonClickHandler = () => {
    closeModal();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <Pressable
        onPress={closeModal}
        style={styles.mainModalCloseContainer}
      ></Pressable>

      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.mainContainer}>
          <TagPeopleModal
            visible={isTagPeopleModelShown}
            closeModal={tagPeopleModelToggleClickHandler}
            loadedPeople={loadedPeople}
            tagPersonHandler={tagPersonHandler}
            isLoading={isLoading}
          />
          {counter === 0 && (
            <View style={styles.innerContainer}>
              <View style={styles.upperControlsContainer}>
                <Text style={styles.headingText}>Posting {postType}</Text>
                <Pressable
                  style={styles.cancelButton}
                  onPress={cancelButtonClickHandler}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
              <ScrollView
                scrollEnabled={true}
                bounces={false}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.scrollViewInnerContainer}>
                  <View style={styles.mainUpperControls}>
                    <View style={styles.innerUpperControls}>
                      <Image
                        source={{
                          uri: BACKEND_PROFILE_IMAGE_URL + profilePicture,
                        }}
                        style={styles.upperDP}
                      />
                      <View style={styles.fullNameContainer}>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.postedOn}>{fullDate}</Text>
                      </View>
                    </View>
                  </View>

                  {memoryPicture !== null && (
                    <View style={styles.allImagesContainer}>
                      <Image
                        source={{ uri: memoryPicture }}
                        style={styles.bigImage}
                      />
                      <Pressable
                        onPress={removeMemoryPictureHandler}
                        style={styles.clearImageButton}
                      >
                        <Feather name="x" size={23} color={Colors.white} />
                      </Pressable>
                    </View>
                  )}

                  {taggedPeople.length > 0 && (
                    <View style={styles.tagggedPeopleContainer}>
                      {taggedPeople.map((person) => (
                        <TagItem
                          key={person}
                          taggedUserName={person}
                          unTagPersonHandler={unTagPersonHandler}
                        />
                      ))}
                    </View>
                  )}
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                  >
                    <TextInput
                      style={styles.textBox}
                      multiline={true}
                      placeholder="What's Happening ?"
                      placeholderTextColor={Colors.grey}
                      value={caption}
                      onChangeText={(txt) => {
                        if (txt.trim() !== "") {
                          setCaption(txt);
                        } else {
                          setCaption("");
                        }
                      }}
                    />
                  </KeyboardAvoidingView>
                  <View style={{ padding: 40 }}></View>
                </View>
              </ScrollView>
              <View style={styles.bottomControlsConatiner}>
                <View style={styles.bottomControlsInnerLeftConatiner}>
                  <Pressable
                    style={styles.tagPeopleButton}
                    onPress={() => {
                      onLoadHandler();
                      tagPeopleModelToggleClickHandler();
                    }}
                  >
                    <Feather name="at-sign" size={25} color={Colors.white} />
                  </Pressable>

                  {memoryPicture === null && (
                    <Pressable
                      onPress={chooseMemoryPictureHandler}
                      style={styles.tagPeopleButton}
                    >
                      <Feather name="image" size={25} color={Colors.white} />
                    </Pressable>
                  )}

                  {/* {memoryPicture !== null && (
                    <Pressable
                      onPress={removeMemoryPictureHandler}
                      style={styles.tagPeopleButton}
                    >
                      <Feather name="image" size={25} color={Colors.error} />
                    </Pressable>
                  )} */}
                </View>
                <View style={styles.bottomControlsInnerRightConatiner}>
                  {caption.length > 0 && !isLoadingForShare && (
                    <Pressable
                      style={styles.shareButton}
                      onPress={shareButtonClickHandler}
                    >
                      <Text style={styles.shareButtonText}>Share</Text>
                    </Pressable>
                  )}
                  {caption.length <= 0 && !isLoadingForShare && (
                    <Pressable style={styles.shareButtonDisabled}>
                      <Text style={styles.shareButtonDisabledText}>Share</Text>
                    </Pressable>
                  )}
                  {isLoadingForShare && (
                    <View style={styles.shareButton}>
                      <ActivityIndicator
                        size={"small"}
                        color={Colors.dark200}
                        style={{ paddingHorizontal: 13 }}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
          {counter > 0 && (
            <View style={styles.innerContainer}>
              <View style={styles.postedContainer}>
                <View style={styles.tickContainer}>
                  <MaterialIcons name="done" size={35} color={Colors.dark200} />
                </View>
                <Text style={styles.tickText}>{postType} Shared</Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default New;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark98,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    // marginHorizontal: 9,
  },
  innerContainer: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: Colors.dark98,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },
  upperControlsContainer: {
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 11,
    borderBottomWidth: 2,
    borderBottomColor: Colors.dark90,
    marginTop: 3,
  },
  scrollViewInnerContainer: {
    marginTop: 11,
    paddingHorizontal: 12,
    paddingBottom: 18,
  },

  cancelButton: {
    marginRight: 4,
    paddingVertical: 6,
    textAlign: "center",
  },
  cancelButtonText: {
    color: Colors.yellow200,
    fontSize: 16,
    fontWeight: "600",
  },
  shareButton: {
    borderRadius: 13,
    backgroundColor: Colors.yellow200,
    paddingHorizontal: 21,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.messageRecieved,
  },
  shareButtonText: {
    color: Colors.dark200,
    fontSize: 15,
    fontWeight: "700",
  },

  shareButtonDisabled: {
    borderRadius: 13,
    backgroundColor: Colors.dark40,
    paddingHorizontal: 22,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonDisabledText: {
    color: Colors.whiteDarker,
    fontSize: 15,
    fontWeight: "700",
  },

  upperDP: {
    width: 43,
    height: 43,
    backgroundColor: Colors.darkForLoading,
    borderRadius: 4.3 * 3,
  },
  textBox: {
    marginTop: 5,
    paddingHorizontal: 7,
    color: Colors.whiteDarker,
    fontSize: 16,
    minHeight: height / 5,

    textAlignVertical: "top",
  },
  headingText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
    textTransform: "capitalize",
    marginLeft: 2,
  },
  headingTextType: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.yellow200,
    textTransform: "capitalize",
  },

  mainUpperControls: {
    paddingHorizontal: 6,
    marginBottom: 8,
    marginTop: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerUpperControls: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fullNameContainer: {
    marginLeft: 9,
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.white,
    textTransform: "lowercase",
  },
  postedOn: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.grey,
    textTransform: "capitalize",
  },

  allImagesContainer: {
    paddingHorizontal: 5,
    marginTop: 11,
    marginBottom: 8,
  },
  bigImage: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 13,
    flex: 1,
    backgroundColor: Colors.darkForLoading,
    resizeMode: "contain",
  },
  bottomControlsConatiner: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 14,
    borderTopWidth: 2,
    paddingVertical: 10,

    borderColor: Colors.dark95,
  },

  bottomControlsInnerLeftConatiner: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bottomControlsInnerRightConatiner: {
    marginRight: 8,
  },

  fullDate: {
    fontSize: 14,
    color: Colors.grey,
    fontWeight: "400",
  },
  fullDateOtherConatinerText: {
    fontSize: 14,
    color: Colors.grey,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  tagItem: {
    borderColor: Colors.dark90,
    backgroundColor: Colors.dark100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 9,
    borderWidth: 1.5,
    // flexGrow: 1,
    marginBottom: 6,
    marginRight: 6,
  },
  tagItemText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
    marginRight: 9,
  },
  tagsText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
    marginRight: 9,
  },

  tagPeopleButton: {
    alignItems: "center",
    flexDirection: "row",
    // paddingVertical: 6,
    // paddingHorizontal: 9,
    marginLeft: 5,
    marginRight: 17,
  },

  tagggedPeopleContainer: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 6,
    marginHorizontal: 5,
  },

  //
  tickContainer: {
    backgroundColor: Colors.green,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    width: 45,
    borderRadius: 45,
  },
  postedContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.9,
  },
  tickText: {
    marginTop: 13,
    color: Colors.white,
    fontSize: 19,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  mainModalCloseContainer: {
    flex: 0.17,
  },

  // modal
  modalCloseContainer: {
    flex: 1,
  },
  modalMainContainer: {
    flex: 2.5,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },

  modalInnerContainer: {
    flex: 1,
    backgroundColor: Colors.dark200,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },
  modalUpperControlsContainer: {
    paddingVertical: 14,
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.dark100,
  },
  modalHeadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
  },
  modalPeopleContainer: {
    marginHorizontal: 11,
    flex: 1,
  },

  // //

  dpContainer: {
    marginRight: 5,
  },
  dp: {
    height: 37,
    width: 37,
    borderRadius: 3.7 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  searchResultOuterContainer: {
    borderWidth: 1.5,
    borderColor: Colors.dark90,
    backgroundColor: Colors.dark100,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
    marginBottom: 8,
  },
  searchResultInnerContainer: { flexDirection: "row", alignItems: "center" },
  searchResultUserName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.white,
    marginBottom: 1,
  },
  searchResultFullName: {
    fontSize: 13,
    fontWeight: "300",
    color: Colors.white,
    marginRight: 1,
  },
  searchResultDataContainer: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  searchResultDataLeftContainer: {
    flex: 9,
    alignItems: "flex-start",
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
  clearImageButton: {
    margin: 5,
    position: "absolute",
    top: 3,
    right: 7,
    width: 35,
    height: 35,
    backgroundColor: Colors.dark100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
