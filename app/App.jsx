import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Colors from "./Colors";
import { Provider } from "react-redux";
import store from "./store/index";
import Navigations from "./Navigations";

const App = () => {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <View style={styles.container}>
          <Navigations />
        </View>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark200,
  },
});

export default App;
