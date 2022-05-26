import ScheduleTable from "./ScheduleTable";

const scheduleDisplayFields  = ['Номер уроку', 'Час', 'Предмет', 'Клас', 'Група'];

const transformScheduleForDisplaying = (schedule) => {
    return schedule.map(scheduleRecord => {
        return {
            day: scheduleRecord.day,
            lessonNumber: scheduleRecord.lessonNumber,
            lessonTime: `${scheduleRecord.lessonStartTime} - ${scheduleRecord.lessonFinishTime}`,
            subjectName: scheduleRecord.subjectName,
            className: scheduleRecord.className,
            groupNumber: scheduleRecord.groupNumber !== null
                            ? scheduleRecord.groupNumber
                            : 'Весь клас'
        }
    });
};

const TeacherScheduleTable = (props) => {
    const scheduleRecords = props.scheduleRecords;

    return (
        <ScheduleTable scheduleColumns={scheduleDisplayFields}
                       scheduleRecords={transformScheduleForDisplaying(scheduleRecords)} />
    );
}

export default TeacherScheduleTable;