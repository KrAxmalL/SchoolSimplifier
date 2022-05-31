import React, { useMemo, useRef, useState } from "react";
import { getFullNameFromInitials } from "../../utils/transformation";

import classes from './AddMarkBookDateRecordForm.module.css';

function AddMarkBookDateRecordForm(props) {
    const students = props.students;

    const selectStudentRef = useRef();
    const [studentPresent, setStudentPresent] = useState(false);
    const selectMarkRef = useRef();

    const [studentError, setStudentError] = useState(false);

    const markOptions = useMemo(() => {
        const marks = ['Немає'];
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

        const selectedMark = !studentPresent
                                ? null
                                : Number.parseInt(selectMarkRef.current.value);
        const parsedMark = isNaN(selectedMark) ? null : selectedMark;

        if(validStudent) {
            props.onAddMarkBookDateRecord(Number.parseInt(selectedStudent), studentPresent, parsedMark);
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

            <label>Учень присутній:</label>
            <input type='checkbox'
                   defaultChecked={studentPresent}
                   onChange={() => setStudentPresent(!studentPresent)}></input>

            {studentPresent &&
                <React.Fragment>
                    <label>Оберіть оцінку:</label>
                    <select ref={selectMarkRef}>
                        {markOptions}
                    </select>
                </React.Fragment>
            }

            <input type="submit" value="Додати запис" />
        </form>
    );
}

export default AddMarkBookDateRecordForm;