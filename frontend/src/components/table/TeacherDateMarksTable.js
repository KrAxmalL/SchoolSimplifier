import { useMemo } from "react";
import { getFullNameFromInitials } from "../../utils/transformation";
import ContentTable from "./ContentTable";

const dateMarkDisplayFields  = ['ПІБ учня', 'Оцінка'];

const TeacherDateMarksTable = (props) => {
    const students = props.students;
    const dateMarkRecords = props.dateMarkRecords;

    const markToDisplay = useMemo(() => {
        if(students && dateMarkRecords) {
            return students.map(student => {
                const studentDateMark = dateMarkRecords.find(dateMarkRecord =>
                                                                dateMarkRecord.student.studentId === student.studentId);
                return {
                    studentInitials: getFullNameFromInitials(student),
                    mark: !studentDateMark
                            ? 'Оцінка не виставлена'
                            : !studentDateMark.studentPresent
                                ? 'Учень відсутній'
                                : !studentDateMark.mark
                                    ? 'Учень присутній'
                                    :  `Учень присутній, ${studentDateMark.mark}`
                };
            });
        }
        else {
            return [];
        }
    }, [students, dateMarkRecords]);

    const content = markToDisplay.length === 0
                        ? <p>Немає оцінок для показу</p>
                        : <ContentTable columns={dateMarkDisplayFields} data={markToDisplay}/>

    return content;
}

export default TeacherDateMarksTable;