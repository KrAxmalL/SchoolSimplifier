import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import { authActions } from './store/auth-slice';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';

store.dispatch(authActions.loadTokensFromStorage());

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App name="App"></App>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);