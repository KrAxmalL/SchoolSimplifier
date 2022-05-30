import { useMemo } from "react";
import { getFullNameFromInitials } from "../../utils/transformation";
import ContentTable from "./ContentTable";

const topicMarkDisplayFields  = ['ПІБ учня', 'Оцінка'];

const TeacherTopicMarksTable = (props) => {
    const students = props.students;
    const topicMarkRecords = props.topicMarkRecords;

    const markToDisplay = useMemo(() => {
        if(students && topicMarkRecords) {
            return students.map(student => {
                const studentTopicMark = topicMarkRecords.find(topicMarkRecord =>
                                                                topicMarkRecord.student.studentId === student.studentId);
                return {
                    studentInitials: getFullNameFromInitials(student),
                    mark: studentTopicMark
                            ? studentTopicMark.mark
                            : 'Оцінка не виставлена'
                };
            });
        }
        else {
            return [];
        }
    }, [students, topicMarkRecords]);

    const content = markToDisplay.length === 0
                        ? <p>Немає оцінок для показу</p>
                        : <ContentTable columns={topicMarkDisplayFields} data={markToDisplay}/>

    return content;
}

export default TeacherTopicMarksTable;