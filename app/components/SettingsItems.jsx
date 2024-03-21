import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  Switch,
  Platform,
} from "react-native";
import Colors from "../Colors";

export const TopSettingsItem = ({ settingsName, style, children, onPress }) => {
  return (
    <View>
      <Pressable style={styles.topSettingsItem} onPress={onPress}>
        {children}
        <Text style={[styles.settingsText, style]}>{settingsName}</Text>
      </Pressable>
    </View>
  );
};
export const MiddleSettingsItem = ({
  settingsName,
  style,
  children,
  onPress,
}) => {
  return (
    <View>
      <Pressable style={styles.middleSettingsItem} onPress={onPress}>
        {children}
        <Text style={[styles.settingsText, style]}>{settingsName}</Text>
      </Pressable>
    </View>
  );
};

export const MiddleSettingsItemWithSwitch = ({
  settingsName,
  style,
  children,
  switchValue,
  onSwitchValueChange,
}) => {
  return (
    <View
      style={[
        styles.middleSettingsItemWithSwitchContainer,
        Platform.OS !== "ios" && { paddingVertical: 4 },
        Platform.OS === "ios" && { paddingVertical: 12 },
      ]}
    >
      <Pressable style={styles.middleSettingsItemWithSwitch}>
        {children}
        <Text style={[styles.settingsText, style]}>{settingsName}</Text>
      </Pressable>
      <Switch
        trackColor={{
          false: Colors.grey,
          true: Colors.messageRecieved,
        }}
        thumbColor={switchValue ? Colors.yellow200 : Colors.white}
        ios_backgroundColor={Colors.dark100}
        onValueChange={onSwitchValueChange}
        value={switchValue}
        style={
          Platform.OS === "ios" && {
            transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
          }
        }
      />
    </View>
  );
};

export const BottomSettingsItem = ({
  settingsName,
  style,
  children,
  onPress,
}) => {
  return (
    <View>
      <Pressable style={styles.bottomSettingsItem} onPress={onPress}>
        {children}
        <Text style={[styles.settingsText, style]}>{settingsName}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  topSettingsItem: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.dark100,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    //
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: Colors.dark90,
  },
  middleSettingsItem: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.dark100,
    borderTopWidth: 1.5,
    borderColor: Colors.dark90,
    //
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
  },
  bottomSettingsItem: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.dark100,
    borderTopWidth: 1.5,
    borderColor: Colors.dark90,
    borderBottomLeftRadius: 19,
    borderBottomRightRadius: 19,
    //
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
  },

  settingsText: {
    fontSize: 16,
    fontWeight: "500",
    paddingLeft: 10,
    color: Colors.white,
  },
  middleSettingsItemWithSwitchContainer: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.dark100,
    borderTopWidth: 1.5,
    borderColor: Colors.dark90,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  middleSettingsItemWithSwitch: {
    alignItems: "center",
    flexDirection: "row",
  },
});
