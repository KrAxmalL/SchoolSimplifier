import React, { useRef, useState } from "react";
import { getFullNameFromInitials } from "../../utils/transformation";

import classes from './AddStudentToClassForm.module.css';

function AddStudentToClassForm(props) {

    const students = props.students;
    const classGroups = props.classGroups;

    const selectStudentRef = useRef();
    const selectClassGroupRef = useRef();
    const [studentError, setStudentError] = useState(false);
    const [classGroupError, setClassGroupError] = useState(false);
    const cantAddStudentToClassError = props.cantAddStudentToClassError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedStudent = selectStudentRef.current.value;
        const validStudent = !!selectedStudent;
        setStudentError(!validStudent);

        const selectedClassGroup = selectClassGroupRef.current.value;
        const validClassGroup = !!selectedClassGroup;
        setClassGroupError(!validClassGroup);

        if(validStudent && validClassGroup) {
            const classGroupNumber = Number.parseInt(selectedClassGroup);
            const classGroupNumberRes = isNaN(classGroupNumber) ? null : classGroupNumber;
            props.onAddStudentToClass(Number.parseInt(selectedStudent), classGroupNumberRes);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть учня:</label>
            <select ref={selectStudentRef} required>
                {students.map(student => <option key={student.studentId} value={student.studentId}>{getFullNameFromInitials(student)}</option>)}
            </select>
            {studentError && <p className={classes.error}>Учень має бути обраний</p>}

            <label>Оберіть групу:</label>
            <select ref={selectClassGroupRef} required>
                {classGroups.map(classGroup =>
                    <option key={classGroup.classGroupNumber}
                            value={classGroup.classGroupNumber}>
                            {classGroup.classGroupNumber}
                    </option>)
                }
            </select>
            {classGroupError && <p className={classes.error}>Група має бути обрана</p>}

            <input type="submit" value="Додати учня" />
            {cantAddStudentToClassError &&  <p className={classes.error}>{cantAddStudentToClassError}</p>}
        </form>
    );
}

export default AddStudentToClassForm;