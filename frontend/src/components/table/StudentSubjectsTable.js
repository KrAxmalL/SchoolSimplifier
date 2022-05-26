import { useMemo } from "react";
import SubjectsTable from "./SubjectsTable";

const subjectsDisplayFields  = ['Предмет', 'Група', 'Вчитель'];

const StudentSubjectsTable = ({subjects}) => {
    const subjectsToDisplay = useMemo(() => {
        if(subjects) {
            return subjects.map(subject => {
                return {
                    subjectName: subject.subjectName,
                    groupNumber: subject.classGroupNumber !== null
                                    ? subject.classGroupNumber
                                    : 'Весь класс',
                    teacherInitials: `${subject.teacherLastName} ${subject.teacherFirstName} ${subject.teacherPatronymic}`
                }
            });
        }
        else {
            return [];
        }
    }, [subjects]);

    return (
        <SubjectsTable subjectColumns={subjectsDisplayFields}
                       subjects={subjectsToDisplay}/>
    );
}

export default StudentSubjectsTable;