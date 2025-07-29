// import * as eva from "@eva-design/eva";
// import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
// import { EvaIconsPack } from "@ui-kitten/eva-icons";
// import * as SplashScreen from "expo-splash-screen";
import { StoreProvider } from "easy-peasy";
import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./app/tabs/app.navigator";
import store from "./app/util/token.store";
import { initI18n } from "./app/translation/i18n";


// SplashScreen.preventAutoHideAsync();

function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize i18n manually
        await initI18n();

        setAppIsReady(true);
        // await SplashScreen.hideAsync(); // Hide splash screen when app is ready
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StoreProvider store={store}>
        {/* <IconRegistry icons={EvaIconsPack} /> */}
        {/* <ApplicationProvider {...eva} theme={eva.light}> */}
          <AppNavigator />
        {/* </ApplicationProvider> */}
      </StoreProvider>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
