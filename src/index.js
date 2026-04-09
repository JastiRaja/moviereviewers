import React from "react";
import ReactDom from "react-dom/client"
import App from "./App.jsx"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./global.css"

ReactDom.createRoot(document.getElementById("root")).render(<App/>)