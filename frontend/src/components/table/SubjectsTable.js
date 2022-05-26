import { useMemo } from "react";
import { sortSubjects } from "../../utils/sorting";
import ContentTable from "./ContentTable";


const SubjectsTable = (props) => {
    const subjectColumns = props.subjectColumns;
    const subjects = props.subjects;
    const subjectToDisplay = useMemo(() => {
        if(subjects) {
            return sortSubjects([...subjects])
        }
        else {
            return [];
        }
    }, [subjects]);

    const content = subjectToDisplay.length === 0
                        ? <p>Немає предметів для показу</p>
                        : <ContentTable columns={subjectColumns} data={subjectToDisplay}/>

    return content;
}

export default SubjectsTable;