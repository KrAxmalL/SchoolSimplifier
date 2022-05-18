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
            {props.children}
        </Layout>
    );
}

export default StudentLayout;