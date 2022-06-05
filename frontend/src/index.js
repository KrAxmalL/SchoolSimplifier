import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import { authActions } from './store/auth-slice';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';

// (() => {
//     const accessToken = localStorage.getItem('accessToken')
//     store.dispatch(authActions.loadTokensFromStorage());
//     const validAccessToken = validToken(currentAccessToken);
//     const validRefreshToken = validToken(currentRefreshToken);
//     if(!validAccessToken) {
//         console.log('access token is not valid')
//         store.dispatch(authActions.logout());
//     }
//     else {

//     }
// })();

store.dispatch(authActions.loadTokensFromStorage());

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
        <Provider store={store}>
            <BrowserRouter>
                <App name="App"></App>
            </BrowserRouter>
        </Provider>
);