import React, { useRef, useState } from "react";
import { getFullNameFromInitials } from "../../utils/transformation";

import classes from './SelectStudentToDeleteMarkRecordForm.module.css';

function SelectStudentToDeleteMarkRecordForm(props) {
    const students = props.students;

    const selectStudentRef = useRef();
    const [studentError, setStudentError] = useState(false);

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedStudent = selectStudentRef.current.value;
        const validStudent = !!selectedStudent;
        setStudentError(!validStudent);

        if(validStudent) {
            props.onSelectStudentToDeleteMarkRecord(Number.parseInt(selectedStudent));
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть учня, оцінку якого треба видалити:</label>
            <select ref={selectStudentRef} required>
                {students.map(student => <option key={student.studentId}
                                                 value={student.studentId}>
                                                     {getFullNameFromInitials(student)}
                                         </option>)
                }
            </select>
            {studentError && <p className={classes.error}>Учень має бути обраний</p>}

            <input type="submit" value="Видалити оцінку для учня" />
        </form>
    );
}

export default SelectStudentToDeleteMarkRecordForm;