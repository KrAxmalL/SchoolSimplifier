import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getSubjectsForStudent } from "../../api/student";
import ContentTable from "../../components/table/ContentTable";
import { Days } from "../../domain/constants";

import classes from './StudentSubjects.module.css';

const subjectsDisplayFields  = ['Предмет', 'Група', 'Вчитель'];

function StudentSubjects() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [subjects, setSubjects] = useState([]);

    const subjectsToDisplay = useMemo(() => {
        return subjects.map(subject => {
            return {
                subjectName: subject.subjectName,
                group: subject.classGroupNumber
                            ? subject.classGroupNumber
                            : 'Весь класс',
                teacherInitials: `${subject.teacherLastName} ${subject.teacherFirstName} ${subject.teacherPatronymic}`
            }
        });
    }, [subjects]);

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
            {subjectsToDisplay.length === 0
                ? <p>Немає предметів</p>
                : <ContentTable columns={subjectsDisplayFields} data={subjectsToDisplay} />
            }
        </div>
    );
}

export default StudentSubjects;