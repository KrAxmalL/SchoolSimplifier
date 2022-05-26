import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassDataForTeacher } from "../../api/formteacher";
import FormTeacherScheduleTable from "../../components/table/FormTeacherScheduleTable";
import GroupsStudents from "../../components/table/GroupsStudents";
import StudentsTable from "../../components/table/StudentsTable";

import classes from './FormTeacherClass.module.css';

function FormTeacherClass() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const classData = await getClassDataForTeacher(accessToken);
                setClassData(classData);
                console.log(`teacher class data: ${JSON.stringify(classData)}`);
            }
            catch(er) {
                console.log(`teacher class error: ${er}`);
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
                    <p>Список учнів</p>
                    <StudentsTable students={classData.classStudents} />
                    <GroupsStudents groupStudents={classData.groupStudents} />

                    <h2>Розклад уроків</h2>
                    <FormTeacherScheduleTable scheduleRecords={classData.classScheduleRecords} />

                </React.Fragment>
            }
        </div>
    );
}

export default FormTeacherClass;