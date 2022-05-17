import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
        refreshToken: null,
        roles: null,
    },
    reducers: {
        setAccessToken(state, action) {
            const newToken = action.payload.accessToken;
            state.accessToken = newToken;
            localStorage.setItem('accessToken', newToken);
            state.roles = jwtDecode(newToken).roles;
        },

        setRefreshToken(state, action) {
            const newToken = action.payload.refreshToken;
            state.refreshToken = newToken;
            localStorage.setItem('refreshToken', newToken);
        },

        deleteAccessToken(state, action) {
            state.accessToken = null;
            localStorage.removeItem('accessToken');
            state.roles = null;
        },

        deleteRefreshToken(state, action) {
            state.refreshToken = null;
            localStorage.removeItem('refreshToken');
        },

        loadTokensFromStorage(state, action) {
            const loadedAccessToken = localStorage.getItem('accessToken');
            const loadedRefreshToken = localStorage.getItem('refreshToken');
            if(loadedAccessToken) {
                state.accessToken = loadedAccessToken;
                state.roles = jwtDecode(loadedAccessToken).roles;
            }
            if(loadedRefreshToken) {
                state.refreshToken = loadedRefreshToken;
            }
        },

        logout(state, action) {
            state.accessToken = null;
            localStorage.removeItem('accessToken');
            state.refreshToken = null;
            localStorage.removeItem('refreshToken');
            state.roles = null;
        }
    }
});

export const authActions = authSlice.actions;
export default authSlice;