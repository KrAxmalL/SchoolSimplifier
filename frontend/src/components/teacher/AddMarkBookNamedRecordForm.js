import React, { useMemo, useRef, useState } from "react";
import { getFullNameFromInitials } from "../../utils/transformation";

import classes from './AddMarkBookNamedRecordForm.module.css';

function AddMarkBookNamedRecordForm(props) {
    const students = props.students;

    const selectStudentRef = useRef();
    const selectMarkRef = useRef();

    const [studentError, setStudentError] = useState(false);
    const [markError, setMarkError] = useState(false);

    const markOptions = useMemo(() => {
        const marks = [];
        for(let i = 1; i <= 12; ++i) {
            marks.push(i);
        }
        return marks.map(mark => <option key={mark} value={mark}>{mark}</option>);
    }, []);

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedStudent = selectStudentRef.current.value;
        const validStudent = !!selectedStudent;
        setStudentError(!validStudent);

        const selectedMark = selectMarkRef.current.value;
        const validMark = !!selectedMark;
        setMarkError(!validMark);

        if(validStudent && validMark) {
            props.onAddMarkBookNamedRecord(Number.parseInt(selectedStudent),
                                           Number.parseInt(selectedMark));
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть учня:</label>
            <select ref={selectStudentRef} required>
                {students.map(student => <option key={student.studentId}
                                                 value={student.studentId}>
                                                     {getFullNameFromInitials(student)}
                                         </option>)
                }
            </select>
            {studentError && <p className={classes.error}>Учень має бути обраний</p>}

            <label>Оберіть оцінку:</label>
            <select ref={selectMarkRef} required>
                {markOptions}
            </select>
            {markError && <p className={classes.error}>Оцінка має бути обрана</p>}

            <input type="submit" value="Додати оцінку" />
        </form>
    );
}

export default AddMarkBookNamedRecordForm;