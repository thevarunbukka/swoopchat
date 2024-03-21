import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Colors from "../Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { BACKEND_PROFILE_IMAGE_URL, BACKEND_CHATS_IMAGE_URL } from "@env";

export const MessageSent = ({
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
export const MessageRecieved = ({
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
export const SystemMessage = ({ text }) => {
  return (
    <View style={styles.systemMessageContainer}>
      <View style={styles.dateOfMessageInnerContainer}>
        <Text style={styles.dateOfMessageText}>{text}</Text>
      </View>
    </View>
  );
};
export const DateOfMessage = ({ text }) => {
  return (
    <View style={styles.dateOfMessageContainer}>
      <View style={styles.dateOfMessageInnerContainer}>
        <Text style={styles.dateOfMessageText}>{text}</Text>
      </View>
    </View>
  );
};
export const ImageSent = ({
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
export const ImageRecieved = ({
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
  //   bigImage: {
  //     width: imageWidth,
  //     height: imageWidth,
  //     borderRadius: 13,
  //     flex: 1,
  //   },
});
