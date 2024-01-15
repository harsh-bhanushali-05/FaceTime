import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SocketPro } from './util/SocketContext';
import { BrowserRouter as Router } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <SocketPro abs=" ">
      <App />
    </SocketPro>
  </Router>
);