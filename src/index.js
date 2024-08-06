import React from "react";
import ReactDom from "react-dom/client"
import App from "./App.jsx"
import "./global.css"
import "../node_modules/react-bootstrap/dist/react-bootstrap";

ReactDom.createRoot(document.getElementById("root")).render(<App/>)