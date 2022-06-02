import React, { useRef } from "react";

import classes from './LoginForm.module.css';

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
      <div className={classes['login-form-container']}>
        <form onSubmit={submitFormHandler} className={classes['login-form']}>
            <h3>Будь ласка, увійдіть до системи</h3>
            <label htmlFor="email">Ваш e-mail</label>
            <input type='email' id='email' placeholder="Ваш e-mail" ref={emailInputRef}></input>
            <label htmlFor="password">Ваш пароль</label>
            <input type='password' id='password' placeholder="Ваш пароль" ref={passwordInputRef}></input>
            <input className={classes['login-form-submit-btn']} type='submit' value='Увійти в систему'></input>
        </form>
      </div>
    );
}

export default LoginForm;