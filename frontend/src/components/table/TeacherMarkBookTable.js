import { useMemo } from "react";
import { getFullNameFromInitials } from "../../utils/transformation";
import ContentTable from "./ContentTable";

const markBookFields = ['ПІБ учня', 'Оцінки'];

const TeacherMarkBookTable = (props) => {
    const studentsMarks = props.studentsMarks;

    const studentsToDisplay = useMemo(() => {
        if(studentsMarks) {
            return studentsMarks.map(studentMarks => {
                return {
                    studentInitials: getFullNameFromInitials(studentMarks.student),
                    marks: studentMarks.studentMarks.map(mark => {
                        return !mark.studentPresent
                            ? 'Учень відсутній'
                            : 'Учень присутній' +
                                (mark.mark == null
                                    ? ''
                                    : `, ${mark.mark} ${mark.description == null ? '' : `(${mark.description})`}`)
                    })
                }
            });
            }
        else {
            return [];
        }
    }, [studentsMarks]);

    const content = studentsToDisplay.length === 0
            ? <p>Немає студентів для показу</p>
            : <ContentTable columns={markBookFields} data={studentsToDisplay}/>
    return content;
}

export default TeacherMarkBookTable;