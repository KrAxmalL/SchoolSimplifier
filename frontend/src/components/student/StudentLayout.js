import { Outlet } from "react-router-dom";
import Layout from "../../layout/Layout";

const studentMenus = [
    {
        link: '/student/schedule',
        title: 'Schedule'
    },
    {
        link: '/student/subjects',
        title: 'Subjects'
    },
    {
        link: '/student/class',
        title: 'My Class'
    }
];

function StudentLayout(props) {

    return (
        <Layout menus={studentMenus}>
            <Outlet />
        </Layout>
    );
}

export default StudentLayout;