import jwtDecode from "jwt-decode";

export const validToken = (token) => {
    if(!token) {
        return false;
    }

    const tokenDate = jwtDecode(token).exp * 1000;
    const now = (new Date()).getTime();
    return tokenDate >= now;
}

export const dateIsLessEqualThan = (startDate, finishDate) => {
    return startDate.getTime() <= finishDate.getTime();
}