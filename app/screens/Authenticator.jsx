import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwsome from "@expo/vector-icons/FontAwesome";
import LargeButton from "../components/buttons/LargeButtonFilled";
import Colors from "../Colors";
import { useNavigation } from "@react-navigation/native";
import LargeTextBox from "../components/textboxes/LargeTextBox";
import Error from "../components/Error";
import Info from "../components/Info";
import { BACKEND_URL } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { loadUserAction } from "../store/authorization-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../components/BackButton";
import LoadingLargeButton from "../components/Loading/LoadingLargeButton";

const Authenticator = () => {
  const [whatToShow, setWhatToShow] = useState("emailScreen");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const token = useSelector((state) => state.authorization.token);

  // const validateEmail = (email) => {
  //   return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  // };

  const otpRef1 = useRef();
  const otpRef2 = useRef();
  const otpRef3 = useRef();
  const otpRef4 = useRef();
  const otpRef5 = useRef();
  const otpRef6 = useRef();

  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [otp6, setOtp6] = useState("");

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter == 0) {
        clearInterval(interval);
      } else {
        setCounter((prev) => prev - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  const [emailOrUsername, setEmailorUsername] = useState("");

  const [emailOrUsernameError, setEmailOrUsernameError] = useState("");
  const [otpInfo, setOtpInfo] = useState("");
  const [otpError, setOtpError] = useState("");

  const navigation = useNavigation();

  const nextButtonClickHandler = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/authentication/request-verification-code/",
        {
          method: "POST",
          body: JSON.stringify({
            emailOrUsername: emailOrUsername.toLowerCase().trim(),
          }),
          headers: { "content-type": "application/json" },
        }
      );

      const response = await request.json();

      if (response.status === "EXISTING_USER_OTP_SENT") {
        setWhatToShow("otpScreen");
        setCounter(30);
        setOtpInfo(
          "Verification code was sent to " +
            response.data.maskedEmail +
            ". Check in Spam if not found in inbox."
        );
        setEmailOrUsernameError("");
      }
      if (response.status === "NEW_USER_SHOULD_USE_EMAIL") {
        setEmailOrUsernameError(
          "New users should use email to login for the first time."
        );
      }
      if (response.status === "NEW_USER_OTP_SENT") {
        setWhatToShow("otpScreen");
        setCounter(30);
        setOtpInfo(
          "Verification code was sent to " +
            response.data.maskedEmail +
            ". Check in Spam if not found in inbox."
        );
        setEmailOrUsernameError("");
      }
      if (response.status === "FAILED") {
        setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {
      setEmailOrUsernameError("Unable to reach the server.");
    }
    setIsLoading(false);
  };

  const resendOtpButtonClickHandler = async () => {
    try {
      const request = await fetch(
        BACKEND_URL + "/authentication/resend-verification-code/",
        {
          method: "POST",
          body: JSON.stringify({
            emailOrUsername: emailOrUsername.toLowerCase().trim(),
          }),
          headers: { "content-type": "application/json" },
        }
      );

      const response = await request.json();

      if (response.status === "OTP_RESENT") {
        setWhatToShow("otpScreen");
        setOtp1("");
        setOtp2("");
        setOtp3("");
        setOtp4("");
        setOtp5("");
        setOtp6("");
        setCounter(30);
        setOtpInfo(
          "Verification code was sent to " +
            response.data.maskedEmail +
            ". Check in Spam if not found in inbox."
        );
        setOtpError("");
      }
      if (response.status === "FAILED") {
        setOtpError("There was a server error.");
      }
    } catch (error) {
      setOtpError("Unable to reach the server.");
    }
  };

  const verifyButtonClickHandler = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/authentication/verify-verification-code/",
        {
          method: "POST",
          body: JSON.stringify({
            emailOrUsername: emailOrUsername.toLowerCase().trim(),
            enteredOTP:
              otp1 + "" + otp2 + "" + otp3 + "" + otp4 + "" + otp5 + "" + otp6,
            deviceName: Platform.OS === "ios" ? "iOS" : "Android",
          }),
          headers: { "content-type": "application/json" },
        }
      );

      const response = await request.json();

      if (response.status === "NEW_USER_VERIFICATION_SUCCESSFUL") {
        navigation.navigate("finish-account-setup", {
          verifiedEmail: response.data.verifiedEmail,
        });
      }
      if (response.status === "NEW_USER_VERIFICATION_FAILED") {
        setOtpError("The verification code dosen't match. Please try again.");
      }
      if (response.status === "OLD_USER_VERIFICATION_SUCCESSFUL") {
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
      if (response.status === "OLD_USER_VERIFICATION_FAILED") {
        setOtpError("The verification code dosen't match. Please try again.");
      }
      if (response.status === "FAILED") {
        setEmailOrUsernameError("There was a server error.");
      }
    } catch (error) {
      setEmailOrUsernameError("Unable to reach the server.");
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* <SafeAreaView style={styles.safeAreaView}> */}
      {whatToShow === "emailScreen" && (
        <View View style={styles.mainContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.backButton}>
              <BackButton
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>

            <Text style={styles.heading}>Sign In / Sign Up</Text>
            <Text style={styles.headingDescription}>
              Enter Email or Username to Sign In. For new users enter Email.
            </Text>
            <View style={styles.formContainer}>
              <ScrollView scrollEnabled={false}>
                <LargeTextBox
                  placeholder="Enter email or username"
                  keyboardType="email-address"
                  value={emailOrUsername}
                  onChangeText={(txt) => {
                    setEmailorUsername(txt);
                  }}
                  textStyle={{
                    paddingVertical: 14,
                    fontSize: 17,
                  }}
                />

                {emailOrUsernameError !== "" && (
                  <Error text={emailOrUsernameError} />
                )}
              </ScrollView>
            </View>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ paddingBottom: 13 }}>
              {isLoading && <LoadingLargeButton />}
              {!isLoading && (
                <LargeButton
                  onPress={nextButtonClickHandler}
                  buttonText="Next"
                  disabled={emailOrUsername.length <= 5 ? true : false}
                  style={{
                    backgroundColor:
                      emailOrUsername.length <= 5
                        ? Colors.grey
                        : Colors.yellow200,
                    borderColor:
                      emailOrUsername.length <= 5
                        ? Colors.grey
                        : Colors.yellow200,
                  }}
                />
              )}
            </View>
            {/* </SafeAreaView> */}
          </KeyboardAvoidingView>
        </View>
      )}
      {whatToShow === "otpScreen" && (
        <View View style={styles.mainContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.backButton}>
              <BackButton
                onPress={() => {
                  setWhatToShow("emailScreen");
                }}
              />
            </View>
            <Text style={styles.heading}>Verification</Text>
            <Text style={styles.headingDescription}>{otpInfo}</Text>
            <View style={styles.formContainer}>
              <ScrollView scrollEnabled={false}>
                <View style={styles.otpFieldsContainer}>
                  <TextInput
                    style={[
                      styles.otpField,
                      {
                        borderColor:
                          otp1.length >= 1
                            ? Colors.yellowTint
                            : Colors.greyTint,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={otpRef1}
                    value={otp1}
                    keyboardAppearance="dark"
                    onChangeText={(txt) => {
                      setOtp1(txt);
                      if (txt.length >= 1) {
                        otpRef2.current.focus();
                      } else if (txt.length < 1) {
                        otpRef1.current.focus();
                      }
                    }}
                  />
                  <TextInput
                    style={[
                      styles.otpField,
                      {
                        borderColor:
                          otp2.length >= 1
                            ? Colors.yellowTint
                            : Colors.greyTint,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={otpRef2}
                    value={otp2}
                    keyboardAppearance="dark"
                    onChangeText={(txt) => {
                      setOtp2(txt);
                      if (txt.length >= 1) {
                        otpRef3.current.focus();
                      } else if (txt.length < 1) {
                        otpRef1.current.focus();
                      }
                    }}
                  />
                  <TextInput
                    style={[
                      styles.otpField,
                      {
                        borderColor:
                          otp3.length >= 1
                            ? Colors.yellowTint
                            : Colors.greyTint,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={otpRef3}
                    value={otp3}
                    keyboardAppearance="dark"
                    onChangeText={(txt) => {
                      setOtp3(txt);
                      if (txt.length >= 1) {
                        otpRef4.current.focus();
                      } else if (txt.length < 1) {
                        otpRef2.current.focus();
                      }
                    }}
                  />
                  <TextInput
                    style={[
                      styles.otpField,
                      {
                        borderColor:
                          otp4.length >= 1
                            ? Colors.yellowTint
                            : Colors.greyTint,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={otpRef4}
                    value={otp4}
                    keyboardAppearance="dark"
                    onChangeText={(txt) => {
                      setOtp4(txt);
                      if (txt.length >= 1) {
                        otpRef5.current.focus();
                      } else if (txt.length < 1) {
                        otpRef3.current.focus();
                      }
                    }}
                  />
                  <TextInput
                    style={[
                      styles.otpField,
                      {
                        borderColor:
                          otp5.length >= 1
                            ? Colors.yellowTint
                            : Colors.greyTint,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={otpRef5}
                    value={otp5}
                    keyboardAppearance="dark"
                    onChangeText={(txt) => {
                      setOtp5(txt);
                      if (txt.length >= 1) {
                        otpRef6.current.focus();
                      } else if (txt.length < 1) {
                        otpRef4.current.focus();
                      }
                    }}
                  />
                  <TextInput
                    style={[
                      styles.otpField,
                      {
                        borderColor:
                          otp6.length >= 1
                            ? Colors.yellowTint
                            : Colors.greyTint,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={otpRef6}
                    value={otp6}
                    keyboardAppearance="dark"
                    onChangeText={(txt) => {
                      setOtp6(txt);
                      if (txt.length >= 1) {
                        otpRef6.current.focus();
                      } else if (txt.length < 1) {
                        otpRef5.current.focus();
                      }
                    }}
                  />
                </View>
                <View style={styles.resendOtpContainer}>
                  <View style={styles.resendOtpButtonWrapper}>
                    {counter == 0 && (
                      <Pressable onPress={resendOtpButtonClickHandler}>
                        <Text style={styles.resendOtpButtonText}>
                          Resend Code
                        </Text>
                      </Pressable>
                    )}
                    {counter > 0 && (
                      <Text style={styles.resendOtpLaterText}>
                        Resend Code in {counter > 0 && counter}s
                      </Text>
                    )}
                  </View>
                </View>

                {otpError !== "" && <Error text={otpError} />}
              </ScrollView>
            </View>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ paddingBottom: 13 }}>
              {isLoading && <LoadingLargeButton />}
              {!isLoading && (
                <LargeButton
                  onPress={verifyButtonClickHandler}
                  buttonText="Verify"
                  disabled={
                    otp1 !== "" &&
                    otp2 !== "" &&
                    otp3 !== "" &&
                    otp4 !== "" &&
                    otp5 !== "" &&
                    otp6 !== ""
                      ? false
                      : true
                  }
                  style={{
                    backgroundColor:
                      otp1 !== "" &&
                      otp2 !== "" &&
                      otp3 !== "" &&
                      otp4 !== "" &&
                      otp5 !== "" &&
                      otp6 !== ""
                        ? Colors.yellow200
                        : Colors.grey,
                    borderColor:
                      otp1 !== "" &&
                      otp2 !== "" &&
                      otp3 !== "" &&
                      otp4 !== "" &&
                      otp5 !== "" &&
                      otp6 !== ""
                        ? Colors.yellow200
                        : Colors.grey,
                  }}
                />
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </>
  );
};

export default Authenticator;

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: Colors.dark200,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  safeAreaView: { flex: 1, backgroundColor: Colors.dark200 },
  heading: {
    fontSize: 23,
    fontWeight: "600",
    color: Colors.white,
  },
  innerContainer: {
    paddingTop: 30,
    paddingBottom: 20,
    flex: 1,
    backgroundColor: Colors.dark200,
  },
  headingDescription: {
    paddingTop: 5,
    fontWeight: "300",
    color: Colors.grey,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.dark200,
    paddingTop: 30,
  },
  otpFieldsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  otpField: {
    flex: 1,
    marginTop: 5,
    marginBottom: 4,
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 18,
    borderWidth: 1.5,
    borderRadius: 9,
    borderColor: Colors.greyTint,
    color: Colors.white,
    textAlign: "center",
    marginRight: 9,
    fontWeight: "800",
  },
  resendOtpContainer: {
    marginTop: 16,
    marginBottom: 14,
    alignItems: "flex-end",
    marginRight: 9,
  },
  resendOtpButtonWrapper: {},
  resendOtpButtonText: { color: Colors.yellow200, fontWeight: "500" },
  resendOtpLaterText: { color: Colors.white, fontWeight: "500" },
});
