import React from "react";

import { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from './../store/auth-slice';

import {login, refreshTokens} from './../api/authentication';

function Login() {
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);

  const dispatch = useDispatch();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitFormHandler = async (e) => {
    e.preventDefault();

    console.log('submitting')

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    try {
        const {accessToken, refreshToken} = await login(email, password);
        console.log(accessToken);
        console.log(refreshToken);
        dispatch(authActions.setAccessToken(accessToken));
        dispatch(authActions.setAccessToken(refreshToken));
    } catch(error) {
        console.log(error);
    }
  }

  const usersHandler = async () => {
    const response = await fetch('http://localhost:8000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if(response.ok) {
      const body = await response.json();
      console.log(body);
    }
  }

  const refreshHandler = async (e) => {
    e.preventDefault();

    try {
        const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await refreshTokens(refreshToken);
        console.log(newAccessToken);
        console.log(newRefreshToken);
        dispatch(authActions.setAccessToken(newAccessToken));
        dispatch(authActions.setAccessToken(newRefreshToken));
    } catch(error) {
        console.log(error);
    }
  }

    return (
        <form onSubmit={submitFormHandler}>
            <label htmlFor="email">Your email</label>
            <input type='email' id='email' placeholder="Please, enter your email" ref={emailInputRef}></input>
            <label htmlFor="password">Your password</label>
            <input type='password' id='password' placeholder="Please, enter your password" ref={passwordInputRef}></input>
            <input type='submit' value='Login'></input>
            <button onClick={usersHandler}>Users</button>
            <button onClick={refreshHandler}>Refresh</button>
        </form>
    );
}

export default Login;