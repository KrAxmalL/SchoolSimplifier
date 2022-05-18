import { Outlet } from "react-router-dom";
import Layout from "../../layout/Layout";

const teacherMenus = [
    {
        link: '/teacher/schedule',
        title: 'Schedule'
    },
];

function TeacherLayout(props) {

    return (
        <Layout menus={teacherMenus}>
            <Outlet />
        </Layout>
    );
}

export default TeacherLayout;