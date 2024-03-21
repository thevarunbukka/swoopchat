import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import Colors from "../Colors";
import LoadingText from "./Loading/LoadingText";

export const LoadingChatsItem = () => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.dpContainer}>
          <View style={styles.dp} />
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.upperDataContainer}>
            <LoadingText
              height={4}
              width={9}
              style={{ marginTop: 4, marginBottom: 4 }}
            />
          </View>
          <View style={styles.messageLoading}>
            <LoadingText height={4} width={5} style={{ marginTop: 4 }} />
          </View>
        </View>
      </View>
    </View>
  );
};

const ChatsItem = ({
  closeModal,
  messageID,
  chatID,
  otherUserName,
  message,
  profilePicture,
  time,
  onPress,
}) => {
  return (
    <Pressable
      style={styles.outerContainer}
      onPress={() => {
        if (closeModal) {
          closeModal();
        }
        onPress();
      }}
    >
      <View style={styles.innerContainer}>
        <View style={styles.dpContainer}>
          <Image source={{ uri: profilePicture }} style={styles.dp} />
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.upperDataContainer}>
            <Text style={styles.sender}>
              {otherUserName.length > 16
                ? otherUserName.substring(0, 16) + "..."
                : otherUserName}
            </Text>
            <Text style={styles.dateNTime}>{time}</Text>
          </View>
          <Text style={styles.message}>
            {message.length > 45 ? message.substring(0, 45) + "..." : message}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatsItem;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: Colors.dark99,
    paddingVertical: 9,
    paddingHorizontal: 9,
    borderRadius: 21,
    marginBottom: 9,
    borderWidth: 1.5,
    borderColor: Colors.dark90,
  },
  innerContainer: { flexDirection: "row", alignItems: "center" },
  dpContainer: {
    marginRight: 5,
  },
  dp: {
    height: 63,
    width: 63,
    borderRadius: 6.3 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  dataContainer: {
    marginLeft: 4,
    flexShrink: 1,
    flex: 1,
  },
  sender: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 2,
    textTransform: "lowercase",
  },
  message: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.grey,
    marginRight: 1,
    flex: 1,
    minHeight: 41,
  },
  messageLoading: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  upperDataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateNTime: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.grey,
    marginRight: 3,
  },
});
