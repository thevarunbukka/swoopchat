import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  RefreshControl,
} from "react-native";
import Colors from "../../Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Feather, Ionicons } from "@expo/vector-icons";
import ProfileButtons from "../../components/buttons/ProfileButtons";
import { useState, useEffect, useLayoutEffect } from "react";
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
import BackButton from "../../components/BackButton";
import LoadingText from "../../components/Loading/LoadingText";

const { width } = Dimensions.get("window");
const imageSize = width - 24;

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
const LoadingComment = () => {
  return (
    <View style={styles.comment}>
      {/* <View style={styles.commentContainer}> */}
      <View style={styles.commentUserDetails}>
        <View style={styles.commenterDP} />
        <View
          style={[
            styles.fullNameUsernameContainer,
            {
              flex: 1,
              flexDirection: "column",
              alignItems: "start",
            },
          ]}
        >
          <LoadingText
            height={3}
            width={7}
            style={{ marginBottom: 4, marginHorizontal: 6 }}
          />
          <LoadingText height={3} width={5} style={{ marginHorizontal: 6 }} />
        </View>
      </View>
      {/* </View> */}
    </View>
  );
};
const ThoughtPage = ({ route }) => {
  const [isReplyingToComment, setIsReplyingToComment] = useState(null);
  const replyToCommentClickHandler = (_id, byUserName, caption) =>
    setIsReplyingToComment({ _id, byUserName, caption });
  const replyToCommentCloseHandler = () => setIsReplyingToComment(null);
  const [isLoading, setIsLoading] = useState(false);

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fetchedThought, setFetchedThought] = useState({
    tags: [],
    likes: [],
    saves: [],
    comments: [],
  });
  const [whosThought, setWhosThought] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [fullName, setFullName] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  const userToken = useSelector((state) => state.authorization.token);
  const userName = useSelector((state) => state.authorization.userName);

  const onLoadHandler = async (toUpdateViews) => {
    setIsLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL +
          "/profile/thought/" +
          route.params.thoughtID +
          "/" +
          toUpdateViews,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const response = await request.json();

      if (response.status === "THOUGHT_FETCHED") {
        setFullName(response.data.fullName);
        setWhosThought(response.data.whosThought);
        setFetchedThought(response.data.fetchedThought);
        setProfilePicture(response.data.profilePicture);
        setLiked(response.data.isLiked);
        setSaved(response.data.isSaved);
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
    onLoadHandler(true);
  }, []);

  const likeButtonHandler = async () => {
    try {
      setLiked((prev) => !prev);
      const request = await fetch(BACKEND_URL + "/post/like/", {
        method: "POST",
        body: JSON.stringify({
          postID: route.params.thoughtID,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "LIKED") {
        setFetchedThought((prev) => {
          return { ...prev, likes: [...prev.likes, userName] };
        });
      }
      if (response.status === "UNLIKED") {
        setFetchedThought((prev) => {
          const likes = prev.likes.filter((like) => like !== userName);
          return { ...prev, likes };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const saveButtonHandler = async () => {
    try {
      setSaved((prev) => !prev);
      const request = await fetch(BACKEND_URL + "/post/save/", {
        method: "POST",
        body: JSON.stringify({
          postID: route.params.thoughtID,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "SAVED") {
        setFetchedThought((prev) => {
          return { ...prev, saves: [...prev.saves, userName] };
        });
      }
      if (response.status === "UNSAVED") {
        setFetchedThought((prev) => {
          const saves = prev.saves.filter((like) => like !== userName);
          return { ...prev, saves };
        });
      }
    } catch (error) {}
  };

  const [commentCaption, setCommentCaption] = useState("");

  const postCommentHandler = async () => {
    if (commentCaption.trim() !== "") {
      if (isReplyingToComment !== null) {
        try {
          const request = await fetch(BACKEND_URL + "/post/reply-to-comment/", {
            method: "POST",
            body: JSON.stringify({
              postID: route.params.thoughtID,
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
            setFetchedThought((prev) => {
              return { ...prev, comments: response.data.comments };
            });
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
              postID: route.params.thoughtID,
              caption: commentCaption,
            }),
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + userToken,
            },
          });

          const response = await request.json();

          if (response.status === "COMMENT_POSTED") {
            setFetchedThought((prev) => {
              return { ...prev, comments: response.data.comments };
            });
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
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.upperControlsContainer}>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={{ marginTop: 6, marginLeft: 15 }}>
            {!isLoading ? (
              <Text style={styles.postsOfUsername}>
                {fetchedThought.userName}
              </Text>
            ) : (
              <Text style={styles.postsOfUsername}>LOADING....</Text>
            )}
            <Text style={styles.headingText}>Thought</Text>
          </View>
        </View>

        <ScrollView
          scrollEnabled={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => onLoadHandler("")}
            />
          }
        >
          <View style={styles.scrollViewInnerContainer}>
            <View style={styles.thoughtContainer}>
              <Pressable
                style={styles.dpUsernameFullNameContainer}
                onPress={() =>
                  navigation.navigate("others-profile", {
                    usernameToFetch: fetchedThought.userName,
                  })
                }
              >
                <View style={styles.dpContainer}>
                  <Image
                    source={{ uri: BACKEND_PROFILE_IMAGE_URL + profilePicture }}
                    style={styles.dp}
                  />
                </View>
                {!isLoading && (
                  <View style={styles.fullNameUsernameContainer}>
                    <Text style={styles.fullName}>{fullName}</Text>
                    <Text style={styles.userName}>
                      {fetchedThought.postedOn}
                    </Text>
                  </View>
                )}
                {isLoading && (
                  <View
                    style={[
                      styles.fullNameUsernameContainer,
                      {
                        flex: 1,
                        flexDirection: "column",
                        alignItems: "start",
                      },
                    ]}
                  >
                    <LoadingText
                      height={3}
                      width={6}
                      style={{ marginBottom: 4 }}
                    />
                    <LoadingText height={3} width={3} />
                  </View>
                )}
              </Pressable>
              <View style={styles.captionContainer}>
                {!isLoading && (
                  <Text style={styles.captionText}>
                    {fetchedThought.caption}
                  </Text>
                )}
                {isLoading && (
                  <View
                    style={[
                      styles.fullNameUsernameContainer,
                      {
                        flex: 1,
                        flexDirection: "column",
                        alignItems: "start",
                      },
                    ]}
                  >
                    <LoadingText
                      height={3}
                      width={10}
                      style={{ marginBottom: 4 }}
                    />
                    <LoadingText
                      height={3}
                      width={9}
                      style={{ marginBottom: 4 }}
                    />
                    <LoadingText
                      height={3}
                      width={10}
                      style={{ marginBottom: 4 }}
                    />
                    <LoadingText
                      height={3}
                      width={7}
                      style={{ marginBottom: 4 }}
                    />
                    <LoadingText
                      height={3}
                      width={9}
                      style={{ marginBottom: 4 }}
                    />
                    <LoadingText
                      height={3}
                      width={10}
                      style={{ marginBottom: 4 }}
                    />
                  </View>
                )}
                {fetchedThought.tags.length > 0 && (
                  <View style={styles.tagggedPeopleContainer}>
                    <Ionicons
                      name="people-outline"
                      size={21}
                      color={Colors.white}
                      style={{ marginRight: 9 }}
                    />
                    {fetchedThought.tags.map((person) => (
                      <TagItem key={person} taggedUserName={person} />
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.mainControlsContainer}>
                <View style={styles.controlsRowButtonsContainer}>
                  {!isLoading && (
                    <>
                      <Pressable
                        onPress={likeButtonHandler}
                        style={styles.bottomControl}
                      >
                        <Ionicons
                          name={liked ? "heart" : "heart-outline"}
                          size={21}
                          color={liked ? Colors.pink : Colors.white}
                        />
                        <Text
                          style={[
                            styles.bottomControlText,
                            { color: liked ? Colors.pink : Colors.white },
                          ]}
                        >
                          {fetchedThought.likes.length}
                        </Text>
                      </Pressable>
                      <Pressable style={styles.bottomControl}>
                        <Ionicons
                          name={"chatbox-outline"}
                          size={21}
                          color={Colors.white}
                        />
                        <Text style={styles.bottomControlText}>
                          {fetchedThought.comments.length}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => saveButtonHandler()}
                        style={styles.bottomControl}
                      >
                        <Ionicons
                          name={saved ? "bookmark" : "bookmark-outline"}
                          size={21}
                          color={Colors.white}
                        />
                        <Text style={styles.bottomControlText}>
                          {fetchedThought.saves.length}
                        </Text>
                      </Pressable>
                      <View style={[styles.bottomControl, { marginRight: 0 }]}>
                        <Text style={styles.controlsRowAnalyticsItemText}>
                          {fetchedThought.views} Views
                        </Text>
                      </View>
                    </>
                  )}
                  {isLoading && (
                    <>
                      <View style={styles.bottomControl}>
                        <Ionicons
                          name={"heart-outline"}
                          size={21}
                          color={Colors.white}
                        />
                        <Text
                          style={[
                            styles.bottomControlText,
                            { color: Colors.white },
                          ]}
                        >
                          ...
                        </Text>
                      </View>
                      <View style={styles.bottomControl}>
                        <Ionicons
                          name={"chatbox-outline"}
                          size={21}
                          color={Colors.white}
                        />
                        <Text style={styles.bottomControlText}>...</Text>
                      </View>
                      <View style={styles.bottomControl}>
                        <Ionicons
                          name={"bookmark-outline"}
                          size={21}
                          color={Colors.white}
                        />
                        <Text style={styles.bottomControlText}>...</Text>
                      </View>
                      <View style={[styles.bottomControl, { marginRight: 0 }]}>
                        <Text style={styles.controlsRowAnalyticsItemText}>
                          ... Views
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
            {!isLoading && fetchedThought.comments.length > 0 && (
              <View style={styles.allCommentContainer}>
                {fetchedThought.comments.map((comment) => (
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
            {isLoading && (
              <View>
                <LoadingComment />
                <LoadingComment />
                <LoadingComment />
                <LoadingComment />
              </View>
            )}
            {!isLoading && fetchedThought.comments.length <= 0 && (
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
          </View>
        </ScrollView>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.lowerControlsContainer}>
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
                source={{ uri: BACKEND_PROFILE_IMAGE_URL + userName + ".png" }}
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
      </KeyboardAvoidingView>
    </View>
  );
};

export default ThoughtPage;

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
    textTransform: "uppercase",
  },
  headingText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
  },

  scrollViewInnerContainer: {
    marginTop: 13,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  dpUsernameFullNameContainer: { flexDirection: "row", alignItems: "center" },
  fullNameUsernameContainer: {
    marginLeft: 4,
  },
  fullName: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
  },
  userName: {
    fontSize: 15,
    fontWeight: "400",
    color: Colors.grey,
  },
  dpContainer: {
    marginRight: 5,
  },
  dp: {
    height: 45,
    width: 45,
    borderRadius: 4.5 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  captionContainer: {
    marginTop: 14,
  },

  captionText: {
    justifyContent: "flex-start",
    alignItems: "center",
    color: Colors.white,
    fontSize: 17,
    fontWeight: "400",
  },
  mainControlsContainer: {
    marginVertical: 19,
  },
  controlsRowButtonsContainer: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    padding: 10,
    borderColor: Colors.dark92,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  analyticsNumbersText: {
    paddingLeft: 9,
    fontSize: 14,
    color: Colors.yellow200,
    fontWeight: "500",
  },
  controlsRowAnalyticsItemText: {
    fontSize: 13,
    color: Colors.grey,
    fontWeight: "500",
  },
  lowerControlsContainer: {
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
  commentTextBoxContainer: {
    marginRight: 10,
    marginTop: 7,
    marginBottom: 2,
    backgroundColor: Colors.dark95,
    borderRadius: 10,
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
  comment: {
    paddingBottom: 25,
    marginBottom: 6,
  },
  commentReplysContainer: { marginLeft: 33, marginTop: 20 },
  commentContainer: { marginBottom: 11 },
  commenterDP: {
    height: 25,
    width: 25,
    borderRadius: 2.5 * 3,
    backgroundColor: Colors.darkForLoading,
  },
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
    color: Colors.whiteDarker,
    fontSize: 16,
    fontWeight: "400",
  },
  replyButton: { marginLeft: 33, marginTop: 5 },
  replyButtonText: { color: Colors.grey, fontSize: 14, fontWeight: "600" },
  showRepliesButtonContainer: {
    marginLeft: 33,
  },
  showRepliesButton: {},
  showRepliesButtonText: {
    color: Colors.grey,
    fontSize: 14,
    fontWeight: "600",
  },
  bottomControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: 29,
  },
  bottomControlText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 5,
  },

  tagggedPeopleContainer: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 17,
    marginBottom: 2,
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
