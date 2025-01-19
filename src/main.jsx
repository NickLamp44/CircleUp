import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import * as atatus from "atatus-spa";
atatus.config("34ce91bc494e460f9274eaf89a4b4ea4").install();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
atatus.notify(new Error("Test Atatus Setup"));
