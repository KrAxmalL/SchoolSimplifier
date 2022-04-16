import { DOMAIN_URL } from "../config/config";

const LOGIN_URL = DOMAIN_URL + '/login';
const REFRESH_URL = DOMAIN_URL + '/token/refresh';
const LOGOUT_URL = DOMAIN_URL + '/logout';


export async function login(email, password) {
    const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Login failed");
    }
};

export async function refreshTokens(refreshToken) {
    const response = await fetch(REFRESH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
           refreshToken
        })
    });

    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Refreshing failed");
    }
};