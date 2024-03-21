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
  KeyboardAvoidingView,
  FlatList,
  RefreshControl,
} from "react-native";
import Colors from "../../Colors";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import ProfileButtons from "../../components/buttons/ProfileButtons";
import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ChatsItem, { LoadingChatsItem } from "../../components/ChatsItem";
import SearchBox from "../../components/textboxes/SearchBox";
import { useSelector, useDispatch } from "react-redux";
import {
  loadUserAction,
  removeUserAction,
} from "../../store/authorization-slice";
import { BACKEND_URL, BACKEND_PROFILE_IMAGE_URL } from "@env";
import LoadingSearch from "../../components/Loading/LoadingSearch";
import ConfirmationModal from "../../components/ConfirmationModal";
import openSocket from "socket.io-client";

//   const { width } = Dimensions.get("window");
//   const windowWidth = width - 24;
//   const gap = 12;
//   const itemPerRow = 3;
//   const totalGapSize = (itemPerRow - 1) * gap;
//   const childWidth = (windowWidth - totalGapSize) / itemPerRow;

const People = ({
  createChatConfirmationModalOpenHandler,
  profilePicture,
  userName,
  fullName,
  closeModal,
}) => {
  return (
    <Pressable
      style={styles.searchResultOuterContainer}
      onPress={() => {
        createChatConfirmationModalOpenHandler(userName, fullName);
        closeModal();
      }}
    >
      <View style={styles.searchResultInnerContainer}>
        <View style={styles.dpContainer}>
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + profilePicture }}
            style={styles.dp}
          />
        </View>
        <View style={styles.searchResultDataContainer}>
          <View style={styles.searchResultDataLeftContainer}>
            <Text style={styles.searchResultUserName}>{userName}</Text>
            <Text style={styles.searchResultFullName}>{fullName}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const getFormattedTime = (mongoDate) => {
  const date = new Date(mongoDate);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

const getFormattedDate = (mongoDate) => {
  const date = new Date(mongoDate);
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
};

const SearchChatsModal = React.memo(({ visible, closeModal, chats }) => {
  const date = new Date();
  const userName = useSelector((state) => state.authorization.userName);

  const [searchedChats, setSearchedChats] = useState([]);
  useEffect(() => {
    setSearchedChats(chats);
  }, [chats]);
  const [searchValue, setSearchValue] = useState("");
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalMainContainer}>
        <View style={styles.modalInnerContainer}>
          <View style={styles.searchChatsSearchBar}>
            <SearchBox
              placeholder={`Search "Rajesh Driver"`}
              editable={false}
              style={{ marginLeft: 7, marginRight: 4 }}
              autoFocus={visible}
              value={searchValue}
              onChangeText={(txt) => {
                setSearchValue(txt.toLowerCase());
                const filteredChats = chats.filter((chat) => {
                  return (
                    chat.otherUserName.includes(txt.toLowerCase()) === true ||
                    chat.message.includes(txt.toLowerCase()) === true
                  );
                });
                setSearchedChats(filteredChats);
              }}
            />
            <Pressable
              style={styles.closeSearchChatsModalButton}
              onPress={closeModal}
            >
              <Text style={styles.closeSearchChatsModalButtonText}>Cancel</Text>
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <ScrollView
              scrollEnabled={true}
              bounces={true}
              showsVerticalScrollIndicator={false}
              style={styles.searchChatsSearchResultsContainer}
            >
              <View style={styles.chatsContainerSearch}>
                {searchedChats.length > 0 &&
                  searchedChats.map((chat) => (
                    <ChatsItem
                      key={chat._id}
                      messageID={chat._id}
                      chatID={chat.chatID}
                      otherUserName={chat.otherUserName}
                      message={
                        chat.sender === userName
                          ? "You" +
                            ": " +
                            (chat.type === "IMAGE"
                              ? "Sent an Image."
                              : chat.message)
                          : chat.sender +
                            ": " +
                            (chat.type === "IMAGE"
                              ? "Sent an Image."
                              : chat.message)
                      }
                      profilePicture={
                        BACKEND_PROFILE_IMAGE_URL + chat.otherUserName + ".png"
                      }
                      time={
                        getFormattedDate(chat.createdAt) ===
                        getFormattedDate(date)
                          ? getFormattedTime(chat.createdAt)
                          : getFormattedDate(chat.createdAt)
                      }
                      closeModal={closeModal}
                    />
                  ))}

                {searchedChats.length <= 0 && (
                  <View style={styles.emptyItemsInCategoryContainer}>
                    <View style={styles.emptyItemsInCategoryIconChats}>
                      <Feather
                        name="message-square"
                        size={28}
                        color={Colors.grey}
                      />
                    </View>
                    <Text style={styles.emptyItemsInCategoryTextChats}>
                      No Chats
                    </Text>
                    <Text style={styles.emptyItemsInCategoryTextSmallChats}>
                      When you will have, it will be shown here.
                    </Text>
                  </View>
                )}
              </View>

              {/* <View style={{ padding: 28 }}></View> */}

              {/* {false && (
                <View style={styles.searchChatsNoResultsContainer}>
                  <Text style={styles.searchChatsNoResultsText}>
                    No Results
                  </Text>
                </View>
              )} */}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const NewChatModal = ({
  visible,
  closeModal,
  loadedPeople,
  createChatConfirmationModalOpenHandler,
  isLoading,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <Pressable
        onPress={closeModal}
        style={[styles.amodalCloseContainer]}
      ></Pressable>
      <KeyboardAvoidingView
        style={styles.amodalMainContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.amodalInnerContainer}>
          <View style={styles.amodalUpperControlsContainer}>
            <Text style={styles.amodalHeadingText}>New Chat</Text>
          </View>
          <View
            style={styles.amodalPeopleContainer}
            // showsVerticalScrollIndicator={false}
            // scrollEnabled={true}
            // bounces={true}
          >
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
              </>
            )}
            {!isLoading && (
              <FlatList
                style={{ flex: 1, paddingTop: 18 }}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                data={loadedPeople}
                bounces={true}
                renderItem={(people) => {
                  return (
                    <People
                      key={people.item._id}
                      userName={people.item._id}
                      fullName={
                        people.item.firstName + " " + people.item.lastName
                      }
                      profilePicture={people.item.profilePicture}
                      createChatConfirmationModalOpenHandler={
                        createChatConfirmationModalOpenHandler
                      }
                      closeModal={closeModal}
                    />
                  );
                }}
              />
            )}
            {!isLoading && loadedPeople.length <= 0 && (
              <View style={styles.emptyItemsInCategoryContainer}>
                <View style={styles.emptyItemsInCategoryIcon}>
                  <Ionicons
                    name="people-outline"
                    size={22}
                    color={Colors.grey}
                  />
                </View>
                <Text style={styles.emptyItemsInCategoryText}>No People</Text>
                <Text style={styles.emptyItemsInCategoryTextSmall}>
                  You can tag people in your followers and followings.
                </Text>
              </View>
            )}
            <View style={{ padding: 16 }}></View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const ChatsRoot = ({ route }) => {
  const socket = useMemo(() => openSocket("http://172.20.10.2:4000/"), []);
  const navigation = useNavigation();

  const date = new Date();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authorization.token);
  const userName = useSelector((state) => state.authorization.userName);
  useEffect(() => {
    dispatch(loadUserAction());
  }, []);
  useEffect(() => {
    socket.emit("JOIN_ALL_CHATS", { authenticatedUserId: userName });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (route.params) {
      console.log("ENTERED");
      navigation.navigate("chat", {
        otherUserName: route.params.otherUserName,
        chatID: route.params.chatID,
      });
    }
  }, [route.params]);

  const [isSearchChatsModalVisible, setIsSearchChatsModalVisible] =
    useState(false);
  const searchChatsClickHandler = () =>
    setIsSearchChatsModalVisible((prev) => !prev);

  const [isAddPeopleModelShown, setIsAddPeopleModelShown] = useState(false);
  const addPeopleModelToggleHandler = () => {
    setIsAddPeopleModelShown((prev) => !prev);
  };
  const [isChatsLoading, setIsChatsLoading] = useState(false);
  const [isAddPeopleLoading, setIsAddPeopleLoading] = useState(false);
  const [loadedPeople, setLoadedPeople] = useState([]);

  const onAddPeopleLoadHandler = async () => {
    setIsAddPeopleLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/post/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const response = await request.json();

      if (response.status === "PEOPLE_FETCHED") {
        setLoadedPeople(response.data.loadedPeople);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        // setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {
      // setEmailOrUsernameError("Unable to reach the server.");
    }
    setIsAddPeopleLoading(false);
  };

  const [
    isCreateChatConfirmationModalShown,
    setIsCreateChatConfirmationModalShown,
  ] = useState(false);
  const createChatConfirmationModalCloseHandler = () => {
    setIsCreateChatConfirmationModalShown(false);
    setCreateChatWithWhome({ _id: "", fullName: "" });
  };
  const createChatConfirmationModalOpenHandler = (_id, fullName) => {
    setIsCreateChatConfirmationModalShown(true);
    setCreateChatWithWhome({ _id: _id, fullName: fullName });
  };
  const [createChatWithWhome, setCreateChatWithWhome] = useState({
    _id: "",
    fullName: "",
  });

  const [chats, setChats] = useState([]);

  const onLoadHandler = async () => {
    try {
      const request = await fetch(BACKEND_URL + "/chat/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const response = await request.json();
      if (response.status === "CHATS_FETCHED") {
        setChats(response.data.chats);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {}
  };

  const onLoadHandlerWithLoading = async () => {
    setIsChatsLoading(true);
    await onLoadHandler();
    setIsChatsLoading(false);
  };

  const [isConfirmationModalLoading, setIsConfirmationModalLoading] =
    useState(false);

  const createNewChatHandler = async (otherUserName) => {
    setIsConfirmationModalLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/chat/create-new/", {
        method: "POST",
        body: JSON.stringify({
          otherUserName,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const response = await request.json();
      if (response.status === "ALREADY_EXISTS") {
        createChatConfirmationModalCloseHandler();
        navigation.navigate("chat", {
          otherUserName: otherUserName,
          chatID: response.data.chatID,
        });
      }
      if (response.status === "NEW_CHAT_CREATED") {
        createChatConfirmationModalCloseHandler();
        navigation.navigate("chat", {
          otherUserName: otherUserName,
          chatID: response.data.chatID,
        });
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
      }
    } catch (error) {
      console.log(error);
    }
    setIsConfirmationModalLoading(false);
  };

  useEffect(() => {
    onAddPeopleLoadHandler();
    onLoadHandlerWithLoading();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     onLoadHandlerWithLoading();
  //     return () => onLoadHandlerWithLoading();
  //   }, [])
  // );

  useEffect(() => {
    socket.on("REFRESH_YOUR_CHATS", () => {
      socket.emit("REFRESH_CHATS", { authenticatedUserId: userName });
      console.log("REFRESH_YOUR_CHATS");
    });
    socket.on("REFRESHED_CHATS", (data) => {
      setChats(data);
    });
    socket.on("NEW_CHAT", (data) => {
      for (let id of data) {
        if (id == userName) {
          socket.emit("REFRESH_CHATS", { authenticatedUserId: userName });
          socket.emit("JOIN_ALL_CHATS", { authenticatedUserId: userName });
          console.log("NEW_CHAT");
        }
      }
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <SearchChatsModal
        visible={isSearchChatsModalVisible}
        closeModal={searchChatsClickHandler}
        chats={chats}
      />
      <ConfirmationModal
        visible={isCreateChatConfirmationModalShown}
        closeModal={createChatConfirmationModalCloseHandler}
        confirmButtonText="Start Chat"
        confirmButtonTextColor={Colors.yellow200}
        confirmButtonHandler={() =>
          createNewChatHandler(createChatWithWhome._id)
        }
        modelFlex={0.7}
        isConfirmationModalLoading={isConfirmationModalLoading}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            flex: 1,
          }}
        >
          {createChatWithWhome !== null && (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 9,
                }}
              >
                <Image
                  style={{
                    height: 69,
                    width: 69,
                    borderRadius: 6.9 * 3,
                    marginTop: 3,
                    backgroundColor: Colors.darkForLoading,
                  }}
                  source={{
                    uri:
                      BACKEND_PROFILE_IMAGE_URL +
                      createChatWithWhome._id +
                      ".png",
                  }}
                />
              </View>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: "600",
                  marginBottom: 1,
                  textAlign: "center",
                }}
              >
                {createChatWithWhome.fullName}
              </Text>

              <Text
                style={{
                  color: Colors.grey,
                  fontSize: 16,
                  fontWeight: "500",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Are you sure you want to start a new chat with @
                {createChatWithWhome._id}.
              </Text>
            </View>
          )}
        </View>
      </ConfirmationModal>

      <NewChatModal
        visible={isAddPeopleModelShown}
        closeModal={addPeopleModelToggleHandler}
        loadedPeople={loadedPeople}
        isLoading={isAddPeopleLoading}
        createChatConfirmationModalOpenHandler={
          createChatConfirmationModalOpenHandler
        }
      />
      <View style={styles.innerContainer}>
        <View style={styles.upperControlsContainer}>
          <View>
            <Text style={styles.headingText}>Chats</Text>
          </View>
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
          <View style={styles.chatControlsContainer}>
            <View style={styles.chatUpperControls}>
              <SearchBox
                placeholder="Search"
                editable={false}
                onFocus={searchChatsClickHandler}
              />
              <Pressable
                style={styles.chatUpperControl}
                onPress={() => {
                  onAddPeopleLoadHandler();
                  addPeopleModelToggleHandler();
                }}
              >
                <Feather name="plus" size={35} color={Colors.white} />
              </Pressable>
            </View>
            <View style={styles.chatSeparator} />
          </View>
          <View style={styles.chatsContainer}>
            {!isChatsLoading &&
              chats.length > 0 &&
              chats.map((chat) => (
                <ChatsItem
                  key={chat._id}
                  messageID={chat._id}
                  chatID={chat.chatID}
                  otherUserName={chat.otherUserName}
                  message={
                    chat.sender === userName
                      ? "You" +
                        ": " +
                        (chat.type === "IMAGE"
                          ? "Sent an Image."
                          : chat.message)
                      : chat.sender +
                        ": " +
                        (chat.type === "IMAGE"
                          ? "Sent an Image."
                          : chat.message)
                  }
                  profilePicture={
                    BACKEND_PROFILE_IMAGE_URL + chat.otherUserName + ".png"
                  }
                  time={
                    getFormattedDate(chat.createdAt) === getFormattedDate(date)
                      ? getFormattedTime(chat.createdAt)
                      : getFormattedDate(chat.createdAt)
                  }
                  onPress={() =>
                    navigation.navigate("chat", {
                      otherUserName: chat.otherUserName,
                      chatID: chat.chatID,
                    })
                  }
                />
              ))}
            {isChatsLoading && (
              <>
                <LoadingChatsItem />
                <LoadingChatsItem />
                <LoadingChatsItem />
                <LoadingChatsItem />
                <LoadingChatsItem />
                <LoadingChatsItem />
                <LoadingChatsItem />
              </>
            )}
            {!isChatsLoading && chats.length <= 0 && (
              <View style={styles.emptyItemsInCategoryContainer}>
                <View style={styles.emptyItemsInCategoryIconChats}>
                  <Feather
                    name="message-square"
                    size={28}
                    color={Colors.grey}
                  />
                </View>
                <Text style={styles.emptyItemsInCategoryTextChats}>
                  No Chats
                </Text>
                <Text style={styles.emptyItemsInCategoryTextSmallChats}>
                  When you will have, it will be shown here.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ChatsRoot;

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

  dpAndCategoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  chatControlsContainer: {
    paddingHorizontal: 12,
    marginTop: 11,
  },
  chatUpperControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatUpperControl: {
    marginLeft: 8,
    marginRight: 3,
    alignItems: "center",
    marginBottom: 6,
  },
  chatSeparator: {
    marginVertical: 11,
  },
  // chatLowerControls: {
  //   borderBottomWidth: 1,
  //   borderColor: Colors.yellowTint,
  //   paddingBottom: 8,
  //   marginTop: 14,
  //   marginBottom: 12,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
  // chatLowerControl: {
  //   marginLeft: 6,
  //   marginRight: 3,
  //   alignItems: "center",
  //   paddingTop: 4,
  //   paddingBottom: 5,
  // },
  // chatLowerControlText: {
  //   color: Colors.yellow200,
  //   fontWeight: "500",
  //   fontSize: 15,
  // },
  chatsContainer: { paddingHorizontal: 12 },
  chatsContainerSearch: { paddingHorizontal: 7 },
  //
  //
  modalMainContainer: {
    flex: 1,
    backgroundColor: Colors.dark150,
    paddingTop: 22,
  },
  modalInnerContainer: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: Colors.dark100,
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
  searchChatsSearchResultsContainer: {
    paddingTop: 18,
    flex: 1,
  },
  searchChatsNoResultsContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 280,
  },
  searchChatsNoResultsText: {
    color: Colors.greyTint,
    fontWeight: "400",
    fontSize: 21,
  },

  // //
  amodalCloseContainer: {
    flex: 1,
  },
  amodalMainContainer: {
    flex: 2.5,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },
  amodalInnerContainer: {
    flex: 1,
    backgroundColor: Colors.dark95,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },
  amodalUpperControlsContainer: {
    paddingVertical: 14,
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderColor: Colors.dark80,
    backgroundColor: Colors.dark95,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },
  amodalHeadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
  },
  amodalPeopleContainer: {
    marginHorizontal: 11,
    flex: 1,
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
    borderColor: Colors.dark60,
    backgroundColor: Colors.dark92,

    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
    marginBottom: 8,
  },
  searchResultInnerContainer: { flexDirection: "row", alignItems: "center" },
  searchResultUserName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.white,
    marginBottom: 1,
  },
  searchResultFullName: {
    fontSize: 13,
    fontWeight: "300",
    color: Colors.white,
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

  //

  emptyItemsInCategoryIconChats: {
    borderColor: Colors.grey,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    width: 55,
    borderRadius: 55,
  },
  emptyItemsInCategoryTextChats: {
    marginTop: 10,
    color: Colors.grey,
    fontSize: 18,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  emptyItemsInCategoryTextSmallChats: {
    marginTop: 8,
    color: Colors.grey,
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginHorizontal: 9,
  },
});
