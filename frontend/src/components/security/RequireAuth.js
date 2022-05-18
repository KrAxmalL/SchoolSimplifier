import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Unauthorized from "../../pages/public/Unauthorized";

function RequireAuth({allowedRoles}) {
    const roles = useSelector(state => state.auth.roles);
    const location = useLocation();

    if(!roles) {
        return (
            <Navigate to='/login' state={{from: location}} replace />
        );
    }

    if(!roles.find(role => allowedRoles.includes(role))) {
        return (
            <Unauthorized />
        );
    }

    return (
        <Outlet />
    );
}

export default RequireAuth;