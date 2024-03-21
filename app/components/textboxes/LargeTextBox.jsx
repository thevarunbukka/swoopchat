import { StyleSheet, View, TextInput, Text } from "react-native";
import Colors from "../../Colors";

const LargeTextBox = ({
  textOnLabel,
  placeholder,
  keyboardType,
  value,
  onChangeText,
  showLabel,
  style,
  maxLength,
  textStyle,
  editable,
}) => {
  if (editable === undefined) {
    editable = true;
  }
  return (
    <View style={[styles.mainContainer, style]}>
      {showLabel && (
        <View>
          <Text style={styles.label}>{"" + textOnLabel}</Text>
        </View>
      )}
      <TextInput
        style={[
          styles.textInput,
          { marginTop: showLabel == true ? 5 : 0 },
          textStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.greyTint}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        keyboardAppearance="dark"
        maxLength={maxLength}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { marginBottom: 5 },
  label: {
    color: Colors.greyTint,
    fontWeight: "500",
    fontSize: 12,
    marginLeft: 2,
  },
  textInput: {
    marginBottom: 4,
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 15,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.dark50,
    color: Colors.white,
    fontWeight: "500",
  },
});
export default LargeTextBox;
