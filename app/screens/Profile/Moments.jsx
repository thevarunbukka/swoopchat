import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  RefreshControl,
} from "react-native";
import Colors from "../../Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  loadUserAction,
  removeUserAction,
} from "../../store/authorization-slice";
import {
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MOMENTS_IMAGE_URL,
} from "@env";
import Moment, { LoadingMoment } from "../../components/Moment";
import FullMoment from "../../components/FullMoment";
import BackButton from "../../components/BackButton";
const { width } = Dimensions.get("window");
const windowWidth = width - 44;
const windowWidthForStory = width - 36;

let storyWidth = Math.floor(windowWidth / 3);
let storyHeight = Math.floor(windowWidth / 3);

const Moments = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.authorization.token);

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  const [fetchedMoments, setFetchedMoments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onLoadHandlerWithLoading = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/settings/moments/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "MOMENTS_FETCHED") {
        setFetchedMoments(response.data.fetchedMoments);
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
    onLoadHandlerWithLoading();
  }, []);

  const deleteMomentHandler = async (momentID) => {
    setIsLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/settings/moments/" + momentID,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const response = await request.json();

      if (response.status === "MOMENT_DELETED") {
        setFetchedMoments([]);
        setFetchedMoments(response.data.fetchedMoments);
      }

      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const addMomentToProfileHandler = async (momentID) => {
    setIsLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/settings/moments/" + momentID,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const response = await request.json();

      if (response.status === "MOMENT_ADDED_TO_PROFILE") {
      }

      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const [isMomentShown, setIsMomentShown] = useState(false);
  const [currentMoment, setCurrentMoment] = useState({
    _id: "",
    caption: "",
    momentImage: "",
    userDP: "",
    userName: "",
    postedOn: "",
  });
  const openMomentHandler = (
    _id,
    caption,
    momentImage,
    userDP,
    userName,
    postedOn
  ) => {
    setCurrentMoment({
      _id: _id,
      caption: caption,
      momentImage: momentImage,
      userDP: userDP,
      userName: userName,
      postedOn: postedOn,
    });
    setIsMomentShown(true);
  };
  const closeMomentHandler = () => {
    setIsMomentShown(false);
    setCurrentMoment({
      _id: "",
      caption: "",
      momentImage: "",
      userDP: "",
      userName: "",
      postedOn: "",
    });
  };

  return (
    <View style={styles.mainContainer}>
      <FullMoment
        visible={isMomentShown}
        closeModal={closeMomentHandler}
        imageSize={windowWidthForStory}
        caption={currentMoment.caption}
        momentImage={currentMoment.momentImage}
        userDP={currentMoment.userDP}
        userName={currentMoment.userName}
        postedOn={currentMoment.postedOn}
        history
        deleteMomentHandler={() => {
          closeMomentHandler();
          deleteMomentHandler(currentMoment._id);
        }}
        addToProfileHandler={() => {
          closeMomentHandler();
          addMomentToProfileHandler(currentMoment._id);
        }}
      />
      <View style={styles.innerContainer}>
        <View style={styles.upperControlsContainer}>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={styles.headingText}>Moments</Text>
        </View>
        <ScrollView
          scrollEnabled={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onLoadHandlerWithLoading}
            />
          }
        >
          <View style={styles.scrollViewInnerContainer}>
            <View style={styles.postsWrapper}>
              {isLoading && (
                <>
                  <LoadingMoment
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                  />
                  <LoadingMoment
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                  />
                  <LoadingMoment
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                  />
                  <LoadingMoment
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                  />
                  <LoadingMoment
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                  />
                  <LoadingMoment
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                  />
                  <LoadingMoment
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                  />
                  <LoadingMoment
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                  />
                  <LoadingMoment
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                  />
                </>
              )}
              {fetchedMoments.length > 0 &&
                !isLoading &&
                fetchedMoments.map((item) => (
                  <Moment
                    momentImage={item.momentImage}
                    momentDateAndTime={item.postedOn}
                    key={item._id}
                    width={storyWidth}
                    height={storyHeight}
                    style={{ marginHorizontal: 5, marginBottom: 12 }}
                    history
                    openMomentHandler={() =>
                      openMomentHandler(
                        item._id,
                        item.caption,
                        BACKEND_MOMENTS_IMAGE_URL + item.momentImage,
                        BACKEND_PROFILE_IMAGE_URL + item.userName + ".png",
                        item.userName,
                        item.postedOn
                      )
                    }
                  />
                ))}
            </View>
            {!isLoading && fetchedMoments.length <= 0 && (
              <View style={styles.emptyItemsInCategoryContainer}>
                <View style={styles.emptyItemsInCategoryIcon}>
                  <Feather name="radio" size={22} color={Colors.grey} />
                </View>
                <Text style={styles.emptyItemsInCategoryText}>
                  No Moments Yet
                </Text>
                <Text style={styles.emptyItemsInCategoryTextSmall}>
                  When you have, it will be shown here.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Moments;

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
    marginBottom: 16,
  },
  headingText: {
    fontSize: 21,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 15,
  },

  scrollViewInnerContainer: {
    marginTop: 9,
    paddingBottom: 18,
  },

  postsWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 7,
  },

  /////

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
