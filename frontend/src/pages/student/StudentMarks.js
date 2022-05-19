import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getMarksForStudent, getSubjectsForStudent } from "../../api/student";
import ContentTable from "../../components/table/ContentTable";
import { Days } from "../../domain/constants";

import classes from './StudentMarks.module.css';

const marksDisplayFields  = ['Предмет', 'Оцінки'];

function StudentMarks() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [subjectsMarks, setSubjectsMarks] = useState([]);

    const marksToDisplay = useMemo(() => {
        return subjectsMarks.map(subjectMarks => {
            return {
                subjectName: subjectMarks.subjectName,
                marks: subjectMarks.marks.map(subjectMark => `${subjectMark.mark}(${subjectMark.recordDate}${subjectMark.description == null ? '' : ` - ${subjectMark.description}`})`)
                                         .reduce((acc, curr) => `${acc}, ${curr}`)
            }
        });
    }, [subjectsMarks]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const subjectsMarks = await getMarksForStudent(accessToken);
                setSubjectsMarks(subjectsMarks);
                console.log(JSON.stringify(subjectsMarks));
            }
            catch(er) {
                console.log(er);
            }
        }
        fetchData();
    }, [accessToken, setSubjectsMarks]);

    return (
        <div className={classes['page-container']}>
            <h2>Предмети</h2>
            {marksToDisplay.length === 0
                ? <p>Немає оцінок</p>
                : <ContentTable columns={marksDisplayFields} data={marksToDisplay} />
            }
        </div>
    );
}

export default StudentMarks;