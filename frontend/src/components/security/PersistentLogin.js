import jwtDecode from "jwt-decode";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { refreshTokens } from "../../api/authentication";
import { authActions } from "../../store/auth-slice";

function PersistentLogin() {

    // const accessToken = useSelector(state => state.auth.accessToken);
    // const refreshToken = useSelector(state => state.auth.refreshToken);
    // const dispatch = useDispatch();

    // useEffect(() => {

    // });

    // if(!accessToken) {
    //     try {
    //       const {accessToken, refreshToken} = await refreshTokens(refreshToken);
    //       dispatch(authActions.setAccessToken({ accessToken }));
    //       dispatch(authActions.setRefreshToken({ refreshToken }));
    //       const roles = jwtDecode(accessToken).roles;
    //     }
    //     dispatch(authActions.logout());
    //     <Navigate to='/login' />
    // }

    // const expirationDate = jwtDecode(accessToken).exp;
    // console.log(expirationDate);
    // console.log(expirationDate * 1000);
    // console.log(Date.now());

    // if(expirationDate * 1000 < Date.now()) {
    //      //dispatch(authActions.logout());
    //     return <Navigate to='/login' />
    // }
    // else {
    //     return (
    //         <Outlet />
    //     );
    // }
}

export default PersistentLogin;