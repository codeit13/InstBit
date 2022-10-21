import React from "react";
import ReactDOM from "react-dom/client";

// Redux
import { Provider } from "react-redux";

// Chakra UI
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import Layout from "./Layout";

import reportWebVitals from "./reportWebVitals";

import { store } from "./services/store";
import { saveStateToLocalStorage } from "./services/utils/localStorage";

// import { initFacebookSdk } from "./helpers/initFacebookSdk";

store.subscribe(() => {
  saveStateToLocalStorage("userAuth", store.getState().userAuth);
});

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
});

// wait for facebook sdk before startup
// initFacebookSdk();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Layout />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
