/*import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import './index.css';  // Your global CSS
import App from './App'; // Your App component

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>  {/* Only wrap App with BrowserRouter here 
      <App />
    </Router>
  </React.StrictMode>
);
*/



import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);