import { useMemo } from "react";
import { Days } from "../../domain/constants";
import { sortScheduleRecords } from "../../utils/sorting";
import ContentTable from "./ContentTable";

const getScheduleRecordsForDay = (schedule, day) => {
    const dayScheduleRecords = schedule.filter(scheduleRecord => {
        const lowerCaseRecordDay = scheduleRecord.day.toLowerCase();
        const lowerCaseProvidedDay = day.toLowerCase();
        return lowerCaseRecordDay.localeCompare(lowerCaseProvidedDay) === 0;
    });
    return dayScheduleRecords;
};

const ScheduleTable = (props) => {
    const scheduleColumns = props.scheduleColumns
    const scheduleRecords = props.scheduleRecords;

    const scheduleByDays = useMemo(() => {
        const scheduleRecordsSorted = sortScheduleRecords([...scheduleRecords]);
        return Object.keys(Days).map(dayNameField => {
            const dayName = Days[dayNameField];
            return {
                dayName,
                scheduleRecords: getScheduleRecordsForDay(scheduleRecordsSorted, dayName),
            }
        });
    }, [scheduleRecords]);

    return (
        scheduleByDays.map(daySchedule => {
            const {dayName, scheduleRecords} = daySchedule;
            const scheduleRecordsMapped = scheduleRecords.map(scheduleRecord => {
                const res = {...scheduleRecord};
                delete res.day;
                return res;
            });
            return (
                <div key={dayName}>
                    <h3>{dayName}</h3>
                    {scheduleRecords.length === 0
                        ? <p>Немає уроків у цей день</p>
                        : <ContentTable columns={scheduleColumns} data={scheduleRecordsMapped} />
                    }
                </div>
            );
        })
    );
}

export default ScheduleTable;