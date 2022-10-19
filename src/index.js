import React from "react";
import ReactDOM from "react-dom/client";

// Redux
import { Provider } from "react-redux";

// Chakra UI
import { ChakraProvider } from "@chakra-ui/react";

import Layout from "./Layout";

import reportWebVitals from "./reportWebVitals";

import { store } from "./services/store";
import { saveStateToLocalStorage } from "./services/utils/localStorage";

store.subscribe(() => {
  saveStateToLocalStorage("userAuth", store.getState().userAuth);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <Layout />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
