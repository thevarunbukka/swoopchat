import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import Colors from "../Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  EvilIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Children, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ProfileButtons from "./buttons/ProfileButtons";

const FullMoment = ({
  visible,
  closeModal,
  caption,
  imageSize,
  momentImage,
  userDP,
  userName,
  postedOn,
  history,
  addToProfileHandler,
  removeFromProfileHandler,
  deleteMomentHandler,
  myProfile,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <Pressable onPress={closeModal} style={[styles.modalCloseContainer]}>
        <View style={[styles.modalMainContainerMain, { flex: 1 }]}>
          <View style={styles.modalMainContainer}>
            <View style={styles.modalInnerContainer}>
              <View style={styles.modelInnerAlignmentContainer}>
                <View style={styles.childrenContainer}>
                  <View style={styles.outerContainer}>
                    <View>
                      <Image
                        source={{ uri: momentImage }}
                        style={[
                          styles.image,
                          {
                            minWidth: imageSize,
                            maxWidth: imageSize,
                            minHeight: imageSize,
                            maxHeight: imageSize,
                          },
                        ]}
                      />
                      <View style={styles.dataContainer}>
                        <View style={styles.usernameAndDPContainer}>
                          <View style={styles.userData}>
                            <Image
                              source={{ uri: userDP }}
                              style={styles.userDP}
                            />
                            <View style={styles.fullNameUsernameContainer}>
                              <Text style={styles.fullName}>{userName}</Text>
                              <Text style={styles.postedOn}>{postedOn}</Text>
                            </View>
                          </View>
                        </View>
                        {caption !== "" && (
                          <View style={styles.captionContainer}>
                            {caption.length > 71 && (
                              <View>
                                <Text style={styles.captionText}>
                                  {isCaptionExpanded
                                    ? caption
                                    : caption.substring(0, 71)}
                                  {!isCaptionExpanded && (
                                    <Text
                                      style={styles.captionTextExpandButton}
                                      onPress={expandCaptionClickHandler}
                                    >
                                      {isCaptionExpanded
                                        ? " show less"
                                        : " ...show more"}
                                    </Text>
                                  )}
                                </Text>
                              </View>
                            )}
                            {caption.length <= 71 && (
                              <View>
                                <Text style={styles.captionText}>
                                  {caption}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  {/*  */}
                </View>
              </View>
              {!history && <View style={{ padding: 15 }}></View>}
              {history && (
                <>
                  <View
                    style={[
                      styles.confirmButtonMainContainerTop,
                      // { marginBottom: Platform.OS === "ios" ? 33 : 13 },
                    ]}
                  >
                    <Pressable
                      style={styles.confirmButtonContainer}
                      onPress={addToProfileHandler}
                    >
                      <Text style={styles.confirmButtonText}>
                        Add To Profile
                      </Text>
                    </Pressable>
                  </View>
                  <View
                    style={[
                      styles.confirmButtonMainContainerBottom,
                      { marginBottom: Platform.OS === "ios" ? 33 : 13 },
                    ]}
                  >
                    <Pressable
                      style={styles.confirmButtonContainer}
                      onPress={deleteMomentHandler}
                    >
                      <Text
                        style={[
                          styles.confirmButtonText,
                          { color: Colors.error },
                        ]}
                      >
                        Delete Moment
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
              {myProfile && (
                <View
                  style={[
                    styles.confirmButtonMainContainerFull,
                    { marginBottom: Platform.OS === "ios" ? 33 : 13 },
                  ]}
                >
                  <Pressable
                    style={styles.confirmButtonContainer}
                    onPress={removeFromProfileHandler}
                  >
                    <Text
                      style={[
                        styles.confirmButtonText,
                        { color: Colors.error },
                      ]}
                    >
                      Remove from Profile
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default FullMoment;

const styles = StyleSheet.create({
  modalMainContainerMain: {
    // backgroundColor: Colors.dark200,
    // borderColor: Colors.dark40,
  },

  modalMainContainer: {
    borderRadius: 17,
    // marginBottom: 9,
    flex: 1,
  },
  modalInnerContainer: {
    flex: 1,
    backgroundColor: "rgba(70, 70, 70, 0.91)",
  },
  modalHeadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
  },

  modalCloseContainer: {
    flex: 1,
  },
  childrenContainer: {
    alignItems: "center",
  },
  modelInnerAlignmentContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  ///
  outerContainer: {
    backgroundColor: Colors.dark100,
    borderRadius: 17,
  },
  image: {
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    resizeMode: "contain",
    backgroundColor: Colors.darkForLoading,
  },
  dataContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: Colors.dark90,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  usernameAndDPContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // flex: 1,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 4,
  },
  userDP: {
    height: 37,
    width: 37,
    borderRadius: 3.7 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  userData: {
    flexDirection: "row",
    alignItems: "center",
  },
  captionContainer: {
    marginTop: 8,
  },
  captionTextUsername: {
    fontWeight: "700",
    fontSize: 17,
    color: Colors.white,
    paddingLeft: 6,
    marginBottom: 1,
  },
  captionText: {
    justifyContent: "flex-start",
    alignItems: "center",
    color: Colors.whiteDarker,
    fontSize: 15,
    fontWeight: "400",
  },
  postedOn: {
    color: Colors.grey,
    fontSize: 13,
    fontWeight: "500",
  },
  captionTextExpandButton: {
    color: Colors.whiteDarker,
    fontSize: 14,
    fontWeight: "500",
  },
  fullNameUsernameContainer: {
    marginLeft: 9,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
  confirmButtonMainContainerFull: {
    borderRadius: 17,
    marginHorizontal: 19,
    backgroundColor: Colors.dark100,
    borderColor: Colors.dark95,
    borderWidth: 1,
  },

  confirmButtonMainContainerTop: {
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    marginHorizontal: 19,
    backgroundColor: Colors.dark100,
    borderColor: Colors.dark95,
    borderWidth: 1,
  },
  confirmButtonMainContainerBottom: {
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    marginHorizontal: 19,
    backgroundColor: Colors.dark100,
    borderColor: Colors.dark95,
    borderWidth: 1,
  },
  confirmButtonContainer: { paddingVertical: 15, paddingHorizontal: 19 },
  confirmButtonText: {
    color: Colors.whiteDarker,
    fontSize: 15,
    fontWeight: "600",
  },
});
