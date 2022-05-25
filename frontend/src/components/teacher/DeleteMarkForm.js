import React, { useEffect, useMemo, useRef, useState } from "react";

import classes from './DeleteMarkForm.module.css';

function DeleteMarkForm(props) {

    const studentsMarks = props.studentsMarks;

    const selectStudentRef = useRef();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const selectDateRef = useRef();
    const [selectedDate, setSelectedDate] = useState(null);
    const selectMarkRecordRef = useRef();

    const [studentError, setStudentError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [markRecordError, setMarkRecordError] = useState(false);

    const studentOptions = useMemo(() => {
        return studentsMarks.map(studentMarks => {
            const studentId = studentMarks.studentId;
            const {studentLastName, studentFirstName, studentPatronymic} = studentMarks.student;
            return (
                <option key={studentId} value={studentId}>
                    {`${studentLastName} ${studentFirstName} ${studentPatronymic}`}
                </option>
            );
        });
    }, [studentsMarks]);

    const markRecordOptions = useMemo(() => {
        const neededStudentMarks = studentsMarks.find(studentMarks => studentMarks.studentId === Number.parseInt(selectedStudent));
        if(!neededStudentMarks) {
            return [];
        }

        const marksOfStudent = neededStudentMarks.studentMarks.filter(mark => mark.recordDate.localeCompare(selectedDate) === 0);
        return marksOfStudent.map(mark => {
            const studentPresentText = !mark.studentPresent ? 'Учень відсутній' : 'Учень присутній';
            const markText = !mark.studentPresent
                                    ? ''
                                    : mark.mark === null
                                        ? ''
                                        : `, ${mark.mark}`;
            const markDescriptionText = mark.description === null
                                            ?  ''
                                            : ` (${mark.description})`;
            return (
                <option key={mark.markRecordId} value={mark.markRecordId}>
                    {studentPresentText + markText + markDescriptionText}
                </option>
            );
        });
    }, [studentsMarks, selectedStudent, selectedDate]);

    useEffect(() => {
        if(selectStudentRef.current) {
            selectStudentRef.current.value = null;
        }
        if(selectMarkRecordRef.current) {
            selectMarkRecordRef.current.value = null;
        }
    }, []);

    useEffect(() => {
        if(selectMarkRecordRef.current) {
            selectMarkRecordRef.current.value = null;
        }
    }, [selectedStudent, selectedDate]);

    const selectStudentChangeHandler = (e) => {
        setSelectedStudent(selectStudentRef.current.value);
    }

    const selectDateChangeHandler = (e) => {
        setSelectedDate(selectDateRef.current.value);
    }

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedStudent = selectStudentRef.current.value;
        const validStudent = !!selectedStudent;
        setStudentError(!validStudent);

        const selectedDate = selectDateRef.current.value;
        const validDate = !!selectedDate;
        setDateError(!validDate);

        const selectedMarkRecord = selectMarkRecordRef.current.value;
        const validMarkRecord = !!selectedMarkRecord;
        setMarkRecordError(!validMarkRecord);

        console.log(selectedStudent);
        console.log(selectedDate);
        console.log(selectedMarkRecord);

        if(validStudent && validDate && validMarkRecord) {
            props.onDeleteMark(Number.parseInt(selectedMarkRecord));
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть учня:</label>
            <select ref={selectStudentRef} required onChange={selectStudentChangeHandler}>
                {studentOptions}
            </select>
            {studentError && <p className={classes.error}>Предмет має бути обраний</p>}

            <label>Оберіть дату:</label>
            <input type='date' required ref={selectDateRef} onChange={selectDateChangeHandler}></input>
            {dateError && <p className={classes.error}>Дата має бути обрана</p>}

            <label>Оберіть запис:</label>
            <select ref={selectMarkRecordRef} required>
                {markRecordOptions}
            </select>
            {markRecordError && <p className={classes.error}>Запис має бути обраний</p>}

            <input type="submit" value="Видалити запис" />
        </form>
    );
}

export default DeleteMarkForm;