import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassDataForStudent, getSubjectsForStudent } from "../../api/student";
import ContentTable from "../../components/table/ContentTable";
import GroupsStudents from "../../components/table/GroupsStudents";
import StudentsTable from "../../components/table/StudentsTable";
import { getFullNameFromInitials } from "../../utils/transformation";

import classes from './StudentClass.module.css';

function StudentClass() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const classData = await getClassDataForStudent(accessToken);
                setClassData(classData);
                console.log(JSON.stringify(classData));
            }
            catch(er) {
                console.log(er);
            }
        }
        fetchData();
    }, [accessToken, setClassData]);

    return (
        <div className={classes['page-container']}>
            <h2>Мій клас</h2>
            {classData &&
                <React.Fragment>
                    <p>{classData.schoolClassName}</p>
                    <p>Класний керівник: {getFullNameFromInitials(classData.formTeacher)}</p>
                    <p>Список учнів</p>
                    <StudentsTable students={classData.classStudents} />
                    <GroupsStudents groupStudents={classData.groupStudents} />
                </React.Fragment>
            }
        </div>
    );
}

export default StudentClass;