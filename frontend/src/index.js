import React from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.scss";
import App from './App';
import "@babel/polyfill";

const rootElement = document.getElementById("root");
render(<App />, rootElement);