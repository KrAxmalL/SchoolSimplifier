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
        link: '/teacher/markBook',
        title: 'Mark Book'
    },
    {
        link: '/teacher/myClass',
        title: 'My Class'
    },
    {
        link: '/teacher/myClassMarkBook',
        title: 'My Class Mark Book'
    },
];

function FormTeacherLayout(props) {

    return (
        <Layout menus={teacherMenus}>
            <Outlet />
        </Layout>
    );
}

export default FormTeacherLayout;