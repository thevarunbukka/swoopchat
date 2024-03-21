import { StyleSheet, View, TextInput, Text, Pressable } from "react-native";
import Colors from "../../Colors";
import { Feather } from "@expo/vector-icons";

const SearchBox = ({
  textOnLabel,
  placeholder,
  keyboardType,
  value,
  onChangeText,
  style,
  maxLength,
  textStyle,
  onFocus,
  autoFocus,
  onSubmitEditing,
}) => {
  return (
    <View style={[styles.mainContainer, style]}>
      <Feather name="search" size={19} color={Colors.greyTint} />
      <TextInput
        onFocus={onFocus}
        style={[
          styles.textInput,
          // { marginTop: showLabel == true ? 5 : 0 },
          textStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.greyTint}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        keyboardAppearance="dark"
        maxLength={maxLength}
        autoFocus={autoFocus}
        // editable={editable}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.dark95,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.dark92,
  },
  textInput: {
    // paddingVertical: 11,
    paddingHorizontal: 9,
    fontSize: 17,
    borderRadius: 9,
    // borderWidth: 2,
    // borderColor: Colors.yellowTint,
    // backgroundColor: Colors.white,
    color: Colors.white,
    fontWeight: "500",
    flex: 1,
  },
});
export default SearchBox;
