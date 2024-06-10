import React from 'react';
import ReactDOM from 'react-dom/client';
import { css } from '@emotion/css'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// Initialize Firebase
export const app = initializeApp({
    apiKey: "AIzaSyB88i-NZRPHa6bDGbfu_3LDms-JRFb03oo",
    authDomain: "english-learning-app-vlad.firebaseapp.com",
    projectId: "english-learning-app-vlad",
    storageBucket: "english-learning-app-vlad.appspot.com",
    messagingSenderId: "827111260255",
    appId: "1:827111260255:web:b114696c27ad2e7b701bea"
});
export const db = getFirestore(app);
export const storage = getStorage(app);

const myStyle = css`
  color: #d3e2fd;
  
  select {
    border: 1px solid #d3e1fe;
    outline: 2px solid transparent;
    background: #031425;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 13px;
    margin: 0;
    padding: 6px;
    transition: box-shadow .15s;
    vertical-align: middle;
    -webkit-appearance: none;
    color: #d3e1fe;
  }
  button {
    border: 1px solid #d3e1fe;
    outline: 2px solid transparent;
    background: #031425;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: bold;
    margin: 0;
    padding: 6px;
    transition: box-shadow .15s;
    vertical-align: middle;
    -webkit-appearance: none;
    color: #d3e1fe;
    font-size: 13px;
    cursor: pointer;
  }
  
  svg {
    width: 100%;
    height: 100%;
    fill: #d3e1fe;
  }
  
  input {
    color: #d3e2fd;
    background: transparent;
    border: 1px solid #d3e1fe;
    border-radius: 4px;
    padding: 4px;
  }
`

const myapp = document.getElementById('root')
const root = ReactDOM.createRoot(myapp);
myapp.classList.add(myStyle)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
