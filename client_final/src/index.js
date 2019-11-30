import React from 'react';
import ReactDOM from 'react-dom';

import './styles/global.css';
import './styles/new.css';

import { Provider } from './Context';
import App from './App';

import 'bootstrap/dist/css/bootstrap.css';
import "antd/dist/antd.css";

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'));
