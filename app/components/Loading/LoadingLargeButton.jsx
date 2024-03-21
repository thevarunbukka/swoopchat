import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import Colors from "../../Colors";
const LoadingLargeButton = ({ style }) => {
  return (
    <View style={[styles.buttonWrapper, style]}>
      <View>
        <ActivityIndicator
          size={"small"}
          color={Colors.grey}
          style={{ paddingHorizontal: 13 }}
        />
      </View>
    </View>
  );
};

export default LoadingLargeButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 9,
    backgroundColor: Colors.darkForLoading,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: Colors.darkForLoading,
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.darkForLoading,
    // padding: 10,
  },
});
