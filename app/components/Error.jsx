import { View, StyleSheet, Text } from "react-native";
import FontAwsome from "@expo/vector-icons/FontAwesome";
import Colors from "../Colors";

const Error = ({ text, style, fontSize }) => {
  return (
    <View style={[styles.container, style]}>
      {/* <FontAwsome
        name="bomb"
        size={fontSize ? 12 : 13}
        color={Colors.error}
        style={{ marginTop: 3 }}
      /> */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.style, { fontSize: fontSize }]}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  style: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 3,
  },
});
export default Error;
