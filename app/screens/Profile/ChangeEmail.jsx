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
import { MaterialIcons } from "@expo/vector-icons";
import LargeButton from "../../components/buttons/LargeButtonFilled";
import Colors from "../../Colors";
import { useNavigation } from "@react-navigation/native";
import LargeTextBox from "../../components/textboxes/LargeTextBox";
import Error from "../../components/Error";
import Info from "../../components/Info";
import { BACKEND_URL } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { loadUserAction } from "../../store/authorization-slice";
import LoadingLargeButton from "../../components/Loading/LoadingLargeButton";
import BackButton from "../../components/BackButton";

const isEmail = (email) => {
  return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

const ChangeEmail = () => {
  const [whatToShow, setWhatToShow] = useState("emailScreen");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUserAction());
  }, []);
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

  const [enteredEmail, setEmailorUsername] = useState("");

  const [enteredEmailError, setEnteredEmailError] = useState("");
  const [otpInfo, setOtpInfo] = useState("");
  const [otpError, setOtpError] = useState("");

  const navigation = useNavigation();

  const nextButtonClickHandler = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/settings/change-email/request-verification-code/",
        {
          method: "POST",
          body: JSON.stringify({
            enteredEmail: enteredEmail.toLowerCase().trim(),
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();

      if (response.status === "OTP_SENT") {
        setWhatToShow("otpScreen");
        setCounter(30);
        setOtpInfo(
          "Verification code was sent to " +
            response.data.maskedEmail +
            ". Check in Spam if not found in inbox."
        );
        setEnteredEmailError("");
      }
      if (response.status === "EMAIL_ALREADY_TAKEN") {
        setEnteredEmailError(
          "This email is already taken. Try diffrent email."
        );
      }
      if (response.status === "INVALID_EMAIL") {
        setEnteredEmailError(
          "You have entered an invalid email. Enter a valid email."
        );
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        setEnteredEmailError("There was a server error.");
      }
    } catch (error) {
      setEnteredEmailError("Unable to reach the server.");
    }
    setIsLoading(false);
  };

  const resendOtpButtonClickHandler = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/settings/change-email/resend-verification-code/",
        {
          method: "POST",
          body: JSON.stringify({
            enteredEmail: enteredEmail.toLowerCase().trim(),
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
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
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        setOtpError("There was a server error.");
      }
    } catch (error) {
      setOtpError("Unable to reach the server.");
    }
    setIsLoading(false);
  };

  const verifyButtonClickHandler = async () => {
    setIsLoading(true);
    try {
      const request = await fetch(
        BACKEND_URL + "/settings/change-email/validate-verification-code/",
        {
          method: "POST",
          body: JSON.stringify({
            enteredEmail: enteredEmail.toLowerCase().trim(),
            enteredOTP:
              otp1 + "" + otp2 + "" + otp3 + "" + otp4 + "" + otp5 + "" + otp6,
            deviceName: Platform.OS === "ios" ? "iOS" : "Android",
          }),
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const response = await request.json();

      console.log(response.status);

      if (response.status === "EMAIL_UPDATED") {
        setWhatToShow("successScreen");
      }

      if (response.status === "INCORRECT_VERIFICATION_CODE") {
        setOtpError("The verification code dosen't match. Please try again.");
      }
      if (response.status === "NOT_AUTHENTICATED") {
        dispatch(removeUserAction());
      }
      if (response.status === "FAILED") {
        setEnteredEmailError("There was a server error.");
      }
    } catch (error) {
      setEnteredEmailError("Unable to reach the server.");
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
            <Text style={styles.heading}>Change Email</Text>
            <Text style={styles.headingDescription}>
              Enter new email to be linked with your account and verify the your
              new email.
            </Text>
            <View style={styles.formContainer}>
              <ScrollView scrollEnabled={false}>
                <LargeTextBox
                  placeholder="New email"
                  keyboardType="email-address"
                  value={enteredEmail}
                  onChangeText={(txt) => {
                    setEmailorUsername(txt);
                  }}
                  textStyle={{
                    paddingVertical: 14,
                    fontSize: 17,
                  }}
                />

                {enteredEmailError !== "" && <Error text={enteredEmailError} />}
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
                  disabled={isEmail(enteredEmail) ? true : false}
                  style={{
                    backgroundColor: isEmail(enteredEmail)
                      ? Colors.grey
                      : Colors.yellow200,
                    borderColor: isEmail(enteredEmail)
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
            <Text style={styles.heading}>Verify your Email</Text>
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
      {whatToShow === "successScreen" && (
        <View View style={styles.mainContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.backButton}>
              <BackButton
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
            <View style={styles.postedContainer}>
              <View style={styles.tickContainer}>
                <MaterialIcons name="done" size={35} color={Colors.dark200} />
              </View>
              <Text style={styles.tickText}>Email Updated</Text>
              <Text style={styles.tickTextDescription}>
                Your email has been successfully updated. Now you can sign in
                using your new email.
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default ChangeEmail;

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
  tickContainer: {
    backgroundColor: Colors.green,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    width: 45,
    borderRadius: 45,
  },
  postedContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.9,
  },
  tickText: {
    marginTop: 13,
    color: Colors.white,
    fontSize: 19,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  tickTextDescription: {
    marginTop: 5,
    color: Colors.whiteDarker,
    fontSize: 14,
    fontWeight: "400",
    marginHorizontal: 19,
    textAlign: "center",
  },
});
