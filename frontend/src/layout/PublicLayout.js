import { Outlet } from "react-router-dom";
import Layout from "./Layout";

const menus = [
    {
        link: '/home',
        title: 'Домашня сторінка'
    },
    {
        link: '/login',
        title: 'Авторизація'
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