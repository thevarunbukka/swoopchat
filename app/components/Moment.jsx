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
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
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
export const LoadingMoment = ({ width, height, style, history }) => {
  return (
    <View style={[styles.outer, { width: width }, style]}>
      <View
        style={[
          styles.storyImage,
          { width, height, backgroundColor: Colors.darkForLoading },
        ]}
      />

      <View style={styles.innerContainer}>
        {!history && (
          <View style={styles.dpContainer}>
            <View style={styles.loadingDp} />
          </View>
        )}
        <View
          style={{
            marginLeft: !history ? 5 : 1,
            flex: 1,
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {!history && (
            <>
              <LoadingText
                width={10}
                height={0.5}
                style={{ marginBottom: 4 }}
              />
              <LoadingText width={6} height={0.5} />
            </>
          )}
          {history && (
            <>
              <LoadingText width={10} height={1} style={{ marginBottom: 3 }} />
              <LoadingText width={5} height={1} style={{ marginBottom: 3 }} />
              <LoadingText width={7} height={0.5} />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export const MyStory = ({ _id, width, height }) => {
  return (
    <View style={[styles.outer, { width: width }]}>
      <View style={[styles.myStoryImage, { width, height }]}>
        <Feather
          name="plus-square"
          size={36}
          color={Colors.whiteDarker}
          style={{ marginTop: 13 }}
        />
      </View>

      <View
        style={[styles.innerContainer, { paddingTop: 8, paddingBottom: 9 }]}
      >
        <View style={styles.dpContainer}>
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + _id + ".png" }}
            style={styles.dp}
          />
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.userName}>
            {_id.length > 6 ? _id.substring(0, 6) + ".." : _id}
            {/* New Moment */}
          </Text>
          <Text style={styles.dateAndTime}>Moments</Text>
        </View>
      </View>
    </View>
  );
};

const Moment = ({
  _id,
  userName,
  width,
  height,
  style,
  history,
  openMomentHandler,
  momentImage,
  momentDateAndTime,
  profile,
}) => {
  return (
    <Pressable
      style={[styles.outer, { width: width }, style]}
      onPress={openMomentHandler}
    >
      <Image
        source={{ uri: BACKEND_MOMENTS_IMAGE_URL + momentImage }}
        style={[
          styles.storyImage,
          { width, height, backgroundColor: Colors.darkForLoading },
        ]}
        blurRadius={history ? 0 : Platform.OS === "android" ? 19 : 9}
      />
      <View
        style={[
          styles.innerContainer,
          !history && { paddingTop: 8, paddingBottom: 9 },
        ]}
      >
        {!history && (
          <View style={styles.dpContainer}>
            <Image
              source={{ uri: BACKEND_PROFILE_IMAGE_URL + userName + ".png" }}
              style={styles.dp}
            />
          </View>
        )}
        {!history && !profile && (
          <View style={[styles.dataContainer, { marginLeft: 5 }]}>
            <Text style={styles.userName}>
              {userName.length > 6 ? userName.substring(0, 6) + ".." : userName}
            </Text>
            <Text style={styles.dateAndTime}>
              {momentDateAndTime.split(",")[0].trim()}
            </Text>
          </View>
        )}
        {!history && profile && (
          <View style={[styles.dataContainer, { marginLeft: 5 }]}>
            <Text style={styles.userName}>
              {userName.length > 6 ? userName.substring(0, 6) + ".." : userName}
            </Text>
            <Text
              style={[styles.dateAndTime, { fontSize: 9, fontWeight: "700" }]}
            >
              {momentDateAndTime.split(",")[1].trim().toUpperCase()}
            </Text>
          </View>
        )}
        {history && (
          <View style={[styles.dataContainer, { marginLeft: 1 }]}>
            <Text style={[styles.userName, { fontSize: 14 }]}>
              {/* {"21 Mar 20".length > 10
                ? "21 Mar 20".substring(0, 10) + ".."
                : "21 Mar 20"} */}
              {momentDateAndTime.split(",")[1].trim()}
            </Text>
            <Text style={[styles.dateAndTime, { fontSize: 12 }]}>
              {momentDateAndTime.split(",")[0].trim()}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default Moment;

const styles = StyleSheet.create({
  // loadingDp: {
  //   backgroundColor: Colors.darkForLoading,
  //   height: 35,
  //   width: 35,
  //   borderRadius: 3.5 * 3,
  // },
  loadingDp: {
    backgroundColor: Colors.darkForLoading,
    height: 32,
    width: 32,
    borderRadius: 3.2 * 3,
  },
  // dp: {
  //   height: 35,
  //   width: 35,
  //   borderRadius: 3.5 * 3,
  // },
  dp: {
    height: 31,
    width: 31,
    borderRadius: 3.1 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  dataContainer: {
    marginLeft: 5,
    // marginRight: 5,
    flexDirection: "column",
    flex: 1,
  },
  outer: {
    // marginBottom: 9,
    borderRadius: 19,
    marginHorizontal: 5,
  },
  innerContainer: {
    paddingTop: 9,
    paddingHorizontal: 7,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.dark90,
    backgroundColor: Colors.dark100,
    borderBottomLeftRadius: 19,
    borderBottomRightRadius: 19,
  },
  dpContainer: {
    borderRadius: 3.5 * 3,
  },

  userName: {
    // fontSize: 14,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  dateAndTime: {
    // fontSize: 12,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.grey,
  },
  storyImage: { borderTopLeftRadius: 19, borderTopRightRadius: 19 },
  myStoryImage: {
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    backgroundColor: Colors.dark80,
    justifyContent: "center",
    alignItems: "center",
  },
});
