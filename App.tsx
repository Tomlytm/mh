import React, { useState, useEffect } from 'react';
import { StoreProvider } from "easy-peasy";
import { View } from "react-native";

import AppNavigator from "./app/tabs/app.navigator";
import store from "./app/util/token.store";
import { initI18n } from "./app/translation/i18n";

function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    console.log("App: Starting initialization...");
    
    // Initialize i18n in background - don't block app startup
    initI18n()
      .then(() => {
        console.log("App: i18n initialized successfully");
      })
      .catch((error) => {
        console.error("App: i18n failed, continuing without it:", error);
      });

    // Start app after minimal delay
    setTimeout(() => {
      console.log("App: App is ready");
      setAppIsReady(true);
    }, 500);
  }, []);

  console.log("App: Render - appIsReady:", appIsReady);

  if (!appIsReady) {
    console.log("App: Still initializing...");
    return null;
  }

  console.log("App: Rendering main app");
  return (
    <View style={{ flex: 1 }}>
      <StoreProvider store={store}>
        <AppNavigator />
      </StoreProvider>
    </View>
  );
}

export default App;