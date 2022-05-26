import { useMemo } from "react";
import { sortStudentsByInitials } from "../../utils/sorting";
import ContentTable from "./ContentTable";

const studentDisplayFields  = ['Порядковий номер учня', 'ПІБ'];

const StudentsTable = (props) => {
    const students = props.students;
    const studentsToDisplay = useMemo(() => {
        if(students) {
            return sortStudentsByInitials([...students])
                   .map((student, index) => {
                            return {
                                orderNumber: index + 1,
                                studentInitials: `${student.lastName} ${student.firstName} ${student.patronymic}`
                            }
                    });
        }
        else {
            return [];
        }
    }, [students]);

    const content = studentsToDisplay.length === 0
                        ? <p>Немає студентів для показу</p>
                        : <ContentTable columns={studentDisplayFields} data={studentsToDisplay}/>

    return content;
}

export default StudentsTable;