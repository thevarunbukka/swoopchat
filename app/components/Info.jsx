import { View, StyleSheet, Text } from "react-native";
import FontAwsome from "@expo/vector-icons/FontAwesome";
import Colors from "../Colors";

const Info = ({ text, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* <FontAwsome name="info" size={15} color={Colors.grey} /> */}
      <Text style={styles.style}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  style: {
    color: Colors.grey,
    fontSize: 13,
    fontWeight: "400",
    marginLeft: 4,
  },
});
export default Info;
