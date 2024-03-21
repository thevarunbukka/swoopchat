import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import FontAwsome from "@expo/vector-icons/FontAwesome";
import LargeButton from "../../components/buttons/LargeButtonFilled";
import Colors from "../../Colors";
import { useNavigation } from "@react-navigation/native";
import LargeTextBox from "../../components/textboxes/LargeTextBox";
import Error from "../../components/Error";
import Info from "../../components/Info";
import { useSelector, useDispatch } from "react-redux";
import {
  loadUserAction,
  removeUserAction,
} from "../../store/authorization-slice";
import { BACKEND_URL, BACKEND_PROFILE_IMAGE_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingLargeTextBox from "../../components/Loading/LoadingLargeTextBox";
import LoadingText from "../../components/Loading/LoadingText";

const EditProfile = () => {
  // const validateEmail = (email) => {
  //   return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  // };

  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.authorization.token);
  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [gender, setGender] = useState("Choose your gender");
  const [isGenderToggled, setIsGenderToggled] = useState(false);

  const [newProfileImage, setNewProfileImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const onLoadHandler = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(BACKEND_URL + "/edit-profile/", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "EDIT_PROFILE_LOADED") {
        setProfilePicture(response.data.profilePicture);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setUserName(response.data._id);
        setPhoneNumber(response.data.phoneNumber);
        setGender(response.data.gender);
        setBio(response.data.bio);
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
    setIsLoading(false);
  };

  useEffect(() => {
    onLoadHandler();
  }, []);

  const doneButtonClickHandler = async () => {
    if (newProfileImage !== null) {
      try {
        const formData = new FormData();
        // Math.floor(Math.random() * 100000000000000 + 1).toString()
        formData.append("profileImage", {
          name: userName.toLowerCase().trim() + ".png",
          type: "image/png",
          uri: newProfileImage,
        });

        const request = await fetch(BACKEND_URL + "/edit-profile/picture/", {
          method: "POST",
          body: formData,
          headers: {
            "content-type": "multipart/form-data",
            Authorization: "Bearer " + userToken,
          },
        });

        const response = await request.json();

        console.log(response.status);
        if (response.status === "PROFILE_PICTURE_UPDATED") {
          const isStored = await AsyncStorage.setItem(
            "profilePicture",
            response.data.profilePicture
          );
          dispatch(loadUserAction());
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
    }
    try {
      const request = await fetch(BACKEND_URL + "/edit-profile/", {
        method: "POST",
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          gender: gender,
          bio: bio,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });

      const response = await request.json();

      if (response.status === "PROFILE_UPDATED") {
        const isStored1 = await AsyncStorage.setItem(
          "fullName",
          response.data.fullName
        );
        const isStored2 = await AsyncStorage.setItem(
          "userName",
          response.data._id
        );
        dispatch(loadUserAction());
        navigation.goBack();
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
  };

  const chooseNewProfilePictureHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProfileImage(result.assets[0].uri);
    }
  };

  const removeNewProfilePictureHandler = () => setNewProfileImage(null);

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <View style={{ flexDirection: "row" }}>
          {firstName !== "" &&
            lastName !== "" &&
            bio !== "" &&
            phoneNumber !== "" &&
            phoneNumber.length === 10 && (
              <Pressable
                style={styles.backButton}
                onPress={doneButtonClickHandler}
              >
                <Text style={styles.doneButton}>Done</Text>
              </Pressable>
            )}
          {(firstName === "" ||
            lastName === "" ||
            bio === "" ||
            phoneNumber.length !== 10 ||
            phoneNumber === "") && (
            <View style={styles.backButton}>
              <Text style={styles.doneButtonDisabled}>Done</Text>
            </View>
          )}
        </View>

        <View style={styles.formContainer}>
          <ScrollView
            scrollEnabled={true}
            bounces={true}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            style={styles.dataAndControlsScrollViewContainer}
          >
            <View style={styles.headingContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heading}>Edit Profile</Text>
                <Text style={styles.headingDescription}>
                  Changes will reflect on your profile.
                </Text>
                {!isLoading && (
                  <Text style={styles.headingUserName}>@{userName}</Text>
                )}
                {isLoading && (
                  <View style={{ alignItems: "flex-start" }}>
                    <LoadingText
                      height={5}
                      width={6}
                      style={{ marginTop: 13 }}
                    />
                  </View>
                )}
              </View>
              <View style={styles.dpContainer}>
                {/* {profilePicture !== null && ( */}
                <Image
                  source={{
                    uri:
                      newProfileImage === null
                        ? BACKEND_PROFILE_IMAGE_URL + profilePicture
                        : newProfileImage,
                  }}
                  style={styles.dpImage}
                />
                {/* )} */}
                {newProfileImage === null && (
                  <Pressable
                    style={styles.dpChange}
                    onPress={chooseNewProfilePictureHandler}
                  >
                    <Text style={styles.dpChangeText}>Change</Text>
                  </Pressable>
                )}
                {!(newProfileImage === null) && (
                  <Pressable
                    style={styles.dpChange}
                    onPress={removeNewProfilePictureHandler}
                  >
                    <Text style={styles.dpRemoveText}>Remove</Text>
                  </Pressable>
                )}
              </View>
            </View>
            {!isLoading && (
              <LargeTextBox
                textOnLabel="First Name"
                placeholder="Enter First Name"
                value={firstName}
                onChangeText={(txt) => {
                  setFirstName(txt);
                }}
                style={{ marginBottom: 13 }}
                showLabel={true}
              />
            )}
            {isLoading && (
              <LoadingLargeTextBox
                showLabel
                textOnLabel="First Name"
                style={{ marginBottom: 13 }}
              />
            )}
            {/* <Error
                text="This is an error message."
                style={{ marginBottom: 14 }}
              /> */}
            {!isLoading && (
              <LargeTextBox
                textOnLabel="Last Name"
                placeholder="Enter Last Name"
                value={lastName}
                onChangeText={(txt) => {
                  setLastName(txt);
                }}
                style={{ marginBottom: 13 }}
                showLabel={true}
              />
            )}
            {isLoading && (
              <LoadingLargeTextBox
                showLabel
                textOnLabel="Last Name"
                style={{ marginBottom: 13 }}
              />
            )}
            {/* <Error
                text="This is an error message."
                style={{ marginBottom: 14 }}
              /> */}

            {!isLoading && (
              <LargeTextBox
                textOnLabel="Bio"
                placeholder="Enter Bio"
                value={bio}
                onChangeText={(txt) => {
                  setBio(txt);
                }}
                style={{ marginBottom: 13 }}
                showLabel={true}
              />
            )}
            {isLoading && (
              <LoadingLargeTextBox
                showLabel
                textOnLabel="Bio"
                style={{ marginBottom: 13 }}
              />
            )}
            {/* <Error
                text="This is an error message."
                style={{ marginBottom: 14 }}
              /> */}

            {!isLoading && (
              <LargeTextBox
                textOnLabel="Phone Number +91"
                placeholder="Phone Number +91"
                value={phoneNumber}
                onChangeText={(txt) => {
                  setPhoneNumber(txt);
                }}
                keyboardType="number-pad"
                style={{ marginBottom: 13 }}
                showLabel={true}
                maxLength={10}
              />
            )}
            {isLoading && (
              <LoadingLargeTextBox
                showLabel
                textOnLabel="Phone Number +91"
                style={{ marginBottom: 13 }}
              />
            )}
            {/* <Error
                text="This is an error message."
                style={{ marginBottom: 14 }}
              /> */}
            <View>
              {!isLoading && (
                <>
                  <View>
                    <Text style={styles.dropDownLabel}>{"Gender"}</Text>
                  </View>
                  <View style={styles.dropDownContainer}>
                    <Pressable
                      style={styles.dropDownUpper}
                      onPress={() => setIsGenderToggled((prev) => !prev)}
                    >
                      <Text
                        style={[
                          styles.dropDownText,
                          {
                            color:
                              gender === "Choose your gender"
                                ? Colors.greyTint
                                : Colors.white,
                          },
                        ]}
                      >
                        {gender}
                      </Text>
                      <FontAwsome
                        name={isGenderToggled ? "angle-up" : "angle-down"}
                        size={28}
                        color={Colors.greyTint}
                      />
                    </Pressable>
                    {isGenderToggled && (
                      <View style={styles.dropDownLower}>
                        <Pressable
                          style={styles.dropDownOption}
                          onPress={() => {
                            setGender("Male");
                            setIsGenderToggled((prev) => !prev);
                          }}
                        >
                          <Text style={styles.dropDownOptionText}>Male</Text>
                        </Pressable>
                        <Pressable
                          style={styles.dropDownOption}
                          onPress={() => {
                            setGender("Female");
                            setIsGenderToggled((prev) => !prev);
                          }}
                        >
                          <Text style={styles.dropDownOptionText}>Female</Text>
                        </Pressable>
                        <Pressable
                          style={styles.dropDownOption}
                          onPress={() => {
                            setGender("Other");
                            setIsGenderToggled((prev) => !prev);
                          }}
                        >
                          <Text style={styles.dropDownOptionText}>Other</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </>
              )}
              {isLoading && (
                <LoadingLargeTextBox
                  showLabel
                  textOnLabel="Gender"
                  style={{ marginBottom: 13 }}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  backButton: {
    paddingRight: 5,
    marginBottom: 16,
  },
  doneButton: { fontSize: 19, fontWeight: "600", color: Colors.yellow200 },
  doneButtonDisabled: {
    fontSize: 19,
    fontWeight: "600",
    color: Colors.grey,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 27,
    // paddingBottom: 10,
    backgroundColor: Colors.dark200,
    paddingHorizontal: 18,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.white,
  },
  headingContainer: {
    paddingTop: 15,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerContainer: {
    paddingTop: 30,
    // paddingBottom: 20,
    flex: 1,
    backgroundColor: Colors.dark200,
  },
  headingDescription: {
    paddingTop: 4,
    fontWeight: "400",
    color: Colors.grey,
  },
  headingUserName: {
    color: Colors.whiteTint,
    fontWeight: "700",
    fontSize: 16,
    marginTop: 13,
    letterSpacing: 0.3,
    textTransform: "lowercase",
  },
  dataAndControlsScrollViewContainer: {
    marginTop: 0,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.dark200,
  },
  dpContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dpChange: { paddingTop: 6, paddingBottom: 4, paddingLeft: 3 },
  dpChangeText: {
    color: Colors.yellow200,
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  dpRemoveText: {
    color: Colors.error,
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  dropDownContainer: {
    marginTop: 5,
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.dark50,
  },
  dropDownUpper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropDownText: {
    color: Colors.white,
    fontWeight: "500",
    fontSize: 15,
  },
  dropDownLabel: { color: Colors.greyTint, fontWeight: "400", fontSize: 12 },
  subCategoryContainer: {
    marginBottom: 18,
    marginTop: 8,
  },
  dropDownOption: {
    marginVertical: 8,
  },
  dropDownOptionText: {
    color: Colors.grey,
    fontWeight: "400",
    fontSize: 13,
  },
  dpImage: {
    height: 70,
    width: 70,
    borderRadius: 7.0 * 3,
    backgroundColor: Colors.darkForLoading,
  },

  dropDownLower: {
    marginTop: 8,
  },
});
