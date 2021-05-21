import React from "react";
import ReactDOM from "react-dom";
import App from "./js/components/app";
import { ElectronApi } from "./preload";

declare global {
  interface Window {
    electron: ElectronApi;
  }
}

ReactDOM.render(<App />, document.querySelector("[data-js=root]"));
