import { Text, View, StyleSheet } from "react-native";
import Colors from "../../Colors";

const LoadingText = ({ width, height, style }) => {
  return (
    <View
      style={[
        height === 0.5 && styles.baseText05,
        height === 1 && styles.baseText1,
        height === 2 && styles.baseText2,
        height === 3 && styles.baseText3,
        height === 4 && styles.baseText4,
        height === 5 && styles.baseText5,
        height === 6 && styles.baseText6,
        height === 7 && styles.baseText7,
        height === 8 && styles.baseText8,
        height === 9 && styles.baseText9,
        height === 10 && styles.baseText10,
        style,
      ]}
    >
      <View
        style={[
          width === 1 && styles.text1,
          width === 1.5 && styles.text1o5,
          width === 2 && styles.text2,
          width === 3 && styles.text3,
          width === 4 && styles.text4,
          width === 5 && styles.text5,
          width === 6 && styles.text6,
          width === 7 && styles.text7,
          width === 8 && styles.text8,
          width === 9 && styles.text9,
          width === 10 && styles.text10,
        ]}
      ></View>
    </View>
  );
};

export default LoadingText;

const styles = StyleSheet.create({
  baseText05: {
    paddingVertical: 7,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText1: {
    paddingVertical: 8,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText2: {
    paddingVertical: 9,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText3: {
    paddingVertical: 10,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText4: {
    paddingVertical: 11,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText5: {
    paddingVertical: 12,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText6: {
    paddingVertical: 13,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText7: {
    paddingVertical: 14,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText8: {
    paddingVertical: 15,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText9: {
    paddingVertical: 16,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  baseText10: {
    paddingVertical: 17,
    backgroundColor: Colors.darkForLoading,
    flexDirection: "row",
    borderRadius: 6,
  },
  text1: {
    flex: 0.1,
  },
  text1o5: {
    flex: 0.14,
  },
  text2: {
    flex: 0.2,
  },
  text3: {
    flex: 0.3,
  },
  text4: {
    flex: 0.4,
  },
  text5: {
    flex: 0.5,
  },
  text6: {
    flex: 0.6,
  },
  text7: {
    flex: 0.7,
  },
  text8: {
    flex: 0.8,
  },
  text9: {
    flex: 0.9,
  },
  text10: {
    flex: 1,
  },
});
