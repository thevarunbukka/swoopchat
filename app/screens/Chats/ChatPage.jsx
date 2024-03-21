import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  TextInput,
  RefreshControl,
} from "react-native";
import Colors from "../../Colors";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import ProfileButtons from "../../components/buttons/ProfileButtons";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  loadUserAction,
  removeUserAction,
} from "../../store/authorization-slice";
import {
  BACKEND_URL,
  BACKEND_PROFILE_IMAGE_URL,
  BACKEND_MEMORIES_IMAGE_URL,
  BACKEND_CHATS_IMAGE_URL,
} from "@env";
import BackButton from "../../components/BackButton";
import FullMoment from "../../components/FullMoment";
import ConfirmationModal from "../../components/ConfirmationModal";
import * as ImagePicker from "expo-image-picker";

import openSocket from "socket.io-client";

const { width } = Dimensions.get("window");
const windowWidthForStory = width - 36;
let imageWidth = width - 22;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MessageSent = ({
  _id,
  sender,
  message,
  style,
  continuation,
  manageMessageHandler,
  isReplyMessage,
  date,
  replySender,
  replyMessage,
  replyMessageID,
  replyType,
}) => {
  return (
    <>
      {isReplyMessage && (
        <View style={styles.replyMessageSentContainer}>
          <View style={styles.replyMessageSentOuterContainer}>
            <Text
              style={[
                styles.replyMessageSenderText,
                { marginBottom: 6, marginRight: 8 },
              ]}
            >
              {replySender}
            </Text>
            {replyType === "MESSAGE" && (
              <View style={styles.replyMessageSentInnerContainer}>
                <Text style={styles.replyMessageSentText}>{replyMessage}</Text>
              </View>
            )}
            {replyType === "IMAGE" && (
              <Image
                source={{
                  uri: BACKEND_CHATS_IMAGE_URL + replyMessage,
                }}
                style={[
                  styles.sentImageForManageMessage,
                  styles.genericReplyImage,
                ]}
              />
            )}
          </View>
        </View>
      )}
      <View
        style={[
          styles.messageSentContainer,
          {
            marginBottom: continuation ? 4 : 10,
          },
        ]}
      >
        {manageMessageHandler && (
          <Pressable onPress={manageMessageHandler}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={21}
              color={Colors.grey}
              style={{ padding: 4 }}
            />
          </Pressable>
        )}
        <View>
          <View
            style={[
              styles.messageSentInnerContainer,
              { borderBottomRightRadius: continuation ? 21 : 0 },
            ]}
          >
            <Text style={styles.messageSentText}>{message}</Text>
            <Text style={styles.messageTimestampText}>{date}</Text>
          </View>
        </View>
        {!continuation && (
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + sender + ".png" }}
            style={styles.senderRecieverDP}
          />
        )}
        {continuation && <View style={styles.emptyDP} />}
      </View>
    </>
  );
};
const MessageRecieved = ({
  sender,
  _id,
  message,
  style,
  continuation,
  manageMessageHandler,
  isReplyMessage,
  date,
  replySender,
  replyMessage,
  replyMessageID,
  manageStyle,
  replyType,
}) => {
  return (
    <>
      {isReplyMessage && (
        <View style={styles.replyMessageRecievedContainer}>
          <View style={styles.replyMessageRecievedOuterContainer}>
            <Text
              style={[
                styles.replyMessageSenderText,
                { marginBottom: 5, marginLeft: 8 },
              ]}
            >
              {replySender}
            </Text>

            {replyType === "MESSAGE" && (
              <View style={styles.replyMessageRecievedInnerContainer}>
                <Text style={styles.replyMessageSentText}>{replyMessage}</Text>
              </View>
            )}
            {replyType === "IMAGE" && (
              <Image
                source={{
                  uri: BACKEND_CHATS_IMAGE_URL + replyMessage,
                }}
                style={[
                  styles.recievedImageForManageMessage,
                  styles.genericReplyImage,
                ]}
              />
            )}
          </View>
        </View>
      )}
      <View
        style={[
          styles.messageRecievedContainer,
          { marginBottom: continuation ? 4 : 10 },
        ]}
      >
        {!continuation && (
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + sender + ".png" }}
            style={styles.senderRecieverDP}
          />
        )}
        {continuation && <View style={styles.emptyDP} />}
        <View
          style={[
            styles.messageRecievedInnerContainer,
            { borderBottomLeftRadius: continuation ? 21 : 0 },
            manageStyle && { backgroundColor: Colors.dark40 },
          ]}
        >
          <Text style={styles.messageRecievedText}>{message}</Text>
          <Text
            style={[styles.messageTimestampText, { alignSelf: "flex-start" }]}
          >
            {date}
          </Text>
        </View>
        {manageMessageHandler && (
          <Pressable onPress={manageMessageHandler}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={21}
              color={Colors.grey}
              style={{ padding: 4 }}
            />
          </Pressable>
        )}
      </View>
    </>
  );
};
const SystemMessage = ({ text }) => {
  return (
    <View style={styles.systemMessageContainer}>
      <View style={styles.dateOfMessageInnerContainer}>
        <Text style={styles.dateOfMessageText}>{text}</Text>
      </View>
    </View>
  );
};
const DateOfMessage = ({ text }) => {
  return (
    <View style={styles.dateOfMessageContainer}>
      <View style={styles.dateOfMessageInnerContainer}>
        <Text style={styles.dateOfMessageText}>{text}</Text>
      </View>
    </View>
  );
};
const ImageSent = ({
  sender,
  _id,
  message,
  style,
  continuation,
  onPress,
  manageMessageHandler,
  date,
  isReplyMessage,
  replySender,
  replyMessage,
  replyMessageID,
  replyType,
}) => {
  return (
    <>
      {isReplyMessage && (
        <View style={styles.replyMessageSentContainer}>
          <View style={styles.replyMessageSentOuterContainer}>
            <Text
              style={[
                styles.replyMessageSenderText,
                { marginBottom: 6, marginRight: 8 },
              ]}
            >
              {replySender}
            </Text>
            {replyType === "MESSAGE" && (
              <View style={styles.replyMessageSentInnerContainer}>
                <Text style={styles.replyMessageSentText}>{replyMessage}</Text>
              </View>
            )}
            {replyType === "IMAGE" && (
              <Image
                source={{
                  uri: BACKEND_CHATS_IMAGE_URL + replyMessage,
                }}
                style={[
                  styles.sentImageForManageMessage,
                  styles.genericReplyImage,
                ]}
              />
            )}
          </View>
        </View>
      )}
      <View
        style={[
          styles.messageSentContainer,
          { marginBottom: continuation ? 4 : 12 },
        ]}
      >
        {manageMessageHandler && (
          <Pressable onPress={manageMessageHandler}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={21}
              color={Colors.grey}
              style={{ padding: 4 }}
            />
          </Pressable>
        )}
        <Pressable
          style={[
            styles.imageSentInnerContainer,
            { borderBottomRightRadius: continuation ? 21 : 0 },
          ]}
          onPress={onPress}
        >
          <Image
            source={{ uri: BACKEND_CHATS_IMAGE_URL + message }}
            style={[
              styles.sentImage,
              { borderBottomRightRadius: continuation ? 21 : 0 },
            ]}
          />
          <View
            style={[
              styles.imageTimestampTextContainer,
              { bottom: 9, right: 8 },
            ]}
          >
            <Text style={styles.imageTimestampText}>{date}</Text>
          </View>
        </Pressable>
        {!continuation && (
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + sender + ".png" }}
            style={styles.senderRecieverDP}
          />
        )}
        {continuation && <View style={styles.emptyDP} />}
      </View>
    </>
  );
};
const ImageRecieved = ({
  sender,
  _id,
  message,
  style,
  continuation,
  onPress,
  manageMessageHandler,
  date,
  isReplyMessage,
  replySender,
  replyMessage,
  replyMessageID,
  replyType,
}) => {
  return (
    <>
      {isReplyMessage && (
        <View style={styles.replyMessageRecievedContainer}>
          <View style={styles.replyMessageRecievedOuterContainer}>
            <Text
              style={[
                styles.replyMessageSentText,
                { marginBottom: 5, marginLeft: 8 },
              ]}
            >
              {replySender}
            </Text>

            {replyType === "MESSAGE" && (
              <View style={styles.replyMessageRecievedInnerContainer}>
                <Text style={styles.replyMessageSentText}>{replyMessage}</Text>
              </View>
            )}
            {replyType === "IMAGE" && (
              <Image
                source={{
                  uri: BACKEND_CHATS_IMAGE_URL + replyMessage,
                }}
                style={[
                  styles.recievedImageForManageMessage,
                  styles.genericReplyImage,
                ]}
              />
            )}
          </View>
        </View>
      )}
      <View
        style={[
          styles.messageRecievedContainer,
          { marginBottom: continuation ? 4 : 12 },
        ]}
      >
        {!continuation && (
          <Image
            source={{ uri: BACKEND_PROFILE_IMAGE_URL + sender + ".png" }}
            style={styles.senderRecieverDP}
          />
        )}
        {continuation && <View style={styles.emptyDP} />}
        <Pressable
          style={[
            styles.imageRecievedInnerContainer,
            { borderBottomLeftRadius: continuation ? 21 : 0 },
          ]}
          onPress={onPress}
        >
          <Image
            source={{ uri: BACKEND_CHATS_IMAGE_URL + message }}
            style={[
              styles.recievedImage,
              { borderBottomLeftRadius: continuation ? 21 : 0 },
            ]}
          />
          <View
            style={[
              styles.imageTimestampTextContainer,
              {
                bottom: 9,
                left: 8,
              },
            ]}
          >
            <Text style={styles.imageTimestampText}>{date}</Text>
          </View>
        </Pressable>
        {manageMessageHandler && (
          <Pressable onPress={manageMessageHandler}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={21}
              color={Colors.grey}
              style={{ padding: 4 }}
            />
          </Pressable>
        )}
      </View>
    </>
  );
};

const ChatPage = ({ route }) => {
  const [message, setMessage] = useState("");
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const chatsScrollRef = useRef();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.authorization.userName);
  const token = useSelector((state) => state.authorization.token);
  const [isReplyingToMessage, setIsReplyingToMessage] = useState(null);
  const replyToMessageClickHandler = (messageID, sender, message, type) => {
    setIsReplyingToMessage({ messageID, sender, message, type });
    setIsEditingMessage(null);
    manageMessagesCloseHandler();
  };
  const replyToMessageCloseHandler = () => setIsReplyingToMessage(null);

  const [isEditingMessage, setIsEditingMessage] = useState(null);
  const editMessageClickHandler = (messageID, sender, message, type) => {
    setIsEditingMessage({ messageID, sender, message, type });
    setMessage(currentManagingMessages.message);
    setIsReplyingToMessage(null);
    setImageToSend(null);
    manageMessagesCloseHandler();
  };
  const editMessageCloseHandler = () => setIsEditingMessage(null);

  const navigation = useNavigation();

  // chatsScrollRef.current.scrollTo

  const [otherFullName, setOtherFullName] = useState("Loading...");

  const [isImageInChatShown, setIsImageInChatShown] = useState(false);
  const [currentImageInChat, setCurrentImageInChat] = useState({
    imageURL: "",
    sender: "",
    date: "",
  });
  const openImageInChatHandler = (imageURL, sender, date) => {
    setCurrentImageInChat({
      imageURL: imageURL,
      sender: sender,
      date: date,
    });
    setIsImageInChatShown(true);
  };
  const closeImageInChatHandler = () => {
    setIsImageInChatShown(false);
    setCurrentImageInChat({
      imageURL: "",
      sender: "",
      date: "",
    });
  };

  const [isManageMessagesShown, setIsManageMessagesShown] = useState(false);
  const [currentManagingMessages, setCurrentManagingMessages] = useState({
    messageID: "",
    message: "",
    type: "",
    sender: "",
    time: "",
  });

  const manageMessagesOpenHandler = (
    messageID,
    message,
    type,
    sender,
    time
  ) => {
    setIsManageMessagesShown(true);
    setCurrentManagingMessages({
      messageID: messageID,
      message: message,
      type: type,
      sender: sender,
      time: time,
    });
  };

  const manageMessagesCloseHandler = () => {
    setIsManageMessagesShown(false);
    setCurrentManagingMessages({
      messageID: "",
      message: "",
      type: "",
      sender: "",
      time: "",
    });
  };

  const [imageToSend, setImageToSend] = useState(null);
  const chooseImageToSendHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageToSend(result.assets[0].uri);
      setIsEditingMessage(null);
    }
  };

  const closeImageToSendHandler = () => {
    setImageToSend(null);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onLoadHandler = async () => {
    try {
      const request = await fetch(
        BACKEND_URL +
          "/chat/" +
          route.params.chatID +
          "/" +
          route.params.otherUserName,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();

      if (response.status === "MESSAGES_FETCHED") {
        setOtherFullName(response.data.otherFullName);
        setFetchedMessages(response.data.messages);
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        //
      }
    } catch (error) {
      console.log(error);
    }
  };

  const socket = useMemo(() => openSocket("http://172.20.10.2:4000/"), []);

  useEffect(() => {
    socket.emit("JOIN_INDIVIDUAL_CHAT", route.params.chatID);
    onLoadHandler();
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessageHandler = async () => {
    if (isEditingMessage !== null) {
      try {
        const data = {
          chatID: route.params.chatID,
          editedMessage: message,
          messageID: isEditingMessage.messageID,
          authenticatedUserId: userName,
        };
        socket.emit("EDIT_MESSAGE", data);
      } catch (error) {
        console.log(error);
      }
    }
    if (isEditingMessage === null) {
      if (imageToSend !== null) {
        try {
          const formData = new FormData();
          formData.append("chatID", route.params.chatID);
          let chatImageID = Math.floor(
            Math.random() * 100000000000000 + 1
          ).toString();
          formData.append("chatImageID", chatImageID);
          formData.append("chatImage", {
            name: chatImageID + ".png",
            type: "image/png",
            uri: imageToSend,
          });

          if (isReplyingToMessage !== null) {
            formData.append("isReplying", JSON.stringify(isReplyingToMessage));
          }
          const request = await fetch(BACKEND_URL + "/chat/send-image/", {
            method: "POST",
            body: formData,
            headers: {
              "content-type": "multipart/form-data",
              Authorization: "Bearer " + token,
            },
          });

          const response = await request.json();

          if (response.status === "IMAGE_SENT") {
          }
          if (response.status === "NOT_AUTHENTICATED") {
            dispatch(removeUserAction());
          }
          if (response.status === "FAILED") {
          }
          if (isReplyingToMessage !== null) {
            setIsReplyingToMessage(null);
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (message.trim() !== "") {
        try {
          let messageID = Math.floor(
            Math.random() * 100000000000000 + 1
          ).toString();
          const data = {
            chatID: route.params.chatID,
            message: message,
            messageID: messageID,
            authenticatedUserId: userName,
          };
          if (isReplyingToMessage !== null) {
            data["isReplying"] = isReplyingToMessage;
          }
          socket.emit("SEND_MESSAGE", data);
        } catch (error) {
          console.log(error);
        }
      }
    }

    setMessage("");
    setImageToSend(null);
    editMessageCloseHandler();
    replyToMessageCloseHandler();
  };

  const deleteMessageHandler = async (messageID) => {
    try {
      const data = {
        authenticatedUserId: userName,
        chatID: route.params.chatID,
        messageID: messageID,
      };
      socket.emit("DELETE_MESSAGE", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("INCOMING_MESSAGE", (message) => {
      setFetchedMessages((messages) => [...messages, message]);
      console.log("entered here");
    });
    socket.on("MESSAGE_IS_DELETED", ({ messageID }) => {
      setFetchedMessages((messages) => {
        const updatedMessages = messages.filter(
          (message) => message._id !== messageID
        );
        return updatedMessages;
      });
    });
    socket.on("MESSAGE_IS_EDITED", (data) => {
      setFetchedMessages((messages) => {
        const updatedMessages = messages.map((message) => {
          if (message._id === data._id) {
            return data;
          } else {
            return message;
          }
        });
        return updatedMessages;
      });
    });
    socket.on("CHAT_CLEARED", (message) => {
      setFetchedMessages(message);
    });
  }, []);

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
      date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
    );
  };

  const RenderedMessages = useMemo(
    () => () => {
      let prevDate = null;
      return fetchedMessages.map((message, index) => {
        const currentDate = getFormattedDate(message.createdAt);
        const shouldRenderTime = currentDate !== prevDate;
        prevDate = currentDate;
        const nextMessage = fetchedMessages[index + 1];
        const isContinuation =
          nextMessage &&
          nextMessage.sender === message.sender &&
          currentDate === getFormattedDate(nextMessage.createdAt);

        return (
          <React.Fragment key={message._id}>
            {shouldRenderTime && (
              <DateOfMessage key={currentDate} text={currentDate} />
            )}
            {message.type === "SYSTEM" ? (
              <SystemMessage key={message._id} text={message.message} />
            ) : message.type === "MESSAGE" ? (
              message.sender === userName ? (
                <MessageSent
                  key={message._id}
                  _id={message._id}
                  sender={message.sender}
                  message={message.message}
                  continuation={isContinuation}
                  date={getFormattedTime(message.createdAt)}
                  isReplyMessage={message.reply ? true : false}
                  replySender={
                    message.reply &&
                    (message.reply.sender === userName
                      ? "You"
                      : message.reply.sender)
                  }
                  replyMessage={message.reply && message.reply.message}
                  replyType={message.reply && message.reply.type}
                  replyMessageID={message.reply && message.reply.messageID}
                  manageMessageHandler={() =>
                    manageMessagesOpenHandler(
                      message._id,
                      message.message,
                      message.type,
                      message.sender,
                      getFormattedTime(message.createdAt)
                    )
                  }
                />
              ) : (
                <MessageRecieved
                  key={message._id}
                  _id={message._id}
                  sender={message.sender}
                  message={message.message}
                  continuation={isContinuation}
                  date={getFormattedTime(message.createdAt)}
                  isReplyMessage={message.reply ? true : false}
                  replySender={
                    message.reply &&
                    (message.reply.sender === userName
                      ? "You"
                      : message.reply.sender)
                  }
                  replyMessage={message.reply && message.reply.message}
                  replyType={message.reply && message.reply.type}
                  replyMessageID={message.reply && message.reply.messageID}
                  manageMessageHandler={() =>
                    manageMessagesOpenHandler(
                      message._id,
                      message.message,
                      message.type,
                      message.sender,
                      getFormattedTime(message.createdAt)
                    )
                  }
                />
              )
            ) : message.type === "IMAGE" ? (
              message.sender === userName ? (
                <ImageSent
                  key={message._id}
                  _id={message._id}
                  sender={message.sender}
                  message={message.message}
                  continuation={isContinuation}
                  date={getFormattedTime(message.createdAt)}
                  onPress={() =>
                    openImageInChatHandler(
                      message.message,
                      message.sender,
                      message.createdAt
                    )
                  }
                  isReplyMessage={message.reply ? true : false}
                  replySender={
                    message.reply &&
                    (message.reply.sender === userName
                      ? "You"
                      : message.reply.sender)
                  }
                  replyMessage={message.reply && message.reply.message}
                  replyType={message.reply && message.reply.type}
                  replyMessageID={message.reply && message.reply.messageID}
                  manageMessageHandler={() =>
                    manageMessagesOpenHandler(
                      message._id,
                      message.message,
                      message.type,
                      message.sender,
                      getFormattedTime(message.createdAt)
                    )
                  }
                />
              ) : (
                <ImageRecieved
                  key={message._id}
                  _id={message._id}
                  sender={message.sender}
                  message={message.message}
                  continuation={isContinuation}
                  date={getFormattedTime(message.createdAt)}
                  onPress={() =>
                    openImageInChatHandler(
                      message.message,
                      message.sender,
                      message.createdAt
                    )
                  }
                  isReplyMessage={message.reply ? true : false}
                  replySender={
                    message.reply &&
                    (message.reply.sender === userName
                      ? "You"
                      : message.reply.sender)
                  }
                  replyMessage={message.reply && message.reply.message}
                  replyType={message.reply && message.reply.type}
                  replyMessageID={message.reply && message.reply.messageID}
                  manageMessageHandler={() =>
                    manageMessagesOpenHandler(
                      message._id,
                      message.message,
                      message.type,
                      message.sender,
                      getFormattedTime(message.createdAt)
                    )
                  }
                />
              )
            ) : (
              <View key={message._id}></View>
            )}
          </React.Fragment>
        );
      });
    },
    [fetchedMessages]
  );
  useEffect(() => {
    chatsScrollRef.current.scrollToEnd({ animated: true });
  }, [RenderedMessages]);

  const modelFlex = useMemo(() => {
    if (currentManagingMessages.sender === userName) {
      if (currentManagingMessages.type === "MESSAGE") {
        return 0.55;
      } else {
        return 0.55;
      }
    } else {
      if (currentManagingMessages.type === "MESSAGE") {
        return 0.3;
      } else {
        return 0.42;
      }
    }
  }, [currentManagingMessages]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.upperControlsContainer}>
          <ConfirmationModal
            visible={isManageMessagesShown}
            closeModal={manageMessagesCloseHandler}
            confirmButtonTextColor={Colors.yellow200}
            modelFlex={modelFlex}
          >
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                flex: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <View
                  style={{
                    paddingTop: 5,
                    // paddingBottom: 18,
                    marginHorizontal: -5,
                    marginTop: "auto",
                    // marginBottom: "auto",
                  }}
                >
                  {currentManagingMessages.type === "MESSAGE" &&
                    (currentManagingMessages.sender === userName ? (
                      <MessageSent
                        _id={currentManagingMessages.messageID}
                        sender={currentManagingMessages.sender}
                        message={currentManagingMessages.message}
                        // date={currentManagingMessages.time}
                        continuation={false}
                      />
                    ) : (
                      <MessageRecieved
                        _id={currentManagingMessages.messageID}
                        sender={currentManagingMessages.sender}
                        message={currentManagingMessages.message}
                        // date={currentManagingMessages.time}
                        continuation={false}
                        manageStyle
                      />
                    ))}
                  {currentManagingMessages.type === "IMAGE" &&
                    (currentManagingMessages.sender !== userName ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "flex-end",
                          paddingTop: 5,
                          paddingBottom: 8,
                        }}
                      >
                        <Image
                          source={{
                            uri:
                              BACKEND_PROFILE_IMAGE_URL +
                              currentManagingMessages.sender +
                              ".png",
                          }}
                          style={styles.senderRecieverDP}
                        />
                        <Image
                          source={{
                            uri:
                              BACKEND_CHATS_IMAGE_URL +
                              currentManagingMessages.message,
                          }}
                          style={styles.recievedImageForManageMessage}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                          paddingTop: 5,
                          paddingBottom: 8,
                        }}
                      >
                        <Image
                          source={{
                            uri:
                              BACKEND_CHATS_IMAGE_URL +
                              currentManagingMessages.message,
                          }}
                          style={styles.sentImageForManageMessage}
                        />
                        <Image
                          source={{
                            uri:
                              BACKEND_PROFILE_IMAGE_URL +
                              currentManagingMessages.sender +
                              ".png",
                          }}
                          style={styles.senderRecieverDP}
                        />
                      </View>
                    ))}
                </View>
                <View style={{ marginTop: "auto", marginBottom: 5 }}>
                  {currentManagingMessages.sender === userName &&
                    currentManagingMessages.type !== "IMAGE" && (
                      <View style={[styles.confirmButtonMainContainerTop]}>
                        <Pressable
                          style={styles.confirmButtonContainer}
                          onPress={() =>
                            editMessageClickHandler(
                              currentManagingMessages.messageID,
                              currentManagingMessages.sender,
                              currentManagingMessages.message,
                              currentManagingMessages.type
                            )
                          }
                        >
                          <Text style={styles.confirmButtonText}>
                            Edit Message
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  {currentManagingMessages.sender === userName && (
                    <View
                      style={[
                        currentManagingMessages.type !== "IMAGE"
                          ? styles.confirmButtonMainContainerMiddle
                          : styles.confirmButtonMainContainerTop,
                      ]}
                    >
                      <Pressable
                        style={styles.confirmButtonContainer}
                        onPress={() => {
                          manageMessagesCloseHandler();
                          deleteMessageHandler(
                            currentManagingMessages.messageID
                          );
                        }}
                      >
                        <Text
                          style={[
                            styles.confirmButtonText,
                            { color: Colors.error },
                          ]}
                        >
                          Delete Message
                        </Text>
                      </Pressable>
                    </View>
                  )}
                  {
                    <View
                      style={[
                        currentManagingMessages.sender === userName
                          ? styles.confirmButtonMainContainerBottom
                          : styles.confirmButtonMainContainerAll,
                      ]}
                    >
                      <Pressable
                        style={styles.confirmButtonContainer}
                        onPress={() =>
                          replyToMessageClickHandler(
                            currentManagingMessages.messageID,
                            currentManagingMessages.sender,
                            currentManagingMessages.message,
                            currentManagingMessages.type
                          )
                        }
                      >
                        <Text style={styles.confirmButtonText}>
                          Reply To Message
                        </Text>
                      </Pressable>
                    </View>
                  }
                </View>
              </View>
            </View>
          </ConfirmationModal>

          <FullMoment
            visible={isImageInChatShown}
            closeModal={closeImageInChatHandler}
            imageSize={windowWidthForStory}
            caption={""}
            momentImage={BACKEND_CHATS_IMAGE_URL + currentImageInChat.imageURL}
            userDP={
              BACKEND_PROFILE_IMAGE_URL + currentImageInChat.sender + ".png"
            }
            userName={currentImageInChat.sender}
            postedOn={
              getFormattedTime(currentImageInChat.date) +
              ", " +
              getFormattedDate(currentImageInChat.date)
            }
          />
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Pressable
            style={styles.userDetailsContainerData}
            onPress={() =>
              navigation.navigate("chat-info", {
                otherUserName: route.params.otherUserName,
                chatID: route.params.chatID,
              })
            }
          >
            <View style={styles.nameAndUserNameContainer}>
              <Text style={styles.postsOfUsername}>
                {route.params.otherUserName}
              </Text>
              <Text style={styles.headingText}>{otherFullName}</Text>
            </View>
          </Pressable>
          <Pressable
            // style={styles.userDetailsContainerProfileDP}
            onPress={() =>
              navigation.navigate("chat-info", {
                otherUserName: route.params.otherUserName,
                chatID: route.params.chatID,
              })
            }
          >
            <Image
              source={{
                uri:
                  BACKEND_PROFILE_IMAGE_URL +
                  route.params.otherUserName +
                  ".png",
              }}
              style={styles.userDP}
            />
          </Pressable>
        </View>
        <View style={styles.scrollViewOuterContainer}>
          <ScrollView
            scrollEnabled={true}
            bounces={true}
            showsVerticalScrollIndicator={false}
            ref={chatsScrollRef}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onLoadHandler} />
            }
          >
            <View style={styles.scrollViewInnerContainer}>
              {fetchedMessages.length > 0 && <RenderedMessages />}
            </View>
            <View style={{ padding: 19 }} />
          </ScrollView>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.lowerControlsContainer}>
          {isReplyingToMessage != null && (
            <View style={styles.commentReplyToContainer}>
              <View style={styles.commentReplyToUpperContainer}>
                <Text style={styles.commentReplyToText}>
                  Replying to{" "}
                  {isReplyingToMessage.sender === userName
                    ? "you"
                    : isReplyingToMessage.sender}{" "}
                </Text>
                <Pressable onPress={replyToMessageCloseHandler}>
                  <Ionicons
                    name="close-circle-sharp"
                    size={23}
                    color={Colors.error}
                  />
                </Pressable>
              </View>
              {isReplyingToMessage.type === "MESSAGE" ? (
                <Text style={styles.commentReplyOnWhatText}>
                  {isReplyingToMessage.message.length > 45
                    ? isReplyingToMessage.message.substring(0, 42) + "..."
                    : isReplyingToMessage.message.substring(0, 45)}
                </Text>
              ) : (
                <View>
                  <Image
                    source={{
                      uri:
                        BACKEND_CHATS_IMAGE_URL + isReplyingToMessage.message,
                    }}
                    style={styles.isReplyImageType}
                  />
                </View>
              )}
            </View>
          )}
          {isEditingMessage != null && (
            <View style={styles.commentReplyToContainer}>
              <View style={styles.commentReplyToUpperContainer}>
                <Text style={styles.commentReplyToText}>
                  Editing{" "}
                  {isEditingMessage.sender === userName
                    ? "Your Message"
                    : isEditingMessage.sender}
                </Text>
                <Pressable onPress={editMessageCloseHandler}>
                  <Ionicons
                    name="close-circle-sharp"
                    size={23}
                    color={Colors.error}
                  />
                </Pressable>
              </View>

              <Text style={styles.commentReplyOnWhatText}>
                {isEditingMessage.message.length > 45
                  ? isEditingMessage.message.substring(0, 42) + "..."
                  : isEditingMessage.message.substring(0, 45)}
              </Text>
            </View>
          )}
          {imageToSend !== null && (
            <View
              style={{
                paddingHorizontal: 22,
                justifyContent: "center",
                alignItems: "center",
                height: imageWidth,
                backgroundColor: Colors.dark200,
              }}
            >
              <View style={styles.allImagesContainer}>
                <Image source={{ uri: imageToSend }} style={styles.bigImage} />
                <Pressable
                  onPress={closeImageToSendHandler}
                  style={styles.clearImageButton}
                >
                  <Feather name="x" size={23} color={Colors.white} />
                </Pressable>
              </View>
            </View>
          )}
          <View style={styles.commentTextBoxAndButtonContainer}>
            <View style={styles.commentTextBoxContainer}>
              <TextInput
                style={styles.commentTextBox}
                placeholderTextColor={Colors.greyTint}
                keyboardAppearance="dark"
                placeholder="Megssage..."
                onChangeText={(text) => {
                  setMessage(text);
                }}
                value={message}
                onSubmitEditing={sendMessageHandler}
              />

              {message === "" && imageToSend === null && (
                <Pressable
                  style={styles.photoUploadButton}
                  onPress={chooseImageToSendHandler}
                >
                  <Feather name="image" size={25} color={"black"} />
                </Pressable>
              )}
              {(message !== "" || imageToSend !== null) && (
                <Pressable
                  style={[
                    styles.commentSubmitButton,
                    {
                      marginLeft: imageToSend !== null && 6,
                      backgroundColor: Colors.yellow200,
                    },
                  ]}
                  onPress={sendMessageHandler}
                >
                  <Feather name="send" size={25} color={"black"} />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatPage;

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
    marginTop: 9,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.dark200,
    borderBottomWidth: 2.5,
    borderColor: Colors.dark95,
  },
  headingText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
  },
  scrollViewOuterContainer: {
    flex: 1,
    backgroundColor: Colors.dark200,
  },
  scrollViewInnerContainer: {
    paddingTop: 5,
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  postsOfUsername: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.white,
    textTransform: "uppercase",
  },
  nameAndUserNameContainer: {
    // marginTop: 60,
    marginLeft: 5,
    // alignItems: "center",
    // justifyContent: "center",
  },
  userDP: {
    height: 40,
    width: 40,
    borderRadius: 4 * 3,
    resizeMode: "contain",
    backgroundColor: Colors.yellowTintSecondary,
  },
  backButton: {
    paddingRight: 5,
  },
  userDetailsContainerProfileDP: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  userDetailsContainerData: {
    marginLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    // justifyContent: "center",
  },
  //
  lowerControlsContainer: {
    // borderTopWidth: 2,
    // borderColor: Colors.dark98,
    backgroundColor: "transparent",
  },
  commentTextBoxAndButtonContainer: {
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  commentTextBoxContainer: {
    marginTop: 7,
    marginBottom: 2,
    backgroundColor: Colors.dark95,
    borderRadius: 17,
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 5,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.dark80,
  },
  commentTextBox: {
    paddingLeft: 4,
    paddingRight: 10,
    fontSize: 17,
    borderRadius: 9,
    color: Colors.white,
    fontWeight: "400",
    flex: 1,
  },
  commentReplyToUpperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentSubmitButton: {
    // paddingVertical: 7,
    // paddingHorizontal: 8,
    paddingVertical: 5,
    paddingHorizontal: 6,
    backgroundColor: Colors.dark200,
    borderRadius: 12,
    alignItems: "center",
    borderColor: Colors.dark80,
    borderWidth: 1,
    // marginRight: 2,
  },
  photoUploadButton: {
    // paddingVertical: 7,
    // paddingHorizontal: 8,
    paddingVertical: 5,
    paddingHorizontal: 6,
    backgroundColor: Colors.yellow200,
    borderRadius: 12,
    // marginRight: 2,
    alignItems: "center",
    borderColor: Colors.dark80,
    borderWidth: 1,
  },

  // sent messages
  replyMessageSentContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 13,
  },
  messageSentContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 3,
  },
  senderRecieverDP: {
    height: 28,
    width: 28,
    borderRadius: 2.8 * 3,
    backgroundColor: Colors.darkForLoading,
  },
  emptyDP: {
    height: 28,
    width: 28,
  },

  messageSentInnerContainer: {
    marginRight: 6,
    maxWidth: width / 1.6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.dark39,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderBottomLeftRadius: 21,
    alignItems: "flex-end",
  },
  messageSentText: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.white,
  },
  replyMessageSentInnerContainer: {
    marginRight: 6,
    maxWidth: width / 1.6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.dark98,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomLeftRadius: 17,
    alignItems: "flex-end",
    borderWidth: 1.5,
    borderColor: Colors.dark40,
    marginBottom: 9,
  },
  replyMessageSentOuterContainer: {
    paddingRight: 6,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    borderRightWidth: 2,
    borderColor: Colors.dark30,
  },
  replyMessageSentText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.whiteDarker,
  },
  replyMessageSenderText: {
    fontSize: 13,
    fontWeight: "400",
    color: Colors.whiteDarker,
  },
  // recd messages
  messageRecievedContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingBottom: 3,
  },
  replyMessageRecievedContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 13,
  },
  replyMessageRecievedOuterContainer: {
    paddingLeft: 6,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderLeftWidth: 2,
    borderColor: Colors.dark30,
  },
  replyMessageRecievedInnerContainer: {
    marginLeft: 6,
    maxWidth: width / 1.6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.dark98,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomRightRadius: 17,
    alignItems: "flex-start",
    borderWidth: 1.5,
    borderColor: Colors.dark40,
    marginBottom: 9,
  },
  messageRecievedInnerContainer: {
    marginLeft: 6,
    maxWidth: width / 1.6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.dark80,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderBottomRightRadius: 21,
    alignItems: "flex-start",
  },
  messageRecievedText: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.white,
  },
  // system
  systemMessageContainer: {
    alignItems: "center",
    marginBottom: 19,
    marginTop: 3,
  },

  // date in messages
  dateOfMessageContainer: {
    alignItems: "center",
    marginBottom: 19,
    marginTop: 22,
  },
  dateOfMessageInnerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.dark80,
    borderColor: Colors.dark90,
    borderWidth: 1,
  },
  dateOfMessageText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.white,
    textAlign: "center",
  },
  messageTimestampText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "500",
    color: Colors.whiteDarker,
    flex: 1,
  },
  imageTimestampText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.white,
  },
  imageTimestampTextContainer: {
    backgroundColor: Colors.dark92,
    paddingHorizontal: 9,
    position: "absolute",
    paddingVertical: 3,
    borderRadius: 7,
  },
  sentImage: {
    width: width / 1.6,
    height: width / 1.6,
    backgroundColor: Colors.darkForLoading,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderBottomLeftRadius: 21,
  },
  recievedImage: {
    width: width / 1.6,
    height: width / 1.6,
    backgroundColor: Colors.darkForLoading,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderBottomRightRadius: 21,
  },
  isReplyImageType: {
    width: 75,
    height: 75,
    borderRadius: 15,
    marginTop: 7,
    marginBottom: 3,
  },
  genericReplyImage: {
    width: 73,
    height: 73,
    marginBottom: 10,
  },
  recievedImageForManageMessage: {
    width: 99,
    height: 99,
    backgroundColor: Colors.darkForLoading,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderBottomRightRadius: 21,
    marginLeft: 6,
  },
  sentImageForManageMessage: {
    width: 99,
    height: 99,
    backgroundColor: Colors.darkForLoading,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderBottomLeftRadius: 21,
    marginRight: 6,
  },
  imageRecievedInnerContainer: {
    marginLeft: 4,
    backgroundColor: Colors.dark80,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderBottomRightRadius: 21,
    alignItems: "flex-end",
  },
  imageSentInnerContainer: {
    marginRight: 4,
    backgroundColor: Colors.dark39,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderBottomLeftRadius: 21,
    alignItems: "flex-end",
  },

  ///
  confirmButtonMainContainerAll: {
    borderRadius: 17,
    marginHorizontal: -7,
    backgroundColor: Colors.dark100,
    borderColor: Colors.dark95,
    borderWidth: 1,
  },
  confirmButtonMainContainerTop: {
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    marginHorizontal: -7,
    backgroundColor: Colors.dark100,
    borderColor: Colors.dark95,
    borderWidth: 1,
  },
  confirmButtonMainContainerMiddle: {
    marginHorizontal: -7,
    backgroundColor: Colors.dark100,
    borderColor: Colors.dark95,
    borderWidth: 1,
  },
  confirmButtonMainContainerBottom: {
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    marginHorizontal: -7,
    backgroundColor: Colors.dark100,
    borderColor: Colors.dark95,
    borderWidth: 1,
  },
  confirmButtonContainer: { paddingVertical: 15, paddingHorizontal: 19 },
  confirmButtonText: {
    color: Colors.whiteDarker,
    fontSize: 15,
    fontWeight: "600",
  },

  commentReplyToContainer: {
    paddingTop: 10,
    paddingHorizontal: 12,
    // marginTop: 12,
    paddingBottom: 9,
    // borderBottomWidth: 2,
    // borderColor: Colors.white,
    flexDirection: "column",
    backgroundColor: Colors.dark95,
    borderRadius: 17,
    marginHorizontal: 8,
  },
  commentReplyOnWhatText: {
    color: Colors.whiteDarker,
    fontWeight: "400",
    fontSize: 14,
  },
  commentReplyToText: {
    color: Colors.white,
    fontWeight: "500",
    fontSize: 15,
  },
  clearImageButton: {
    margin: 5,
    position: "absolute",
    top: 3,
    right: 7,
    width: 35,
    height: 35,
    backgroundColor: Colors.dark100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  allImagesContainer: {
    paddingHorizontal: 5,
    marginTop: 11,
    marginBottom: 8,
    flex: 1,
  },
  bigImage: {
    width: imageWidth,
    height: imageWidth,
    borderRadius: 13,
    flex: 1,
  },
});
