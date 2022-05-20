import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassDataForTeacher } from "../../api/teacher";
import ContentTable from "../../components/table/ContentTable";
import { Days } from "../../domain/constants";

import classes from './TeacherClass.module.css';

const studentDisplayFields  = ['Порядковий номер учня', 'ПІБ'];
const scheduleDisplayFields = ['Номер уроку', 'Предмет', 'Час', 'Група', 'Вчитель'];

const studentsToDisplayStudents = (students) => {
    return students.map((student, index) => {
        return {
            number: index + 1,
            studentInitials: `${student.studentLastName} ${student.studentFirstName} ${student.studentPatronymic}`
        }
    })
};

const getScheduleRecordsForDay = (schedule, day) => {
    return schedule.filter(scheduleRecord =>
        scheduleRecord.day.toLowerCase()
                          .localeCompare(day.toLowerCase()) === 0
    );
};

const transformScheduleForDisplaying = (schedule) => {
    return schedule.map(scheduleRecord => {
        return {
            lessonNumber: scheduleRecord.lessonNumber,
            subjectName: scheduleRecord.subjectName,
            lessonTime: `${scheduleRecord.lessonStartTime} - ${scheduleRecord.lessonFinishTime}`,
            groupNumber: scheduleRecord.groupNumber !== null
                            ? scheduleRecord.groupNumber
                            : 'Весь клас',
            teacherInitials: `${scheduleRecord.teacherLastName} ${scheduleRecord.teacherFirstName} ${scheduleRecord.teacherPatronymic}`
        }
    });
};

function TeacherClass() {
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

    const scheduleByDays = useMemo(() => {
        if(classData) {
            return {
                monday: getScheduleRecordsForDay(classData.classScheduleRecords, Days.MONDAY),
                tuesday: getScheduleRecordsForDay(classData.classScheduleRecords, Days.TUESDAY),
                wednesday: getScheduleRecordsForDay(classData.classScheduleRecords, Days.WEDNESDAY),
                thursday: getScheduleRecordsForDay(classData.classScheduleRecords, Days.THURSDAY),
                friday: getScheduleRecordsForDay(classData.classScheduleRecords, Days.FRIDAY),
                saturday: getScheduleRecordsForDay(classData.classScheduleRecords, Days.SATURDAY),
            }
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
                    <ContentTable columns={studentDisplayFields} data={studentsToDisplayStudents(classData.classStudents)} />
                    {groupsToDisplay}
                    <p>Розклад класу</p>

                </React.Fragment>
            }
            <h2>Розклад уроків</h2>
            {scheduleByDays &&
                Object.keys(scheduleByDays).map(dayName => {
                    return (
                        <div key={dayName}>
                            <h3>{Days[dayName.toUpperCase()]}</h3>
                            {scheduleByDays[dayName].length === 0
                                ? <p>Немає уроків у цей день</p>
                                : <ContentTable columns={scheduleDisplayFields} data={transformScheduleForDisplaying(scheduleByDays[dayName])} />
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}

export default TeacherClass;