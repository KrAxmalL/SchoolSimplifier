import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassDataForStudent, getSubjectsForStudent } from "../../api/student";
import ContentTable from "../../components/table/ContentTable";
import { Days } from "../../domain/constants";

import classes from './StudentClass.module.css';

const studentDisplayFields  = ['Порядковий номер учня', 'ПІБ'];

const studentsToDisplayStudents = (students) => {
    return students.map((student, index) => {
        return {
            number: index + 1,
            studentInitials: `${student.studentLastName} ${student.studentFirstName} ${student.studentPatronymic}`
        }
    })
};

function StudentClass() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classData, setClassData] = useState(null);

    const groupsToDisplay = useMemo(() => {
        if(classData) {
            return Object.keys(classData.groupStudents).map(groupNumber => {
                return (
                    <div key={groupNumber}>
                        <p>Учні {groupNumber} групи</p>
                        <ContentTable columns={studentDisplayFields} data={studentsToDisplayStudents(classData.groupStudents[groupNumber])} />
                    </div>
                );
            });
        }
    }, [classData]);

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
                    <p>Класний керівник: {`${classData.teacherLastName} ${classData.teacherFirstName} ${classData.teacherPatronymic}`}</p>
                    <p>Список учнів</p>
                    <ContentTable columns={studentDisplayFields} data={studentsToDisplayStudents(classData.classStudents)} />
                    {groupsToDisplay}
                </React.Fragment>
            }
        </div>
    );
}

export default StudentClass;