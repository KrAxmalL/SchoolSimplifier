import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { getMenusForRole } from "../utils/navigation";
import Layout from "./Layout";

const menus = [
    {
        link: '/home',
        title: 'Home'
    },
    {
        link: '/login',
        title: 'Login'
    }
];

function PublicLayout() {
    return (
        <Layout menus={menus}>
            <Outlet />
        </Layout>
    );
}

export default PublicLayout;