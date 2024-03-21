import { Pressable, StyleSheet } from "react-native";
import Colors from "../Colors";
import { Feather } from "@expo/vector-icons";

const BackButton = ({ onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.backButton}>
      {/* <FontAwesome name="angle-left" size={36} color={Colors.yellow200} /> */}
      <Feather name="arrow-left" size={22} color={Colors.whiteDarker} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    borderColor: Colors.dark50,
    borderWidth: 1.5,
    borderRadius: 11,
    padding: 7,
    backgroundColor: Colors.dark95,
  },
});
