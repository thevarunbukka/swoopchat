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
import Colors from "../../Colors";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL, BACKEND_PROFILE_IMAGE_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import {
  loadUserAction,
  removeUserAction,
} from "../../store/authorization-slice";

const { height, width } = Dimensions.get("window");

let imageWidth = width - 34;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ShareMoment = ({ visible, closeModal, momentImageFromRoot }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authorization.token);
  useEffect(() => {
    dispatch(loadUserAction());
  }, []);
  const navigation = useNavigation();

  const date = new Date();

  function formatAMPM(cdate) {
    var hours = cdate.getHours();
    var minutes = cdate.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  const time = formatAMPM(new Date());

  let fullDate =
    time +
    ", " +
    date.getDate() +
    " " +
    months[date.getMonth()] +
    " " +
    date.getFullYear();

  const fullName = useSelector((state) => state.authorization.fullName);
  const userName = useSelector((state) => state.authorization.userName);
  const profilePicture = useSelector(
    (state) => state.authorization.profilePicture
  );

  const [momentPicture, setMomentPicture] = useState(momentImageFromRoot);
  const [caption, setCaption] = useState("");

  const chooseMemoryPictureHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setMomentPicture(result.assets[0].uri);
    }
  };

  const removeMemoryPictureHandler = () => {
    // setMomentPicture(null);
    setIsCaptionEnabled(false);
    chooseMemoryPictureHandler();
  };

  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (counter == 1) {
        setMomentPicture(null);
        setCaption("");
        closeModal();
      }
      if (counter == 0) {
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
    setIsLoadingForShare(true);
    try {
      const formData = new FormData();
      let momentID = Math.floor(Math.random() * 100000000000000 + 1).toString();

      formData.append("momentImage", {
        name: momentID + ".png",
        type: "image/png",
        uri: momentPicture,
      });
      formData.append("momentID", momentID);
      if (isCaptionEnabled) {
        formData.append("caption", caption);
      } else {
        formData.append("caption", "");
      }
      formData.append("fullDate", fullDate);

      const request = await fetch(BACKEND_URL + "/activity/share-moment/", {
        method: "POST",
        body: formData,
        headers: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();

      if (response.status === "MOMENT_CREATED") {
        setCounter(2);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {}
    setIsLoadingForShare(false);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isCaptionEnabled, setIsCaptionEnabled] = useState(false);
  const enableCaptionHandler = () => setIsCaptionEnabled(true);
  const disableCaptionHandler = () => setIsCaptionEnabled(false);

  const cancelButtonClickHandler = () => {
    closeModal();
    setMomentPicture(null);
    setIsCaptionEnabled(false);
    setCaption("");
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
          {counter === 0 && (
            <View style={styles.innerContainer}>
              <View style={styles.upperControlsContainer}>
                <Text style={styles.headingText}>Posting Moment</Text>
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
                  {momentPicture !== null && (
                    <View style={styles.allImagesContainer}>
                      <Image
                        source={{ uri: momentPicture }}
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

                  {momentPicture !== null && (
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
                  )}

                  {isCaptionEnabled && (
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
                  )}
                  <View style={{ padding: 40 }}></View>
                </View>
              </ScrollView>
              <View style={styles.bottomControlsConatiner}>
                <View style={styles.bottomControlsInnerLeftConatiner}>
                  {momentPicture !== null && !isCaptionEnabled && (
                    <Pressable
                      onPress={enableCaptionHandler}
                      style={styles.tagPeopleButton}
                    >
                      <Ionicons name="ios-text" size={24} color={Colors.grey} />
                    </Pressable>
                  )}
                  {momentPicture !== null && isCaptionEnabled && (
                    <Pressable
                      onPress={disableCaptionHandler}
                      style={styles.tagPeopleButton}
                    >
                      <Ionicons
                        name="ios-text"
                        size={24}
                        color={Colors.white}
                      />
                    </Pressable>
                  )}
                </View>
                <View style={styles.bottomControlsInnerRightConatiner}>
                  {/* is enabled, if yes then check the length(>0 == true, <0 false)
                  if enabled and no length then disabled button, else enabled button
                 if not enabled then enabled button */}

                  {!isLoadingForShare &&
                    (momentPicture !== null &&
                    (isCaptionEnabled
                      ? caption.length > 0
                        ? true
                        : false
                      : true) ? (
                      <Pressable
                        style={styles.shareButton}
                        onPress={shareButtonClickHandler}
                      >
                        <Text style={styles.shareButtonText}>Share</Text>
                      </Pressable>
                    ) : (
                      <Pressable style={styles.shareButtonDisabled}>
                        <Text style={styles.shareButtonDisabledText}>
                          Share
                        </Text>
                      </Pressable>
                    ))}

                  {isLoadingForShare && (
                    <Pressable style={styles.shareButton}>
                      <ActivityIndicator
                        size={"small"}
                        color={Colors.dark200}
                        style={{ paddingHorizontal: 13 }}
                      />
                    </Pressable>
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
                <Text style={styles.tickText}>Moment Shared</Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ShareMoment;

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
    borderRadius: 4.3 * 3,
    backgroundColor: Colors.darkForLoading,
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
    marginTop: 10,
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

  addMomentImageButton: {
    alignItems: "center",
    flexDirection: "column",
    marginTop: 11,
    marginLeft: 5,
    marginRight: 17,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: Colors.dark90,
    // borderWidth: 2,
    borderRadius: 6,
    minHeight: imageWidth,
    minWidth: imageWidth,
  },
  addMomentImageButtonText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
    color: Colors.dark30,
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
    // borderColor: Colors.dark95,
    // borderTopWidth: 3,
    // borderLeftWidth: 3,
    // borderRightWidth: 3,
    // borderBottomWidth: 0,
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
    paddingTop: 18,
    marginHorizontal: 11,
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
    paddingVertical: 6,
    borderRadius: 13,
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
  tagPeopleButton: {
    alignItems: "center",
    flexDirection: "row",
    // paddingVertical: 6,
    // paddingHorizontal: 9,
    marginLeft: 5,
    marginRight: 17,
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
