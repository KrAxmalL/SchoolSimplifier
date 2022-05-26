import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassDataForTeacher } from "../../api/formteacher";
import FormTeacherScheduleTable from "../../components/table/FormTeacherScheduleTable";
import StudentsTable from "../../components/table/StudentsTable";

import classes from './FormTeacherClass.module.css';


function FormTeacherClass() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classData, setClassData] = useState(null);

    const groupsToDisplay = useMemo(() => {
        if(classData) {
            return Object.keys(classData.groupStudents).map(groupNumber => {
                return (
                    <div key={groupNumber}>
                        <p>Учні {groupNumber} групи</p>
                        <StudentsTable students={classData.groupStudents[groupNumber]} />
                    </div>
                );
            });
        }
    }, [classData]);

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
                    {groupsToDisplay}
                    <p>Розклад класу</p>

                </React.Fragment>
            }
            <h2>Розклад уроків</h2>
            {classData &&
                <FormTeacherScheduleTable scheduleRecords={classData.classScheduleRecords} />
            }
        </div>
    );
}

export default FormTeacherClass;