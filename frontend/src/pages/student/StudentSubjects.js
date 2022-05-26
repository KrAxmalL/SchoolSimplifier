import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSubjectsForStudent } from "../../api/student";
import StudentSubjectsTable from "../../components/table/StudentSubjectsTable";

import classes from './StudentSubjects.module.css';

function StudentSubjects() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const subjects = await getSubjectsForStudent(accessToken);
                setSubjects(subjects);
                console.log(JSON.stringify(subjects));
            }
            catch(er) {
                console.log(er);
            }
        }
        fetchData();
    }, [accessToken, setSubjects]);

    return (
        <div className={classes['page-container']}>
            <h2>Предмети</h2>
            <StudentSubjectsTable subjects={subjects} />
        </div>
    );
}

export default StudentSubjects;