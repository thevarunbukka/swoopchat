import { StyleSheet, View, TextInput, Text } from "react-native";
import Colors from "../../Colors";
import LoadingText from "./LoadingText";

const LoadingLargeTextBox = ({ textOnLabel, showLabel, style, textStyle }) => {
  return (
    <View style={[styles.mainContainer, style]}>
      {showLabel && (
        <View>
          <Text style={styles.label}>{"" + textOnLabel}</Text>
        </View>
      )}
      <View
        style={[
          styles.textInput,
          { marginTop: showLabel == true ? 5 : 0 },
          textStyle,
        ]}
      >
        <Text style={{ color: Colors.darkForLoading }}>.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { marginBottom: 5 },
  label: { color: Colors.greyTint, fontWeight: "400", fontSize: 12 },
  textInput: {
    marginBottom: 4,
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 15,
    borderRadius: 9,
    backgroundColor: Colors.darkForLoading,
    color: Colors.white,
    fontWeight: "500",
  },
});
export default LoadingLargeTextBox;
