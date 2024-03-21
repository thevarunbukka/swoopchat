import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import Colors from "../../Colors";
const ProfileButtons = ({ onPress, buttonText, style, disabled }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.buttonWrapper, style]}
    >
      <Text style={[styles.buttonText, { color: style.color }]}>
        {buttonText}
      </Text>
    </Pressable>
  );
};

export default ProfileButtons;

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 13,
    backgroundColor: Colors.yellowTint,
    paddingVertical: 7,
    borderWidth: 0,
    marginRight: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: Colors.white,
  },
});
