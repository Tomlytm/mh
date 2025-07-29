// import * as eva from "@eva-design/eva";
// import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
// import { EvaIconsPack } from "@ui-kitten/eva-icons";
// import * as SplashScreen from "expo-splash-screen";
import { StoreProvider } from "easy-peasy";
import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./app/tabs/app.navigator";
import store from "./app/util/token.store";
import { initI18n } from "./app/translation/i18n";


// SplashScreen.preventAutoHideAsync();

function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    console.log("App: Starting initialization...");
    
    // Set a very short delay to ensure splash screen shows briefly, then start app
    const startApp = () => {
      console.log("App: Setting app as ready");
      setAppIsReady(true);
    };

    // Initialize i18n in background without blocking
    console.log("App: Starting i18n in background...");
    initI18n()
      .then(() => {
        console.log("App: i18n initialized successfully");
      })
      .catch((error) => {
        console.error("App: i18n failed, continuing without it:", error);
      });

    // Start app immediately after a minimal delay
    setTimeout(startApp, 1000);
  }, []);

  console.log("App: Render - appIsReady:", appIsReady);

  if (!appIsReady) {
    console.log("App: Still initializing...");
    return null;
  }

  console.log("App: Rendering main app");
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
