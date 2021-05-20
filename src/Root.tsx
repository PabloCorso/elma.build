import React from "react";
import ReactDOM from "react-dom";
import App from "./js/components/app";
import { ElectronApi } from "./preload";
import { CssBaseline } from "@material-ui/core";

declare global {
  interface Window {
    electron: ElectronApi;
  }
}

ReactDOM.render(
  <>
    <App />
    <CssBaseline />
  </>,
  document.querySelector("[data-js=root]")
);
