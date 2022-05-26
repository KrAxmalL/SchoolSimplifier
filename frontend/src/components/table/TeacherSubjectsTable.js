import { useMemo } from "react";
import SubjectsTable from "./SubjectsTable";

const subjectsDisplayFields  = ['Предмет', 'Клас', 'Група'];

const TeacherSubjectsTable = ({subjects}) => {
    const subjectsToDisplay = useMemo(() => {
        if(subjects) {
            return subjects.map(subject => {
                return {
                    subjectName: subject.subjectName,
                    className: subject.className,
                    groupNumber: subject.classGroupNumber !== null
                                    ? subject.classGroupNumber
                                    : 'Весь класс'
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

export default TeacherSubjectsTable;