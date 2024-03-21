import { View, Image, Text, StyleSheet } from "react-native";
import LoadingText from "./LoadingText";
import Colors from "../../Colors";

const LoadingSearch = () => {
  return (
    <View style={styles.searchResultOuterContainer}>
      <View style={styles.searchResultInnerContainer}>
        <View style={styles.dpContainer}>
          <View style={styles.dp} />
        </View>
        <View style={styles.searchResultDataContainer}>
          <View style={styles.searchResultDataLeftContainer}>
            <LoadingText width={6} height={3} style={{ marginBottom: 5 }} />
            <LoadingText width={3} height={3} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoadingSearch;

const styles = StyleSheet.create({
  searchResultOuterContainer: {
    borderWidth: 1.5,
    borderColor: Colors.dark90,
    backgroundColor: Colors.dark100,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
    marginBottom: 8,
  },
  searchResultInnerContainer: { flexDirection: "row", alignItems: "center" },
  searchResultDataContainer: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  searchResultDataLeftContainer: {
    flex: 9,

    alignItems: "flex-start",
  },
  dpContainer: {
    marginRight: 3,
  },
  dp: {
    height: 40,
    width: 40,
    borderRadius: 4 * 3,
    backgroundColor: Colors.darkForLoading,
  },
});
