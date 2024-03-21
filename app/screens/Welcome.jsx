import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, SafeAreaView } from "react-native";
import LargeButton from "../components/buttons/LargeButtonFilled";
import Colors from "../Colors";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { removeUserAction } from "../store/authorization-slice";

const Welcome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(removeUserAction());
  }, []);
  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/full_logo.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.simple}>Simple</Text>
          <Text style={styles.socializing}>Socializing.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.tnc}>
            By proceeding, I agree Swoopchat's Terms & Conditions and Privacy
            Policy.
          </Text>
          <LargeButton
            onPress={() => navigation.navigate("authenticator")}
            buttonText="Sign In / Sign Up"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 10,
    backgroundColor: Colors.dark200,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    paddingHorizontal: 18,
  },
  safeAreaView: { flex: 1, backgroundColor: Colors.dark200 },
  contentContainer: {
    justifyContent: "center",
    alignItems: "stretch",
    flex: 7,
    paddingTop: 20,
    paddingHorizontal: 6,
    backgroundColor: Colors.dark200,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: Colors.dark200,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    paddingBottom: 20,
  },
  logo: {
    height: 110,
    width: 210,
    resizeMode: "contain",
  },
  simple: {
    fontSize: 50,
    fontWeight: "100",
    color: Colors.white,
  },
  socializing: {
    fontSize: 50,
    fontWeight: "600",
    color: Colors.white,
  },
  tnc: {
    fontWeight: "300",
    color: Colors.white,
    fontSize: 12,
    textAlign: "center",
    paddingBottom: 14,
    paddingHorizontal: 10,
  },
});
