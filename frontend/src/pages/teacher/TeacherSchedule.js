import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getScheduleForTeacher } from "../../api/teacher";
import TeacherScheduleTable from "../../components/table/TeacherScheduleTable";
import classes from './TeacherSchedule.module.css';

function TeacherSchedule() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const schedule = await getScheduleForTeacher(accessToken);
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
            <TeacherScheduleTable scheduleRecords={schedule} />
        </div>
    );
}

export default TeacherSchedule;