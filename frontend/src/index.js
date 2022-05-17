import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';

import './index.css';

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App name="App"></App>
        </BrowserRouter>
    </Provider>
);