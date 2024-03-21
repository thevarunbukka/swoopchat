import { View, Image, Text, StyleSheet } from "react-native";
import LoadingText from "./LoadingText";
import Colors from "../../Colors";

const LoadingNotification = () => {
  return (
    <View style={styles.loadingNotificationOuterContainer}>
      <View style={styles.loadingNotificationInnerContainer}>
        <View style={styles.dpContainer}>
          <View style={styles.dp} />
        </View>
        <View style={styles.loadingNotificationDataContainer}>
          <View style={styles.loadingNotificationDataLeftContainer}>
            <LoadingText width={5} height={2} style={{ marginBottom: 5 }} />
            <LoadingText width={10} height={2} style={{ marginBottom: 5 }} />
            <LoadingText width={3} height={2} style={{ marginBottom: 5 }} />
            <LoadingText width={7} height={2} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoadingNotification;

const styles = StyleSheet.create({
  loadingNotificationOuterContainer: {
    borderWidth: 1.5,
    borderColor: Colors.dark90,
    backgroundColor: Colors.dark100,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 13,
    marginBottom: 8,
  },
  loadingNotificationInnerContainer: {
    flexDirection: "row",
  },
  loadingNotificationDataContainer: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  loadingNotificationDataLeftContainer: {
    flex: 9,
    alignItems: "flex-start",
  },
  dpContainer: {
    marginRight: 3,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  dp: {
    height: 44,
    width: 44,
    borderRadius: 4.4 * 3,
    backgroundColor: Colors.darkForLoading,
  },
});
