import ScheduleTable from "./ScheduleTable";

const scheduleDisplayFields = ['Номер уроку', 'Час', 'Предмет', 'Група', 'Вчитель'];

const transformScheduleForDisplaying = (schedule) => {
    return schedule.map(scheduleRecord => {
        return {
            day: scheduleRecord.day,
            lessonNumber: scheduleRecord.lessonNumber,
            lessonTime: `${scheduleRecord.lessonStartTime} - ${scheduleRecord.lessonFinishTime}`,
            subjectName: scheduleRecord.subjectName,
            groupNumber: scheduleRecord.groupNumber !== null
                            ? scheduleRecord.groupNumber
                            : 'Весь клас',
            teacherInitials: `${scheduleRecord.teacherLastName} ${scheduleRecord.teacherFirstName} ${scheduleRecord.teacherPatronymic}`
        }
    });
};

const FormTeacherScheduleTable = (props) => {
    const scheduleRecords = props.scheduleRecords;

    return (
        <ScheduleTable scheduleColumns={scheduleDisplayFields}
                       scheduleRecords={transformScheduleForDisplaying(scheduleRecords)} />
    );
}

export default FormTeacherScheduleTable;