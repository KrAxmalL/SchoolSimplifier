import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSubjectsForTeacher } from "../../api/teacher";
import TeacherSubjectsTable from "../../components/table/TeacherSubjectsTable";

import classes from './TeacherSubjects.module.css';

function TeacherSubjects() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const subjects = await getSubjectsForTeacher(accessToken);
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
            <TeacherSubjectsTable subjects={subjects}/>
        </div>
    );
}

export default TeacherSubjects;