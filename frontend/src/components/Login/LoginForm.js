import React from "react";

import jwtDecode from 'jwt-decode';

import { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from '../../store/auth-slice';

import {login, refreshTokens} from '../../api/authentication';

import classes from './LoginForm.module.css';
import { Navigate } from "react-router-dom";

function LoginForm(props) {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitFormHandler = async (e) => {
    e.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    props.onLogin(email, password);
  }

    return (
        <form onSubmit={submitFormHandler} className={classes['login-form']}>
            <h3>Login</h3>
            <label htmlFor="email">Your email</label>
            <input type='email' id='email' placeholder="Please, enter your email" ref={emailInputRef}></input>
            <label htmlFor="password">Your password</label>
            <input type='password' id='password' placeholder="Please, enter your password" ref={passwordInputRef}></input>
            <input type='submit' value='Login'></input>
        </form>
    );
}

export default LoginForm;