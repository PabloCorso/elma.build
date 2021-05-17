import React from "react";
import ReactDOM from "react-dom";
import List from "./js/components/List";
// import { Level } from "elmajs";

// console.log(Level);
ReactDOM.render(
  <h2>
    <List />
  </h2>,
  document.querySelector("[data-js=app]")
);
