import React from "react";
import FormTeacherScheduleTable from "../table/FormTeacherScheduleTable";
import GroupsStudents from "../table/GroupsStudents";
import StudentsTable from "../table/StudentsTable";

const FullClassData = (props) => {
    const classData = props.classData;

    return (
        <React.Fragment>
            <p>{classData.schoolClassName}</p>
            <details>
                <summary>Список учнів</summary>
                <StudentsTable students={classData.classStudents} />
                <GroupsStudents groupStudents={classData.groupStudents} />
            </details>
            <details>
                <summary>Розклад уроків</summary>
                <FormTeacherScheduleTable scheduleRecords={classData.classScheduleRecords} />
            </details>
        </React.Fragment>
    );
}

export default FullClassData;