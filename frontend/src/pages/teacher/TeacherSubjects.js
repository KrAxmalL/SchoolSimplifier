import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getSubjectsForTeacher } from "../../api/teacher";
import ContentTable from "../../components/table/ContentTable";
import { Days } from "../../domain/constants";

import classes from './TeacherSubjects.module.css';

const subjectsDisplayFields  = ['Предмет', 'Клас', 'Група'];

function TeacherSubjects() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [subjects, setSubjects] = useState([]);

    const subjectsToDisplay = useMemo(() => {
        return subjects.map(subject => {
            return {
                subjectName: subject.subjectName,
                className: subject.className,
                groupNumber: subject.classGroupNumber !== null
                            ? subject.classGroupNumber
                            : 'Весь класс'
            }
        });
    }, [subjects]);

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
            {subjectsToDisplay.length === 0
                ? <p>Немає предметів</p>
                : <ContentTable columns={subjectsDisplayFields} data={subjectsToDisplay} />
            }
        </div>
    );
}

export default TeacherSubjects;