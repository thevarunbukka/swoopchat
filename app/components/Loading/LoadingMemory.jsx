import { View, StyleSheet } from "react-native";
import LoadingText from "./LoadingText";
import Colors from "../../Colors";

const LoadingMemory = ({ imageSize }) => {
  return (
    <View style={styles.outerContainer}>
      <View>
        <View
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
              <View style={styles.userDP} />
              <View style={styles.fullNameUsernameContainer}>
                <LoadingText width={5} height={2} style={{ marginBottom: 5 }} />
                <LoadingText width={3} height={2} />
              </View>
            </View>
          </View>
          <View style={styles.captionContainer}>
            <LoadingText width={9} height={3} style={{ marginBottom: 6 }} />
            <LoadingText width={6} height={3} style={{ marginBottom: 6 }} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoadingMemory;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: Colors.dark100,
    borderRadius: 17,
    marginBottom: 16,
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
    borderTopWidth: 0,
    borderColor: Colors.dark90,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  usernameAndDPContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 4,
  },
  captionContainer: {
    marginTop: 13,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  userData: {
    flexDirection: "row",
    alignItems: "center",
  },
  userDP: {
    height: 42,
    width: 42,
    borderRadius: 4.2 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  fullNameUsernameContainer: {
    marginLeft: 9,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
