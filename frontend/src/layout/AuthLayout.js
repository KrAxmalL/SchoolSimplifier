import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { getMenusForRole } from "../utils/navigation";
import Layout from "./Layout";

function AuthLayout() {
    const roles = useSelector(state => state.auth.roles);
    const menus = roles.map(role => getMenusForRole(role))
                       .reduce((prev, curr) => [...prev, ...curr], []);

    return (
        <Layout menus={menus} needLogout>
            <Outlet />
        </Layout>
    );
}

export default AuthLayout;