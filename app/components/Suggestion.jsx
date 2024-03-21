import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import Colors from "../Colors";
import { Feather } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import {
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MOMENTS_IMAGE_URL,
} from "@env";
import LoadingText from "./Loading/LoadingText";

export const LoadingSuggestion = ({ width }) => {
  return (
    <View style={styles.outer}>
      <View style={styles.innerContainer}>
        <View style={styles.dpContainer}>
          <View
            style={[styles.dp, { backgroundColor: Colors.darkForLoading }]}
          />
        </View>
        <View style={{ marginLeft: 8, width: width }}>
          <LoadingText width={10} height={1} style={{ marginBottom: 4 }} />
          <LoadingText width={5} height={0.5} style={{ marginBottom: 3 }} />
        </View>
      </View>
    </View>
  );
};

const Suggestion = ({ _id, userName, fullName, style, onPress }) => {
  return (
    <View style={[styles.outer, style]}>
      <Pressable onPress={onPress} style={styles.innerContainer}>
        <View style={styles.dpContainer}>
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + userName + ".png" }}
            style={styles.dp}
          />
        </View>

        <View style={styles.dataContainer}>
          <Text style={styles.userName}>
            {/* {userName.length > 6 ? userName.substring(0, 6) + ".." : userName} */}
            {userName}
          </Text>
          <Text style={styles.fullName}>
            {/* {fullName.length > 6 ? fullName.substring(0, 6) + ".." : fullName} */}
            {fullName}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default Suggestion;

const styles = StyleSheet.create({
  loadingDp: {
    backgroundColor: Colors.darkForLoading,
    height: 32,
    width: 32,
    borderRadius: 3.2 * 3,
  },
  dp: {
    height: 37,
    width: 37,
    borderRadius: 3.7 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  dataContainer: {
    marginLeft: 9,
    flexDirection: "column",
    flex: 1,
  },
  outer: {
    borderRadius: 19,
    marginRight: 10,
  },
  innerContainer: {
    paddingVertical: 9,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.dark90,
    backgroundColor: Colors.dark100,
    borderRadius: 19,
    paddingRight: 13,
  },
  dpContainer: {
    borderRadius: 3.5 * 3,
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
  fullName: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.grey,
  },
});
