import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import Colors from "../../Colors";
const LargeButton = ({ onPress, buttonText, style, disabled }) => {
  return (
    <View style={[styles.buttonWrapper, style]}>
      <Pressable onPress={onPress} disabled={disabled}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
};

export default LargeButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 9,
    backgroundColor: Colors.yellow200,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: Colors.yellow200,
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.dark200,
  },
});
