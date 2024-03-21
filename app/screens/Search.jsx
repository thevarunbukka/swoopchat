import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
} from "react-native";
import Colors from "../Colors";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import SearchBox from "../components/textboxes/SearchBox";
import { useSelector, useDispatch } from "react-redux";
import { loadUserAction, removeUserAction } from "../store/authorization-slice";
import {
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MEMORIES_IMAGE_URL,
} from "@env";
import LoadingSearch from "../components/Loading/LoadingSearch";
import Suggestion, { LoadingSuggestion } from "../components/Suggestion";

const { width } = Dimensions.get("window");

const SearchResult = ({ _id, fullName, onPress }) => {
  return (
    <Pressable style={styles.searchResultOuterContainer} onPress={onPress}>
      <View style={styles.searchResultInnerContainer}>
        <View style={styles.dpContainer}>
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + _id + ".png" }}
            style={styles.dp}
          />
        </View>
        <View style={styles.searchResultDataContainer}>
          <View style={styles.searchResultDataLeftContainer}>
            <Text style={styles.searchResultUserName}>{_id}</Text>
            <Text style={styles.searchResultFullName}>{fullName}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const SearchHistoryResult = ({
  _id,
  fullName,
  deleteHandler,
  goToProfileHandler,
}) => {
  const rightSwipeHandler = () => {
    return (
      <Pressable
        style={styles.basicNotificationDeleteButton}
        onPress={() => deleteHandler(_id)}
      >
        <Feather name="trash" size={23} color={Colors.white} />
      </Pressable>
    );
  };
  return (
    <GestureHandlerRootView>
      <View style={styles.basicNotificationOuter}>
        <Swipeable renderRightActions={rightSwipeHandler}>
          <View style={styles.basicNotificationInsideSwipableContainer}>
            <Pressable
              style={styles.notificationInnerContainer}
              onPress={goToProfileHandler}
            >
              <View style={styles.basicNotificationDpContainer}>
                <Image
                  source={{ uri: BACKEND_PROFILE_IMAGE_URL + _id + ".png" }}
                  style={styles.dp}
                />
              </View>
              <View style={styles.notificationDataContainer}>
                <View>
                  <Text style={styles.searchResultUserName}>{_id}</Text>
                  <Text style={styles.searchResultFullName}>{fullName}</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
};

const SearchProfilesModal = ({ visible, closeModal }) => {
  const userToken = useSelector((state) => state.authorization.token);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchedText, setSearchedText] = useState("");

  const navigation = useNavigation();

  const searchHandler = async () => {
    if (searchText.trim() !== "") {
      try {
        setIsLoading(true);
        const request = await fetch(BACKEND_URL + "/search", {
          method: "POST",
          body: JSON.stringify({
            searchText: searchText.trim(),
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        });

        const response = await request.json();

        if (response.status === "SEARCH_HISTORY_LOADED") {
          setSearchResults(response.data.searchResults);
          setSearchedText(searchText);
        }
        if (response.status === "NOT_AUTHENTICATED") {
          dispatch(removeUserAction());
        }
        if (response.status === "FAILED") {
        }
      } catch (error) {}
      setIsLoading(false);
    }
  };

  const pushToSearchHistoryHandler = async (otherUserName) => {
    try {
      const request = await fetch(BACKEND_URL + "/search/push", {
        method: "POST",
        body: JSON.stringify({
          otherUserName: otherUserName,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "PUSHED_TO_SEARCH_HISTORY") {
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalMainContainer}>
        <View style={styles.modalInnerContainer}>
          <View style={styles.searchChatsSearchBar}>
            <SearchBox
              placeholder={`Search "Rajesh Banjara"`}
              autoFocus={visible}
              style={{ marginLeft: 7, marginRight: 4 }}
              value={searchText}
              onChangeText={(txt) => setSearchText(txt)}
              onSubmitEditing={searchHandler}
            />
            <Pressable
              style={styles.closeSearchChatsModalButton}
              onPress={() => {
                setSearchedText("");
                setSearchResults([]);
                setSearchText("");
                closeModal();
              }}
            >
              <Text style={styles.closeSearchChatsModalButtonText}>Cancel</Text>
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <ScrollView
              scrollEnabled={true}
              bounces={true}
              showsVerticalScrollIndicator={false}
              style={{ marginLeft: 7, marginRight: 4 }}
            >
              <View style={{ paddingTop: 10 }}></View>
              {searchResults.length > 0 && !isLoading && (
                <>
                  <View style={styles.recentSearchesContainer}>
                    <Text style={styles.recentSearchesText}>
                      Results for "{searchedText}"
                    </Text>
                  </View>
                  {searchResults.map((item) => (
                    <SearchResult
                      key={item._id}
                      _id={item._id}
                      fullName={item.fullName}
                      onPress={() => {
                        navigation.navigate("others-profile", {
                          usernameToFetch: item._id,
                        });
                        pushToSearchHistoryHandler(item._id);
                        setSearchedText("");
                        setSearchResults([]);
                        setSearchText("");
                        closeModal();
                      }}
                    />
                  ))}

                  <View style={{ padding: 28 }}></View>
                </>
              )}

              {isLoading && (
                <>
                  <LoadingSearch />
                  <LoadingSearch />
                  <LoadingSearch />
                  <LoadingSearch />
                  <LoadingSearch />
                  <LoadingSearch />
                  <LoadingSearch />
                  <LoadingSearch />
                  <LoadingSearch />
                  <LoadingSearch />
                  <View style={{ padding: 28 }}></View>
                </>
              )}

              {searchResults.length <= 0 &&
                searchedText.trim() !== "" &&
                !isLoading && (
                  <View style={styles.emptyItemsInCategoryContainer}>
                    <View style={styles.emptyItemsInCategoryIcon}>
                      <MaterialCommunityIcons
                        name="exclamation"
                        size={28}
                        color={Colors.grey}
                      />
                    </View>
                    <Text style={styles.emptyItemsInCategoryText}>
                      No Results
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmall}>
                      No accounts found for "{searchedText}" search.
                    </Text>
                  </View>
                )}

              {searchResults.length <= 0 &&
                searchedText.trim() === "" &&
                !isLoading && (
                  <View style={styles.emptyItemsInCategoryContainer}>
                    <View style={styles.emptyItemsInCategoryIcon}>
                      <Ionicons name={"search"} size={22} color={Colors.grey} />
                    </View>
                    <Text style={styles.emptyItemsInCategoryText}>
                      Search People
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmall}>
                      Search and Follow your Friends & Family with their
                      usernames.
                    </Text>
                  </View>
                )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Search = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const fullName = useSelector((state) => state.authorization.fullName);

  const [searchHistory, setSearchHistory] = useState([]);
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isSearchProfilesModalVisible, setIsSearchProfilesModalVisible] =
    useState(false);
  const searchProfilesClickHandler = () =>
    setIsSearchProfilesModalVisible((prev) => !prev);

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  const userToken = useSelector((state) => state.authorization.token);
  const userName = useSelector((state) => state.authorization.userName);

  const onLoadHandler = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/search/load-history", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "SEARCH_HISTORY_LOADED") {
        setSearchHistory(response.data.searchHistory);
        setFetchedSuggestions(response.data.suggestions);
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
    onLoadHandler();
  }, []);

  const pullFromSearchHistoryHandler = async (otherUserName) => {
    try {
      setSearchHistory((history) => {
        const updatedSearchHistory = history.filter(
          (item) => item.userName !== otherUserName
        );
        return updatedSearchHistory;
      });
      const request = await fetch(BACKEND_URL + "/search/pull", {
        method: "POST",
        body: JSON.stringify({
          otherUserName: otherUserName,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "PULLED_FROM_SEARCH_HISTORY") {
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <SearchProfilesModal
        visible={isSearchProfilesModalVisible}
        closeModal={searchProfilesClickHandler}
      />
      <View style={styles.innerContainer}>
        <View style={styles.upperControlsContainer}>
          <View>
            <Text style={styles.headingText}>Search</Text>
          </View>
        </View>

        <ScrollView
          scrollEnabled={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onLoadHandler} />
          }
        >
          <View style={styles.searchUpperControls}>
            <SearchBox
              placeholder="Search"
              onFocus={searchProfilesClickHandler}
            />

            {/* <Pressable style={styles.cancelSearchPeopleButton}>
              <Text style={styles.cancelSearchPeopleButtonText}>Cancel</Text>
            </Pressable> */}
          </View>
          <View style={styles.suggestionMainContainer}>
            <View style={styles.suggestionLabel}>
              <Feather name="users" size={21} color={Colors.grey} />
              <Text style={styles.suggestionLabelText}>Suggestions</Text>
            </View>
            <ScrollView
              scrollEnabled={true}
              bounces={true}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginHorizontal: 6 }} />
                {!isLoading &&
                  fetchedSuggestions.map((suggestion) => (
                    <Suggestion
                      key={suggestion.userName}
                      _id={suggestion.userName}
                      userName={suggestion.userName}
                      fullName={suggestion.fullName}
                      onPress={() =>
                        navigation.navigate("others-profile", {
                          usernameToFetch: suggestion.userName,
                        })
                      }
                    />
                  ))}
                {isLoading && (
                  <>
                    <LoadingSuggestion width={width / 4} />
                    <LoadingSuggestion width={width / 4} />
                    <LoadingSuggestion width={width / 4} />
                    <LoadingSuggestion width={width / 4} />
                    <LoadingSuggestion width={width / 4} />
                  </>
                )}
                <View style={{ marginHorizontal: 2 }} />
              </View>
            </ScrollView>
          </View>
          <View style={styles.searchResultsContainer}>
            {searchHistory.length > 0 && !isLoading && (
              <View
                style={[
                  styles.recentSearchesContainer,
                  { flexDirection: "row", alignItems: "center" },
                ]}
              >
                <Feather name="search" size={20} color={Colors.grey} />
                <Text style={[styles.recentSearchesText, { marginLeft: 11 }]}>
                  Recent Searches
                </Text>
              </View>
            )}
            {searchHistory.length > 0 &&
              !isLoading &&
              searchHistory.map((item) => (
                <SearchHistoryResult
                  key={item.userName}
                  _id={item.userName}
                  fullName={item.fullName}
                  deleteHandler={pullFromSearchHistoryHandler}
                  goToProfileHandler={() =>
                    navigation.navigate("others-profile", {
                      usernameToFetch: item.userName,
                    })
                  }
                />
              ))}
            {isLoading && (
              <>
                <LoadingSearch />
                <LoadingSearch />
                <LoadingSearch />
                <LoadingSearch />
                <LoadingSearch />
                <LoadingSearch />
                <LoadingSearch />
                <LoadingSearch />
                <LoadingSearch />
                <LoadingSearch />
                <View style={{ padding: 28 }}></View>
              </>
            )}

            {searchHistory.length <= 0 && !isLoading && (
              <View style={styles.emptyItemsInCategoryContainer}>
                <View style={styles.emptyItemsInCategoryIcon}>
                  <Ionicons name={"search"} size={22} color={Colors.grey} />
                </View>
                <Text style={styles.emptyItemsInCategoryText}>
                  No Recent Searches
                </Text>
                <Text style={styles.emptyItemsInCategoryTextSmall}>
                  Your search history will be shown here.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Search;

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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headingText: {
    fontSize: 25,
    fontWeight: "600",
    color: Colors.white,
  },
  ///
  searchPeopleSearchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 9,
    paddingBottom: 12,
  },
  cancelSearchPeopleButton: {
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  cancelSearchPeopleButtonText: {
    color: Colors.yellow200,
    fontWeight: "600",
    fontSize: 16,
  },
  ///
  searchUpperControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 11,
    paddingBottom: 18,
  },
  searchResultsContainer: {
    paddingHorizontal: 12,
  },
  dpContainer: {
    marginRight: 5,
  },
  dp: {
    height: 37,
    width: 37,
    borderRadius: 3.7 * 3,
    backgroundColor: Colors.darkForLoading,
  },
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
  searchResultUserName: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.white,
    marginBottom: 1,
  },
  searchResultFullName: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.grey,
    marginRight: 1,
  },
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
  searchResultDataRightContainer: {
    alignItems: "center",
    flex: 1,
  },
  recentSearchesContainer: {
    paddingBottom: 10,
    // borderBottomWidth: 2,
    // borderColor: Colors.yellowTint,
    marginBottom: 5,
    marginTop: 8,
  },
  searchResultTextContainer: {
    paddingBottom: 8,
    // borderBottomWidth: 2,
    // borderColor: Colors.yellowTint,
    marginBottom: 10,
    marginTop: 18,
    marginHorizontal: 4,
  },
  recentSearchesText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.grey,
  },

  /////
  /// Modal styles
  modalMainContainer: {
    flex: 1,
    backgroundColor: Colors.dark200,
    paddingTop: 22,
  },
  modalInnerContainer: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: Colors.dark200,
    paddingHorizontal: 12,
  },
  searchChatsSearchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 9,
    paddingBottom: 12,
  },
  closeSearchChatsModalButton: {
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  closeSearchChatsModalButtonText: {
    color: Colors.yellow200,
    fontWeight: "600",
    fontSize: 16,
  },
  searchProfilesNoResultsContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 260,
  },
  searchProfileNoResultsText: {
    color: Colors.greyTint,
    fontWeight: "400",
    fontSize: 21,
  },

  ////

  notificationInnerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 3,
    paddingBottom: 4,
  },
  notificationDataContainer: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },

  basicNotificationOuter: {
    borderWidth: 1.5,
    borderColor: Colors.dark90,
    backgroundColor: Colors.dark100,
    borderRadius: 18,
    marginBottom: 9,
  },
  basicNotificationInsideSwipableContainer: {
    paddingHorizontal: 11,
    paddingVertical: 3,
  },
  basicNotificationDeleteButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    paddingHorizontal: 16,
    borderTopEndRadius: 18,
    borderBottomEndRadius: 18,
  },
  basicNotificationDpContainer: {
    marginRight: 6,
    marginTop: 4,
  },
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

  suggestionLabel: {
    marginHorizontal: 12,
    marginTop: 5,
    paddingHorizontal: 7,
    paddingBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionLabelText: {
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 3,
    marginLeft: 11,
  },
  suggestionMainContainer: {
    marginTop: 0,
    marginBottom: 17,
    paddingTop: 10,
    paddingBottom: 16,
    // borderTopWidth: 2,
    // borderBottomWidth: 2,
    // borderColor: Colors.dark90,
    // marginHorizontal: 12,
  },
});
