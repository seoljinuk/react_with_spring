import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

import { BrowserRouter as Router} from "react-router-dom";

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode는 개발 도중 발생하는 문제를 좀더 감지하기 위하여 rendering을 2번 수행합니다.
  // <React.StrictMode>
<Router>
  <App />
</Router>
    

  
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
