import Store from "./store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { StoreContext } from "./store/index.ts";

import { App } from "./App.tsx";

import "./index.css";

const store = new Store();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreContext.Provider>
  </StrictMode>
);
