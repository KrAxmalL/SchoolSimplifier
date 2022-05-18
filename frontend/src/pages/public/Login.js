import jwtDecode from "jwt-decode";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authentication";

import LoginForm from '../../components/login/LoginForm';
import { authActions } from "../../store/auth-slice";
import { getHomePageForUser } from "../../utils/navigation";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loginHandler = async (email, password) => {
      try {
          const {accessToken, refreshToken} = await login(email, password);
          dispatch(authActions.setAccessToken({ accessToken }));
          dispatch(authActions.setRefreshToken({ refreshToken }));
          const roles = jwtDecode(accessToken).roles;

          navigate({
              pathname: getHomePageForUser(roles)
          })
      } catch(error) {
        //todo: add proper error handling
          console.log(error);
      }
    }

    return (
        <LoginForm onLogin={loginHandler} />
    );
}

export default Login;