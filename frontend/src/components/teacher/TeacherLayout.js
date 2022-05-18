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
            {props.children}
        </Layout>
    );
}

export default TeacherLayout;