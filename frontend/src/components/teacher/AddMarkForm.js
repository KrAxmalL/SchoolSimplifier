import React, { useEffect, useMemo, useRef, useState } from "react";
import { getFullNameFromInitials } from "../../utils/transformation";

import classes from './SelectMarkBookForm.module.css';

function AddMarkForm(props) {

    const students = props.students;

    const selectStudentRef = useRef();
    const selectDateRef = useRef();
    const [studentPresent, setStudentPresent] = useState(false);
    const selectMarkRef = useRef();
    const enterDescriptionRef = useRef();

    const [studentError, setStudentError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    const markOptions = useMemo(() => {
        const marks = ['Немає'];
        for(let i = 1; i <= 12; ++i) {
            marks.push(i);
        }
        return marks.map(mark => <option key={mark} value={mark}>{mark}</option>);
    }, []);

    useEffect(() => {
        if(enterDescriptionRef.current) {
            enterDescriptionRef.current.value = '';
        }
        setDescriptionError(false);
    }, [studentPresent]);

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedStudent = selectStudentRef.current.value;
        const validStudent = !!selectedStudent;
        setStudentError(!validStudent);

        const selectedDate = selectDateRef.current.value;
        const validDate = !!selectedDate;
        setDateError(!validDate);

        if(!studentPresent) {
            if(validStudent && validDate) {
                props.onAddMark(Number.parseInt(selectedStudent), selectedDate, studentPresent, null, null);
            }
        }
        else {
            const selectedMark = Number.parseInt(selectMarkRef.current.value);
            const mark = isNaN(selectedMark) ? null : selectedMark;

            const description = enterDescriptionRef.current.value;
            let trimmedDescription = description === null ? null : description.trim();
            if(trimmedDescription !== null && trimmedDescription.length === 0) {
                trimmedDescription = null;
            }
            const validDescription = mark !== null || trimmedDescription === null;
            setDescriptionError(!validDescription);

            console.log('mark: ' + selectedMark);
            console.log('description: ' + description);

            if(validStudent && validDate && validDescription) {
                props.onAddMark(Number.parseInt(selectedStudent), selectedDate, studentPresent,  mark, trimmedDescription);
            }
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть учня:</label>
            <select ref={selectStudentRef} required>
                {students.map(student => <option key={student.studentId} value={student.studentId}>{getFullNameFromInitials(student)}</option>)}
            </select>
            {studentError && <p className={classes.error}>Предмет має бути обраний</p>}

            <label>Оберіть дату:</label>
            <input type='date' required ref={selectDateRef}></input>
            {dateError && <p className={classes.error}>Дата має бути обрана</p>}

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

                    <input type="text" placeholder="Опис оцінки" ref={enterDescriptionRef}/>
                    {descriptionError && <p className={classes.error}>Якщо оцінки немає, опис має бути порожнім</p>}
                </React.Fragment>
            }

            <input type="submit" value="Відмітити" />
        </form>
    );
}

export default AddMarkForm;