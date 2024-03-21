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
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import Colors from "../Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  EvilIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Children, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ProfileButtons from "./buttons/ProfileButtons";

const ConfirmationModal = ({
  visible,
  closeModal,
  children,
  confirmButtonText,
  confirmButtonHandler,
  modelFlex,
  confirmButtonTextColor,
  style,
  isConfirmationModalLoading,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <Pressable
        onPress={closeModal}
        style={[styles.modalCloseContainer]}
      ></Pressable>
      <View
        style={[
          styles.modalMainContainerMain,
          { flex: modelFlex ? modelFlex : 0.5 },
          style,
        ]}
      >
        <View style={styles.modalMainContainer}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.modelInnerAlignmentContainer}>
              <View style={styles.childrenContainer}>{children}</View>
            </View>
          </View>
        </View>
        {confirmButtonHandler && (
          <View
            style={[
              styles.confirmButtonMainContainer,
              { marginBottom: Platform.OS === "ios" ? 33 : 13 },
            ]}
          >
            {!isConfirmationModalLoading ? (
              <Pressable
                style={styles.confirmButtonContainer}
                onPress={confirmButtonHandler}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    { color: confirmButtonTextColor },
                  ]}
                >
                  {confirmButtonText}
                </Text>
              </Pressable>
            ) : (
              <View style={styles.confirmButtonContainer}>
                <ActivityIndicator size={"small"} color={Colors.yellow200} />
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  modalMainContainerMain: {
    backgroundColor: Colors.dark90,
    padding: 10,
    paddingTop: 0,
    // borderColor: Colors.dark40,
    // borderTopWidth: 2,
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
  },

  modalMainContainer: {
    borderRadius: 17,
    marginBottom: 9,
    flex: 1,
  },
  modalInnerContainer: {
    flex: 1,
    // backgroundColor: Colors.dark90,
  },
  modalHeadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.error,
  },
  modalCommentsContainer: {
    paddingTop: 20,
    marginHorizontal: 11,
  },
  modalCloseContainer: {
    flex: 1,
    // backgroundColor: Colors.yellowCard,
    // backgroundColor: "rgba(70, 70, 70, 0.5)",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  childrenContainer: {
    paddingBottom: 20,
    paddingHorizontal: 19,
    alignItems: "center",
  },
  modelInnerAlignmentContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonMainContainer: {
    borderRadius: 17,
    marginHorizontal: 19,
    backgroundColor: Colors.dark99,
    borderColor: Colors.dark92,
    borderWidth: 2,
  },
  confirmButtonContainer: { paddingVertical: 13, paddingHorizontal: 6 },
  confirmButtonText: {
    textAlign: "center",
    color: Colors.yellow200,
    fontSize: 17,
    fontWeight: "600",
  },
});
