import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Platform,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LargeButton from "../components/buttons/LargeButtonFilled";
import Colors from "../Colors";
import { useNavigation } from "@react-navigation/native";
import LargeTextBox from "../components/textboxes/LargeTextBox";
import Error from "../components/Error";
import Info from "../components/Info";
import * as ImagePicker from "expo-image-picker";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { loadUserAction } from "../store/authorization-slice";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import LoadingLargeButton from "../components/Loading/LoadingLargeButton";

const FinishAccountSetup = ({ route }) => {
  // const validateEmail = (email) => {
  //   return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  // };

  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [gender, setGender] = useState("Choose your gender");
  const [isGenderToggled, setIsGenderToggled] = useState(false);

  const [verifiedEmail, setVerifiedEmail] = useState(
    route.params.verifiedEmail
  );

  const [isLoading, setIsLoading] = useState(false);

  const [isUserNameVerified, setIsUserNameVerified] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [error, setError] = useState("");

  const dpChooseHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const verifyUserNameClickHandler = async () => {
    if (username.length > 5) {
      try {
        const request = await fetch(
          BACKEND_URL + "/authentication/verify-username/",
          {
            method: "POST",
            body: JSON.stringify({
              enteredUserName: username,
            }),
            headers: {
              "content-type": "application/json",
            },
          }
        );

        const response = await request.json();

        if (response.status === "USERNAME_AVAILABLE") {
          setIsUserNameVerified(true);
          setUsernameError("");
        }
        if (response.status === "USERNAME_ALREADY_TAKEN") {
          setIsUserNameVerified(false);
          setUsernameError(
            "This username isn't available. Please try another."
          );
        }
        if (response.status === "FAILED") {
          // setEmailOrUsernameError("There was a server error.");
        }
      } catch (error) {
        // setEmailOrUsernameError("Unable to reach the server.");
        console.log(error);
      }
    } else {
      setUsernameError("Username should be of minimum 6 characters.");
    }
  };

  const finishButtonClickHandler = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      //  Math.floor(Math.random() * 100000000000000 + 1).toString() +
      formData.append("profileImage", {
        name: username.toLowerCase().trim() + ".png",
        type: "image/png",
        uri: profileImage,
      });
      formData.append("enteredEmail", verifiedEmail);
      formData.append("enteredFirstName", firstName);
      formData.append("enteredUserName", username);
      formData.append("enteredLastName", lastName);
      formData.append("enteredPhoneNumber", phoneNumber);
      formData.append("enteredBio", bio);
      formData.append("enteredGender", gender);
      formData.append("deviceName", Platform.OS === "ios" ? "iOS" : "Android");

      const request = await fetch(
        BACKEND_URL + "/authentication/finish-account-setup/",
        {
          method: "POST",
          body: formData,
          headers: { "content-type": "multipart/form-data" },
        }
      );

      const response = await request.json();

      if (response.status === "USERNAME_ALREADY_TAKEN") {
        setUsernameError("This username isn't available. Please try another.");
      }

      if (response.status === "NEW_USER_REGISTERED") {
        const isStored1 = await AsyncStorage.setItem(
          "token",
          response.data.token
        );
        const isStored2 = await AsyncStorage.setItem(
          "fullName",
          response.data.fullName
        );
        const isStored3 = await AsyncStorage.setItem(
          "userName",
          response.data._id
        );
        const isStored4 = await AsyncStorage.setItem(
          "profilePicture",
          response.data.profilePicture
        );
        dispatch(loadUserAction());
      }

      if (response.status === "FAILED") {
        setError("There was a server error.");
      }
    } catch (error) {
      setError("Unable to reach the server.");
    }
    setIsLoading(false);
  };

  const dpRemoveHandler = () => setProfileImage(null);

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      {/* <SafeAreaView style={styles.safeAreaView}> */}
      <View style={styles.innerContainer}>
        <View style={styles.backButton}>
          <Pressable
            onPress={() => {
              navigation.navigate("authenticator");
            }}
          >
            <FontAwesome name="angle-left" size={36} color={Colors.yellow200} />
          </Pressable>
        </View>
        <View style={styles.headingContainer}>
          <View>
            <Text style={styles.heading}>Finish Setup</Text>
            <Text style={styles.headingDescription}>
              Please finish your account's setup.
            </Text>
            <Text style={styles.headingDescription}>
              All the dots should turn green.
            </Text>
            {/* <Text style={styles.headingUserName}>thevarunbukk@usern</Text> */}
          </View>
          <View style={styles.dpContainer}>
            {/* <FontAwesome name="circle" size={75} color={Colors.yellowTint} /> */}
            {profileImage === null && (
              // <Image
              //   source={require("../assets/images/profile.png")}
              //   style={styles.dpImage}
              // />
              <View style={styles.dpImageInitial}>
                <Feather name="user" size={40} color={Colors.dark30} />
              </View>
            )}
            {!(profileImage === null) && (
              <Image source={{ uri: profileImage }} style={styles.dpImage} />
            )}

            {profileImage === null && (
              <Pressable style={styles.dpChange} onPress={dpChooseHandler}>
                <Text style={styles.dpChangeText}>Change</Text>
              </Pressable>
            )}
            {!(profileImage === null) && (
              <Pressable style={styles.dpChange} onPress={dpRemoveHandler}>
                <Text style={styles.dpRemoveText}>Remove</Text>
              </Pressable>
            )}
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <FontAwesome
            name={"circle"}
            size={19}
            color={!(profileImage === null) ? Colors.green : Colors.greyTint}
          />
          <View style={styles.subCategoryUnderline}></View>
          <FontAwesome
            name={"circle"}
            size={19}
            color={firstName.length > 0 ? Colors.green : Colors.greyTint}
          />
          <View style={styles.subCategoryUnderline}></View>
          <FontAwesome
            name={"circle"}
            size={19}
            color={lastName.length > 0 ? Colors.green : Colors.greyTint}
          />

          <View style={styles.subCategoryUnderline}></View>
          <FontAwesome
            name={"circle"}
            size={19}
            color={isUserNameVerified ? Colors.green : Colors.greyTint}
          />
          <View style={styles.subCategoryUnderline}></View>
          <FontAwesome
            name={"circle"}
            size={19}
            color={phoneNumber.length === 10 ? Colors.green : Colors.greyTint}
          />
          <View style={styles.subCategoryUnderline}></View>
          <FontAwesome
            name={"circle"}
            size={19}
            color={bio.length > 0 ? Colors.green : Colors.greyTint}
          />
          <View style={styles.subCategoryUnderline}></View>
          <FontAwesome
            name={"circle"}
            size={19}
            color={
              gender !== "Choose your gender" ? Colors.green : Colors.greyTint
            }
          />
        </View>
        <View style={styles.formContainer}>
          <ScrollView
            scrollEnabled={true}
            bounces={true}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
          >
            <View style={{ padding: 3 }} />
            <LargeTextBox
              textOnLabel="First Name"
              placeholder="Enter First Name"
              value={firstName}
              onChangeText={(txt) => {
                setFirstName(txt);
              }}
              style={{ marginBottom: 19 }}
              showLabel={true}
            />

            <LargeTextBox
              textOnLabel="Last Name"
              placeholder="Enter Last Name"
              value={lastName}
              onChangeText={(txt) => {
                setLastName(txt);
              }}
              style={{ marginBottom: 19 }}
              showLabel={true}
            />

            <LargeTextBox
              textOnLabel="User Name  (Minimum 6 Characters)"
              placeholder="Choose User Name"
              value={username}
              onChangeText={(txt) => {
                setUsername(txt);
              }}
              style={{ marginBottom: 8 }}
              showLabel={true}
              editable={!isUserNameVerified}
            />
            <View style={{ flexDirection: "row" }}>
              {usernameError !== "" && (
                <Error
                  text={usernameError}
                  style={{
                    marginBottom: 20,
                    flex: 3.5,
                  }}
                  fontSize={13}
                />
              )}

              <View
                style={{
                  marginBottom: usernameError !== "" ? 3 : 19,
                  alignItems: "flex-end",
                  marginLeft: 3,
                  flex: 1,
                }}
              >
                {!isUserNameVerified && (
                  <Pressable
                    style={styles.verifyUserName}
                    onPress={verifyUserNameClickHandler}
                  >
                    <Text style={styles.verifyUserNameText}>Verify</Text>
                  </Pressable>
                )}
                {isUserNameVerified && (
                  <View style={styles.verifyUserName}>
                    <View style={styles.tickContainer}>
                      <MaterialIcons
                        name="done"
                        size={17}
                        color={Colors.dark200}
                      />
                    </View>

                    <Text style={styles.verifiedUserNameText}>Verified</Text>
                  </View>
                )}
              </View>
            </View>

            <LargeTextBox
              textOnLabel="Phone Number +91"
              placeholder="Phone Number +91"
              value={phoneNumber}
              onChangeText={(txt) => {
                setPhoneNumber(txt);
              }}
              keyboardType="number-pad"
              style={{ marginBottom: 19 }}
              showLabel={true}
              maxLength={10}
            />

            <LargeTextBox
              textOnLabel="Bio"
              placeholder="Enter Bio"
              value={bio}
              onChangeText={(txt) => {
                setBio(txt);
              }}
              style={{ marginBottom: 19 }}
              showLabel={true}
            />

            <View>
              <View>
                <Text style={styles.dropDownLabel}>{" Gender"}</Text>
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
                  <FontAwesome
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
            </View>
            {isLoading && <LoadingLargeButton />}
            {!isLoading && (
              <LargeButton
                disabled={
                  !(profileImage === null) &&
                  firstName.length > 0 &&
                  lastName.length > 0 &&
                  isUserNameVerified &&
                  bio.length > 0 &&
                  phoneNumber.length === 10 &&
                  gender !== "Choose your gender"
                    ? false
                    : true
                }
                onPress={finishButtonClickHandler}
                style={{
                  backgroundColor:
                    !(profileImage === null) &&
                    firstName.length > 0 &&
                    lastName.length > 0 &&
                    isUserNameVerified &&
                    bio.length > 0 &&
                    phoneNumber.length === 10 &&
                    gender !== "Choose your gender"
                      ? Colors.yellow200
                      : Colors.grey,
                  borderColor:
                    !(profileImage === null) &&
                    firstName.length > 0 &&
                    lastName.length > 0 &&
                    isUserNameVerified &&
                    bio.length > 0 &&
                    phoneNumber.length === 10 &&
                    gender !== "Choose your gender"
                      ? Colors.yellow200
                      : Colors.grey,
                  marginTop: 29,
                  marginBottom: error !== "" ? 0 : 10,
                }}
                buttonText="Finish"
              />
            )}
            {error !== "" && (
              <View style={styles.mainError}>
                <Text style={styles.mainErrorText}>{error}</Text>
              </View>
            )}
            <View style={{ padding: 20 }}></View>
          </ScrollView>
        </View>
      </View>
      {/* </SafeAreaView> */}
    </View>
  );
};

export default FinishAccountSetup;

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 10,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
    // paddingBottom: 10,
    backgroundColor: Colors.dark200,
    paddingHorizontal: 18,
  },
  heading: {
    fontSize: 23,
    fontWeight: "600",
    color: Colors.white,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerContainer: {
    paddingTop: 30,
    // paddingBottom: 15,
    flex: 1,
    backgroundColor: Colors.dark200,
  },
  headingDescription: {
    paddingTop: 5,
    fontWeight: "300",
    color: Colors.grey,
  },
  headingUserName: {
    color: Colors.grey,
    fontWeight: "700",
    fontSize: 18,
    marginTop: 13,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.dark200,
    paddingTop: 30,
  },
  dpContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dpChange: { paddingTop: 6, paddingBottom: 4, paddingLeft: 3 },
  dpChangeText: {
    color: Colors.yellow200,
    fontWeight: "600",
    fontSize: 14,
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
  progressBarContainer: {
    marginBottom: 1,
    marginTop: 36,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  subCategoryText: {
    color: Colors.yellow200,
    fontSize: 18,
    fontWeight: "500",
  },
  subCategoryUnderline: {
    padding: 4,
    flex: 1,
    backgroundColor: Colors.greenTint,
  },
  dropDownOption: {
    marginVertical: 8,
  },
  dropDownOptionText: {
    color: Colors.grey,
    fontWeight: "400",
    fontSize: 13,
  },
  mainError: { paddingVertical: 20, marginTop: 6, marginBottom: 4 },
  mainErrorText: {
    textAlign: "center",
    color: Colors.error,
    fontSize: 14,
    fontWeight: "500",
  },
  dpImageInitial: {
    height: 64,
    width: 64,
    borderRadius: 6.4 * 3,
    // borderWidth: 3,
    // borderColor: Colors.dark40,
    backgroundColor: Colors.dark80,
    justifyContent: "center",
    alignItems: "center",
  },
  dpImage: { height: 64, width: 64, borderRadius: 6.4 * 3 },
  dropDownLower: {
    marginTop: 8,
  },
  verifyUserName: {
    padding: 0,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  verifyUserNameText: {
    color: Colors.yellow200,
    fontSize: 15,
    fontWeight: "600",
  },
  verifiedUserNameText: {
    color: Colors.grey,
    fontSize: 15,
    fontWeight: "600",
  },
  tickContainer: {
    backgroundColor: Colors.green,
    justifyContent: "center",
    alignItems: "center",
    height: 19,
    width: 19,
    borderRadius: 19,
    marginRight: 7,
  },
});
