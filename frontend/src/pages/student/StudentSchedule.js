import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getScheduleForStudent } from "../../api/student";
import StudentScheduleTable from "../../components/table/StudentScheduleTable";

import classes from './StudentSchedule.module.css';

function StudentSchedule() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [schedule, setSchedule] = useState([]);

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
            <StudentScheduleTable scheduleRecords={schedule}></StudentScheduleTable>
        </div>
    );
}

export default StudentSchedule;