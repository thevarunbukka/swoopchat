import { View, Image, StyleSheet } from "react-native";
import LoadingText from "./LoadingText";
import Colors from "../../Colors";

const LoadingProfileCard = () => {
  return (
    <View style={styles.profileDetailsContainerMain}>
      <View style={styles.profileDetailsContainer}>
        <View style={styles.dpFullnameBioContainer}>
          <View style={styles.dpFullnameContainer}>
            <View style={styles.dpContainer}>
              <View style={styles.profileDP} />
            </View>
            <View style={styles.fullnameContainer}>
              <LoadingText width={7} height={3} style={{ marginBottom: 6 }} />
              <LoadingText width={5} height={2} />
            </View>
          </View>
          <View style={styles.bioContainer}>
            <LoadingText width={10} height={2} style={{ marginBottom: 5 }} />
            <LoadingText width={3} height={2} />
          </View>
        </View>
        <View style={styles.allCategoriesContainer}>
          <View style={styles.allCategoriesContainerItem}>
            <LoadingText width={9} height={1} style={{ marginBottom: 5 }} />
            <LoadingText width={4} height={1} />
          </View>
          <View style={styles.allCategoriesContainerItem}>
            <LoadingText width={9} height={1} style={{ marginBottom: 5 }} />
            <LoadingText width={4} height={1} />
          </View>
          <View style={styles.allCategoriesContainerItem}>
            <LoadingText width={9} height={1} style={{ marginBottom: 5 }} />
            <LoadingText width={4} height={1} />
          </View>
          <View style={styles.allCategoriesContainerItem}>
            <LoadingText width={9} height={1} style={{ marginBottom: 5 }} />
            <LoadingText width={4} height={1} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoadingProfileCard;

const styles = StyleSheet.create({
  allCategoriesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 13,
    marginBottom: 17,
    // marginRight: 9,
  },
  allCategoriesContainerItem: {
    flex: 1,
    marginHorizontal: 5,
    flexDirection: "column",
    alignItems: "center",
  },
  dpContainer: {
    alignItems: "center",
  },
  profileDP: {
    height: 52,
    width: 52,
    borderRadius: 5.2 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  dpFullnameContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 15,
  },
  //

  categoryValue: {
    fontWeight: "700",
    color: Colors.grey,
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
  },
  categoryName: {
    fontWeight: "500",
    color: Colors.grey,
    fontSize: 13,
    textAlign: "center",
  },
  fullnameContainer: {
    justifyContent: "center",
    marginTop: 2,
    marginLeft: 8,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  fullName: {
    // paddingTop: 7,
    fontWeight: "700",
    color: Colors.white,
    fontSize: 18,
  },
  bioContainer: {
    paddingTop: 15,
    paddingBottom: 4,
    paddingHorizontal: 5,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  bio: {
    paddingTop: 5,
    fontWeight: "500",
    color: Colors.white,
    fontSize: 15,
  },
  buttonControlsContainer: {
    paddingHorizontal: 16,
    marginBottom: 17,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  shareButton: {
    // borderRadius: 9,
    // backgroundColor: Colors.dark50,
    marginLeft: 19,
    marginRight: 2,
    // borderWidth: 0,
    alignItems: "center",
  },
  postsAndMemoriesContainer: {
    paddingTop: 25,
    paddingBottom: 22,
    backgroundColor: Colors.dark200,
  },
  loadedDataContainer: { paddingHorizontal: 12, paddingBottom: 18 },
  postsAndMemoriesTopBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderColor: Colors.greyTint,
  },
  postsAndMemoriesTopButton: {
    paddingBottom: 9,
    paddingHorizontal: 6,
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
  },
  postsAndMemoriesTopButtonText: {
    paddingLeft: 5,
    fontWeight: "500",
    color: Colors.white,
    fontSize: 13,
  },

  profileDetailsContainer: {
    paddingHorizontal: 6,
    // marginTop: 8,
    marginBottom: 18,
    backgroundColor: Colors.dark200,
    // borderRadius: 17,
    borderBottomWidth: 2.5,
    borderTopWidth: 2.5,
    borderColor: Colors.dark90,
  },
  dpFullnameBioContainer: {
    paddingHorizontal: 14,
  },

  userNameInCard: {
    color: Colors.grey,
    fontSize: 14,
    fontWeight: "600",
  },
  ////
  // for

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

  deletePostUsernameCaption: {
    paddingLeft: 8,
    flex: 1,
  },
  deletePostContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    borderRadius: 9,
    padding: 9,
    borderWidth: 1,
    borderColor: Colors.yellowTint,
  },
  deletePostProfileImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginTop: 3,
  },
  deleteThoughtCaption: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "400",
    marginTop: 3,
  },
  deleteThoughtWarning: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
    marginLeft: 4,
  },
  deletePostUsername: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "600",
  },
});
