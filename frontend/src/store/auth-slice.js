import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
        refreshToken: null
    },
    reducers: {
        setAccessToken(state, action) {
            state.accessToken = action.payload.accessToken;
        },

        setRefreshToken(state, action) {
            state.refreshToken = action.payload.refreshToken;
        }
    }
});

export const authActions = authSlice.actions;
export default authSlice;