import React from "react";
import ReactDom from "react-dom/client"
import App from "./App.jsx"
import "./global.css"
import "../node_modules/react-bootstrap/dist/react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';

ReactDom.createRoot(document.getElementById("root")).render(<App/>)