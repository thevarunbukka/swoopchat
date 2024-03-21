import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Colors from "../Colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const Thought = ({
  _id,
  children,
  caption,
  userDP,
  userName,
  postedOn,
  totalComments,
  thoughtType,
  likeButtonHandler,
  saveButtonHandler,
  deleteButtonHandler,
  shareButtonHandler,
  isLiked,
  isSaved,
  totalLikes,
  totalSaves,
}) => {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);

  const [likes, setLikes] = useState(totalLikes);
  const [saves, setSaves] = useState(totalSaves);

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

  return (
    <View style={styles.outerContainer}>
      <TouchableWithoutFeedback onPress={handleDoubleTap}>
        <View style={styles.innerContainer}>
          <View style={styles.allUpperDataControls}>
            <Pressable
              style={styles.dpUsernameFullNameContainer}
              onPress={() => {
                navigation.navigate("thought-page", { thoughtID: _id });
              }}
            >
              <View style={styles.dpContainer}>
                <Image source={{ uri: userDP }} style={styles.dp} />
              </View>
              <View style={styles.fullNameUsernameContainer}>
                <Text style={styles.fullName}>{userName}</Text>
                <Text style={styles.postedOn}>{postedOn}</Text>
              </View>
            </Pressable>
            <View style={styles.upperControls}>
              {thoughtType === "my-profile" ? (
                <Pressable onPress={() => deleteButtonHandler(_id)}>
                  <Feather name="trash" size={20} color={Colors.white} />
                </Pressable>
              ) : (
                <View></View>
              )}
            </View>
          </View>
          <Pressable
            style={styles.captionContainer}
            onPress={() => {
              navigation.navigate("thought-page", { thoughtID: _id });
            }}
          >
            <View>
              <Text style={styles.captionText}>{caption}</Text>
            </View>
          </Pressable>

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
                onPress={() => {
                  navigation.navigate("thought-page", { thoughtID: _id });
                }}
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
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Thought;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: Colors.dark100,
    padding: 11,
    borderRadius: 22,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: Colors.dark90,
    flex: 1,
  },
  innerContainer: {},
  dpContainer: {
    marginRight: 5,
  },
  dp: {
    height: 37,
    width: 37,
    borderRadius: 3.7 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  dataContainer: {
    marginLeft: 5,
    flexShrink: 1,
    flex: 1,
  },
  dpUsernameFullNameContainer: { flexDirection: "row", alignItems: "center" },
  fullNameUsernameContainer: {
    marginLeft: 4,
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
  //
  captionContainer: {
    marginTop: 13,
  },
  captionTextUsername: {
    fontWeight: "600",
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
  upperControl: {
    marginLeft: 9,
  },
  upperControl1: {
    marginLeft: 4,
  },
  userDP: {
    height: 26,
    width: 26,
    borderRadius: 26,
  },
  userData: {
    flexDirection: "row",
    alignItems: "center",
  },
  likes: {
    color: Colors.yellow100,
    fontSize: 15,
    fontWeight: "400",
    paddingLeft: 4,
    // marginRight: 1,
  },
  captionTextExpandButton: {
    color: Colors.whiteDarker,
    fontSize: 14,
    fontWeight: "500",
  },
  lowerControlsContainer: {
    marginTop: 11,
  },
  upperControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    marginTop: 3,
    marginBottom: 9,
  },
  upperControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  dataContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: Colors.yellowTint,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  allUpperDataControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bottomControlsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1,
    alignItems: "center",
    marginTop: 5,
    // marginBottom: 9,
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
});
