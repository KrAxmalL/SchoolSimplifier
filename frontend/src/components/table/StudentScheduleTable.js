import ScheduleTable from "./ScheduleTable";

const scheduleDisplayFields  = ['Номер уроку', 'Час', 'Предмет', 'Вчитель'];

const transformScheduleForDisplaying = (schedule) => {
    return schedule.map(scheduleRecord => {
        return {
            day: scheduleRecord.day,
            lessonNumber: scheduleRecord.lessonNumber,
            lessonTime: `${scheduleRecord.lessonStartTime} - ${scheduleRecord.lessonFinishTime}`,
            subjectName: scheduleRecord.subjectName,
            teacherInitials: `${scheduleRecord.teacherLastName} ${scheduleRecord.teacherFirstName} ${scheduleRecord.teacherPatronymic}`
        }
    });
};

const StudentScheduleTable = (props) => {
    const scheduleRecords = props.scheduleRecords;

    return (
        <ScheduleTable scheduleColumns={scheduleDisplayFields}
                       scheduleRecords={transformScheduleForDisplaying(scheduleRecords)} />
    );
}

export default StudentScheduleTable;