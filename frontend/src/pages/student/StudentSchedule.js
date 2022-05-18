import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getScheduleForStudent } from "../../api/student";
import ContentTable from "../../components/table/ContentTable";
import { Days } from "../../domain/constants";

import classes from './StudentSchedule.module.css';

const scheduleDisplayFields  = ['Номер уроку', 'Час', 'Предмет', 'Вчитель'];

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
            lessonTime: `${scheduleRecord.lessonStartTime} - ${scheduleRecord.lessonFinishTime}`,
            subject: scheduleRecord.subjectName,
            teacherInitials: `${scheduleRecord.teacherLastName} ${scheduleRecord.teacherFirstName} ${scheduleRecord.teacherPatronymic}`
        }
    });
};

function StudentSchedule() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [schedule, setSchedule] = useState([]);

    const scheduleByDays = useMemo(() => {
        return {
            monday: getScheduleRecordsForDay(schedule, Days.MONDAY),
            tuesday: getScheduleRecordsForDay(schedule, Days.TUESDAY),
            wednesday: getScheduleRecordsForDay(schedule, Days.WEDNESDAY),
            thursday: getScheduleRecordsForDay(schedule, Days.THURSDAY),
            friday: getScheduleRecordsForDay(schedule, Days.FRIDAY),
            saturday: getScheduleRecordsForDay(schedule, Days.SATURDAY),
        }
    }, [schedule]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const schedule = await getScheduleForStudent(accessToken);
                setSchedule(schedule);
                console.log(JSON.stringify(schedule));
            }
            catch(er) {
                console.log(er);
            }
        }
        fetchData();
    }, [accessToken, setSchedule]);

    return (
        <div className={classes['page-container']}>
            <h2>Розклад уроків</h2>
            {
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

export default StudentSchedule;