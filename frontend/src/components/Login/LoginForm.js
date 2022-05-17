import React from "react";

import jwtDecode from 'jwt-decode';

import { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from '../../store/auth-slice';

import {login, refreshTokens} from '../../api/authentication';

import classes from './LoginForm.module.css';

function LoginForm() {
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);

  const dispatch = useDispatch();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitFormHandler = async (e) => {
    e.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    try {
        const {accessToken, refreshToken} = await login(email, password);
        dispatch(authActions.setAccessToken({ accessToken }));
        dispatch(authActions.setRefreshToken({ refreshToken }));

        const decodedToken = jwtDecode(accessToken);
        const roles = decodedToken.roles;
        dispatch(authActions.setRoles({ roles }));
    } catch(error) {
      //todo: add proper error handling
        console.log(error);
    }
  }

  const usersHandler = async (e) => {
    e.preventDefault();

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

  //const usersHandlerBinded = usersHandler.bind({ accessToken });

  const refreshHandler = async (e) => {
    e.preventDefault();

    try {
        const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await refreshTokens(refreshToken);
        dispatch(authActions.setAccessToken(newAccessToken));
        dispatch(authActions.setRefreshToken(newRefreshToken));
    } catch(error) {
      //todo: add proper error handling
        console.log(error);
    }
  }

    return (
        <form onSubmit={submitFormHandler} className={classes['login-form']}>
            <h3>Login</h3>
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

export default LoginForm;