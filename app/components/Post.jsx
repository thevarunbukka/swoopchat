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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import Colors from "../Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MEMORIES_IMAGE_URL,
} from "@env";
import { useSelector } from "react-redux";

const CommentReplies = ({ _id, caption, byUserName }) => {
  return (
    <View style={[styles.commentContainer, { marginBottom: 20 }]}>
      <View style={styles.commentUserDetails}>
        <Image
          source={{ uri: BACKEND_PROFILE_IMAGE_URL + byUserName + ".png" }}
          style={styles.commenterDP}
        />
        <Text style={styles.commenterUsername}>{byUserName}</Text>
      </View>
      <Text style={styles.commentText}>{caption}</Text>
    </View>
  );
};

const Comment = ({
  _id,
  caption,
  byUserName,
  replies,
  replyToCommentClickHandler,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const showRepliesClickHandler = () => setShowReplies((prev) => !prev);
  return (
    <View style={styles.comment}>
      <View style={styles.commentContainer}>
        <View style={styles.commentUserDetails}>
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + byUserName + ".png" }}
            style={styles.commenterDP}
          />
          <Text style={styles.commenterUsername}>{byUserName}</Text>
        </View>
        <Text style={styles.commentText}>{caption}</Text>
        <Pressable
          onPress={() => replyToCommentClickHandler(_id, byUserName, caption)}
          style={styles.replyButton}
        >
          <Text style={styles.replyButtonText}>Reply</Text>
        </Pressable>
      </View>
      <View style={styles.showRepliesButtonContainer}>
        <Pressable
          onPress={showRepliesClickHandler}
          style={styles.showRepliesButton}
        >
          {replies.length > 0 && (
            <Text style={styles.showRepliesButtonText}>
              {showReplies ? "———  hide all replies" : "———  show all replies"}
            </Text>
          )}
        </Pressable>
      </View>
      {showReplies && replies.length > 0 && (
        <View style={styles.commentReplysContainer}>
          {replies.map((reply) => (
            <CommentReplies
              key={reply._id}
              _id={reply._id}
              caption={reply.caption}
              byUserName={reply.byUserName}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const CommentsModal = ({ visible, closeModal, comments, postID }) => {
  const [isReplyingToComment, setIsReplyingToComment] = useState(null);
  const replyToCommentClickHandler = (_id, byUserName, caption) =>
    setIsReplyingToComment({ _id, byUserName, caption });
  const replyToCommentCloseHandler = () => setIsReplyingToComment(null);

  const [allComments, setAllComments] = useState(comments);

  const [commentCaption, setCommentCaption] = useState("");

  const userToken = useSelector((state) => state.authorization.token);
  const userName = useSelector((state) => state.authorization.userName);

  const postCommentHandler = async () => {
    if (commentCaption.trim() !== "") {
      if (isReplyingToComment !== null) {
        try {
          const request = await fetch(BACKEND_URL + "/post/reply-to-comment/", {
            method: "POST",
            body: JSON.stringify({
              postID: postID,
              caption: commentCaption,
              commentID: isReplyingToComment._id,
            }),
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + userToken,
            },
          });

          const response = await request.json();

          if (response.status === "REPLIED_TO_COMMENT") {
            setAllComments(response.data.comments);
            setCommentCaption("");
            setIsReplyingToComment(null);
          }
          if (response.status === "NOT_AUTHENTICATED") {
            dispatch(removeUserAction());
          }
          if (response.status === "FAILED") {
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (isReplyingToComment === null) {
        try {
          const request = await fetch(BACKEND_URL + "/post/comment/", {
            method: "POST",
            body: JSON.stringify({
              postID: postID,
              caption: commentCaption,
            }),
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + userToken,
            },
          });
          const response = await request.json();
          if (response.status === "COMMENT_POSTED") {
            setAllComments(response.data.comments);
            setCommentCaption("");
          }
          if (response.status === "NOT_AUTHENTICATED") {
            dispatch(removeUserAction());
          }
          if (response.status === "FAILED") {
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      // onPress={closeModal}
    >
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
            <Text style={styles.modalHeadingText}>Comments</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            bounces={true}
          >
            {/* <View style={styles.commentOnWhatContainer}>
              <Image
                style={styles.commentOnWhatImage}
                source={require("../assets/images/dummy_image.png")}
              />
              <Text style={styles.commentOnWhatCaption}>
                <Text style={styles.commenterUsername}>username </Text>
                This is a comment. in text format, please accept the comment.
                This is a comment.
              </Text>
            </View> */}
            <View style={styles.modalCommentsContainer}>
              {allComments.length > 0 && (
                <View style={styles.allCommentContainer}>
                  {allComments.map((comment) => (
                    <Comment
                      key={comment._id}
                      _id={comment._id}
                      caption={comment.caption}
                      byUserName={comment.byUserName}
                      replies={comment.replies}
                      replyToCommentClickHandler={replyToCommentClickHandler}
                    />
                  ))}
                </View>
              )}
              {allComments.length <= 0 && (
                <View style={styles.emptyItemsInCategoryContainer}>
                  <View style={styles.emptyItemsInCategoryIcon}>
                    <Ionicons
                      name={"chatbox-outline"}
                      size={22}
                      color={Colors.grey}
                    />
                  </View>
                  <Text style={styles.emptyItemsInCategoryText}>
                    No Comments Yet
                  </Text>
                  <Text style={styles.emptyItemsInCategoryTextSmall}>
                    When people comment, it will be shown here.
                  </Text>
                </View>
              )}
              <View style={{ padding: 16 }}></View>
            </View>
          </ScrollView>
          <View style={styles.modalLowerControlsContainer}>
            {isReplyingToComment !== null && (
              <View style={styles.commentReplyToContainer}>
                <View style={styles.commentReplyToUpperContainer}>
                  <Text style={styles.commentReplyToText}>
                    Reply to {isReplyingToComment.byUserName}
                  </Text>
                  <Pressable onPress={replyToCommentCloseHandler}>
                    <Ionicons
                      name="close-circle-sharp"
                      size={23}
                      color={Colors.error}
                    />
                  </Pressable>
                </View>
                <Text style={styles.commentReplyOnWhatText}>
                  {isReplyingToComment.caption.length > 45
                    ? isReplyingToComment.caption.substring(0, 42) + "....."
                    : isReplyingToComment.caption.substring(0, 45)}
                </Text>
              </View>
            )}
            <View style={styles.commentTextBoxAndButtonContainer}>
              <View style={styles.commentTextBoxContainer}>
                <Image
                  source={{
                    uri: BACKEND_PROFILE_IMAGE_URL + userName + ".png",
                  }}
                  style={styles.commentTextBoxUserDP}
                />
                <TextInput
                  style={styles.commentTextBox}
                  placeholder={
                    isReplyingToComment !== null
                      ? "Reply to " + isReplyingToComment.byUserName
                      : "Post a comment"
                  }
                  placeholderTextColor={Colors.greyTint}
                  keyboardAppearance="dark"
                  value={commentCaption}
                  onChangeText={(txt) => setCommentCaption(txt)}
                />
              </View>
              <Pressable
                style={styles.commentSubmitButton}
                onPress={postCommentHandler}
              >
                <Text style={styles.commentSubmitButtonText}>Post</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      {Platform.OS === "ios" && (
        <View style={{ padding: 13, backgroundColor: Colors.dark150 }}></View>
      )}
    </Modal>
  );
};

const Post = ({
  imageSize,
  _id,
  memoryCaption,
  memoryImage,
  userDP,
  userName,
  postedOn,
  totalComments,
  memoryType,
  tags,
  likeButtonHandler,
  saveButtonHandler,
  deleteButtonHandler,
  isLiked,
  isSaved,
  totalLikes,
  totalSaves,
  comments,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [isTaggedPeopleExpanded, setIsTaggedPeopleExpanded] = useState(false);
  const [isShowComments, setIsShowComments] = useState(false);
  const navigation = useNavigation();

  const [likes, setLikes] = useState(totalLikes);
  const [saves, setSaves] = useState(totalSaves);

  const likeHandler = async () => {
    try {
      setLiked((prev) => !prev);
      const status = await likeButtonHandler(_id);
      if (status === "LIKED") {
        setLiked(true);
        setLikes(totalLikes + 1);
      }
      if (status === "UNLIKED") {
        setLiked(false);
        setLikes(totalLikes - 1);
      }
    } catch (error) {}
  };

  const saveHandler = async () => {
    try {
      setSaved((prev) => !prev);
      const status = await saveButtonHandler(_id);
      if (status === "SAVED") {
        setSaved(true);
        setSaves(totalSaves + 1);
      }
      if (status === "UNSAVED") {
        setSaved(false);
        setSaves(totalSaves - 1);
      }
    } catch (error) {}
  };

  const shareHandler = async () => {};

  const dpClickHandler = () => {
    navigation.navigate("others-profile", { usernameToFetch: userName });
  };
  const [caption, setCaption] = useState(memoryCaption);
  const expandCaptionClickHandler = () => {
    setIsCaptionExpanded((prev) => !prev);
  };
  const showCommentsClickHandler = () => {
    setIsShowComments((prev) => !prev);
  };
  const expandTaggedPeopleClickHandler = () => {
    setIsTaggedPeopleExpanded((prev) => !prev);
  };

  let lastTap = null;
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      likeHandler();
    } else {
      lastTap = now;
    }
  };

  const TagItem = ({ taggedUserName }) => {
    return (
      <Pressable
        style={styles.tagItem}
        onPress={() =>
          navigation.navigate("others-profile", {
            usernameToFetch: taggedUserName,
          })
        }
      >
        <Text style={styles.tagItemText}>@{taggedUserName}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <CommentsModal
        visible={isShowComments}
        closeModal={showCommentsClickHandler}
        comments={comments}
        postID={_id}
      />
      <TouchableWithoutFeedback onPress={handleDoubleTap}>
        <View>
          <Image
            source={{ uri: memoryImage }}
            style={[
              styles.image,
              {
                minWidth: imageSize,
                maxWidth: imageSize,
                minHeight: imageSize,
                maxHeight: imageSize,
                backgroundColor: Colors.darkForLoading,
              },
            ]}
          />
          <View style={styles.dataContainer}>
            <View style={styles.usernameAndDPContainer}>
              <Pressable onPress={dpClickHandler} style={styles.userData}>
                <Image source={{ uri: userDP }} style={styles.userDP} />
                <View style={styles.fullNameUsernameContainer}>
                  <Text style={styles.fullName}>{userName}</Text>
                  <Text style={styles.postedOn}>{postedOn}</Text>
                </View>
              </Pressable>
              <View style={styles.upperControls}>
                {memoryType === "my-profile" ? (
                  <Pressable onPress={() => deleteButtonHandler(_id)}>
                    <Feather name="trash" size={20} color={Colors.white} />
                  </Pressable>
                ) : (
                  // <Pressable onPress={shareHandler}>
                  //   <Feather name="share" size={20} color={Colors.white} />
                  // </Pressable>
                  <View></View>
                )}
              </View>
            </View>
            <View style={styles.captionContainer}>
              {caption.length > 71 && (
                <View>
                  <Text style={styles.captionText}>
                    {isCaptionExpanded ? caption : caption.substring(0, 71)}
                    {!isCaptionExpanded && (
                      <Text
                        style={styles.captionTextExpandButton}
                        onPress={expandCaptionClickHandler}
                      >
                        {isCaptionExpanded ? " show less" : " ...show more"}
                      </Text>
                    )}
                  </Text>
                </View>
              )}
              {caption.length <= 71 && (
                <View>
                  <Text style={styles.captionText}>{caption}</Text>
                </View>
              )}
            </View>

            <View style={styles.lowerControlsContainer}>
              <View style={styles.bottomControlsContainer}>
                <Pressable onPress={likeHandler} style={styles.bottomControl}>
                  <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={22}
                    color={liked ? Colors.pink : Colors.grey}
                  />
                  <Text
                    style={[
                      styles.bottomControlText,
                      { color: liked ? Colors.pink : Colors.grey },
                    ]}
                  >
                    {likes}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.bottomControl}
                  onPress={showCommentsClickHandler}
                >
                  <Ionicons
                    name={"chatbox-outline"}
                    size={22}
                    color={Colors.grey}
                  />
                  <Text style={styles.bottomControlText}>{totalComments}</Text>
                </Pressable>
                <Pressable onPress={saveHandler} style={styles.bottomControl}>
                  <Ionicons
                    name={saved ? "bookmark" : "bookmark-outline"}
                    size={21}
                    color={Colors.grey}
                  />
                  <Text style={styles.bottomControlText}>{saves}</Text>
                </Pressable>
                {tags.length > 0 && (
                  <Pressable
                    onPress={expandTaggedPeopleClickHandler}
                    style={styles.bottomControl}
                  >
                    <Ionicons
                      name={
                        isTaggedPeopleExpanded ? "people" : "people-outline"
                      }
                      size={22}
                      color={Colors.grey}
                    />
                    <Text style={styles.bottomControlText}>{tags.length}</Text>
                  </Pressable>
                )}
              </View>

              {tags.length > 0 && isTaggedPeopleExpanded && (
                <View style={styles.tagggedPeopleContainer}>
                  <Ionicons
                    name="people"
                    size={21}
                    color={Colors.whiteDarker}
                    style={{ marginRight: 9 }}
                  />
                  {tags.map((person) => (
                    <TagItem key={person} taggedUserName={person} />
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Post;
const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: Colors.dark100,
    borderRadius: 22,
    marginBottom: 16,
  },
  image: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    resizeMode: "contain",
  },
  dataContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: Colors.dark90,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  usernameAndDPContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 4,
  },
  lowerControlsContainer: {
    marginTop: 11,
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
    color: Colors.white,
    fontSize: 15,
    fontWeight: "400",
  },
  commentsButton: { paddingBottom: 4, paddingTop: 2 },
  commentsButtonText: {
    color: Colors.yellow200,
    fontSize: 13,
    fontWeight: "600",
  },
  postedOn: {
    color: Colors.greyTint,
    fontSize: 12,
    fontWeight: "500",
  },
  userDP: {
    height: 37,
    width: 37,
    borderRadius: 3.7 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  userOtherDP: {
    height: 19,
    width: 19,
    borderRadius: 19,
    marginRight: 3,
  },
  userData: {
    flexDirection: "row",
    alignItems: "center",
  },
  captionTextExpandButton: {
    color: Colors.whiteDarker,
    fontSize: 14,
    fontWeight: "500",
  },
  //
  //
  modalMainContainer: {
    flex: 2.4,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },
  modalInnerContainer: {
    // marginTop: "auto",
    flex: 1,
    backgroundColor: Colors.dark150,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    // borderColor: Colors.yellowTint,
    // borderTopWidth: 3,
    // borderLeftWidth: 3,
    // borderRightWidth: 3,
    // borderBottomWidth: 0,
  },
  modalUpperControlsContainer: {
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderColor: Colors.yellowTintSecondary,
    alignItems: "center",
    // justifyContent: "center",
  },
  modalHeadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.error,
  },
  modalCommentsContainer: {
    paddingTop: 9,
    marginHorizontal: 11,
  },
  commenterDP: { height: 25, width: 25, borderRadius: 2.5 * 3 },
  commentUserDetails: {
    flexDirection: "row",
  },
  commenterUsername: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "600",
    paddingLeft: 8,
  },
  commentText: {
    paddingLeft: 33,
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "400",
  },
  comment: {
    paddingBottom: 25,
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  commentContainer: { marginBottom: 11 },
  commentReplysContainer: { marginLeft: 33, marginTop: 20 },
  modalCloseContainer: {
    flex: 1,
  },
  showRepliesButtonContainer: {
    marginLeft: 33,
    // marginTop: 3,
  },
  showRepliesButton: {},
  showRepliesButtonText: {
    color: Colors.grey,
    fontSize: 14,
    fontWeight: "600",
  },
  replyButton: { marginLeft: 33, marginTop: 5 },
  replyButtonText: { color: Colors.grey, fontSize: 14, fontWeight: "600" },

  commentTextBoxContainer: {
    marginRight: 10,
    marginTop: 7,
    backgroundColor: Colors.dark95,
    borderRadius: 9,
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 7,
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.dark92,
  },
  commentTextBox: {
    paddingHorizontal: 9,
    fontSize: 16,
    borderRadius: 9,
    color: Colors.white,
    fontWeight: "400",
    flex: 1,
  },
  commentTextBoxUserDP: {
    height: 25,
    width: 25,
    borderRadius: 2.5 * 3,
  },
  modalLowerControlsContainer: {
    borderTopWidth: 2,
    borderColor: Colors.yellowCard,
  },
  commentReplyToContainer: {
    paddingHorizontal: 12,
    marginTop: 12,
    paddingBottom: 9,
    borderBottomWidth: 2,
    borderColor: Colors.yellowCard,
    flexDirection: "column",
  },
  commentReplyOnWhatText: {
    color: Colors.grey,
    fontWeight: "400",
    fontSize: 12,
  },
  commentReplyToText: {
    color: Colors.white,
    fontWeight: "500",
    fontSize: 15,
  },
  commentTextBoxAndButtonContainer: {
    marginHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentSubmitButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  commentSubmitButtonText: {
    color: Colors.yellow200,
    fontWeight: "600",
    fontSize: 16,
  },

  commentReplyToUpperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fullNameUsernameContainer: {
    marginLeft: 9,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
  postedOn: {
    marginTop: 1,
    fontSize: 13,
    fontWeight: "500",
    color: Colors.grey,
    textTransform: "capitalize",
  },

  bottomControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 29,
  },
  bottomControlText: {
    color: Colors.grey,
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 5,
  },
  bottomControlsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1,
    alignItems: "center",
    marginTop: 5,
    // marginBottom: 9,
  },
  upperControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  tagggedPeopleContainer: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 13,
  },

  tagItem: {
    backgroundColor: Colors.dark100,
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.dark90,
    // flexGrow: 1,
    marginBottom: 6,
    marginRight: 6,
  },
  tagItemText: {
    color: Colors.whiteDarker,
    fontSize: 14,
    fontWeight: "500",
    // textTransform: "uppercase",
  },

  //

  commentOnWhatContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    // marginHorizontal: 7,
    marginBottom: 9,
    backgroundColor: Colors.dark100,
    paddingVertical: 10,
    paddingHorizontal: 13,
    // borderRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.yellowTint,
  },
  commentOnWhatImage: {
    height: 56,
    width: 56,
    borderRadius: 7,
    marginTop: 4,
  },
  commentOnWhatCaption: {
    marginLeft: 10,
    color: Colors.grey,
    fontSize: 15,
    fontWeight: "400",
    flex: 1,
  },

  allCommentContainer: {
    marginTop: 15,
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
