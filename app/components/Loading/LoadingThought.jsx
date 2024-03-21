import { View, Image, StyleSheet } from "react-native";
import LoadingText from "./LoadingText";
import Colors from "../../Colors";

const LoadingThought = ({}) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.allUpperDataControls}>
          <View style={styles.dpUsernameFullNameContainer}>
            <View style={styles.dpContainer}>
              <View style={styles.dp} />
            </View>
            <View style={styles.fullNameUsernameContainer}>
              <LoadingText width={5} height={2} style={{ marginBottom: 5 }} />
              <LoadingText width={3} height={2} />
            </View>
          </View>
        </View>
        <View style={styles.captionContainer}>
          <LoadingText width={9} height={3} style={{ marginBottom: 6 }} />
          <LoadingText width={5} height={3} style={{ marginBottom: 6 }} />
          <LoadingText width={7} height={3} style={{ marginBottom: 2 }} />
        </View>
      </View>
    </View>
  );
};

export default LoadingThought;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: Colors.dark100,
    padding: 11,
    borderRadius: 17,
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
    height: 42,
    width: 42,
    borderRadius: 4.2 * 3,
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
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  //
  captionContainer: {
    marginTop: 13,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 3,
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
});
