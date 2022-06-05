import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { refreshTokens } from "../../api/authentication";
import { authActions } from "../../store/auth-slice";
import { validToken } from "../../utils/validation";

function PersistentLogin() {
    const currentAccessToken = useSelector(state => state.auth.accessToken);
    const currentRefreshToken = useSelector(state => state.auth.refreshToken);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const fetchRefreshedTokens = async () => {
            try {
                const {accessToken, refreshToken} = await refreshTokens(currentRefreshToken);
                dispatch(authActions.setAccessToken({ accessToken }));
                dispatch(authActions.setRefreshToken({ refreshToken }));
                setAuthenticated(true);
            } catch(err) {
                console.log(err);
                dispatch(authActions.logout());
                setAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        }

        const validAccessToken = validToken(currentAccessToken);
        const validRefreshToken = validToken(currentRefreshToken);
        if(!validAccessToken && !validRefreshToken) {
            dispatch(authActions.logout());
            setIsLoading(false);
            setAuthenticated(false);
        }
        else if(!validAccessToken) {
            fetchRefreshedTokens();
        }
        else {
            setIsLoading(false);
            setAuthenticated(true);
        }
    }, []);

    return (
        <React.Fragment>
            {isLoading
                ? <p>Loading...</p>
                : authenticated
                    ? <Outlet />
                    : <Navigate to='/login' />
            }
        </React.Fragment>
    );
}

export default PersistentLogin;