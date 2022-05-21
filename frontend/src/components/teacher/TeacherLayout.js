import { Outlet } from "react-router-dom";
import Layout from "../../layout/Layout";

const teacherMenus = [
    {
        link: '/teacher/schedule',
        title: 'Schedule'
    },
    {
        link: '/teacher/subjects',
        title: 'Subjects'
    },
    {
        link: '/teacher/class',
        title: 'Class'
    },
    {
        link: '/teacher/markBook',
        title: 'Class mark book'
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