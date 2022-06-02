import { Outlet } from "react-router-dom";
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