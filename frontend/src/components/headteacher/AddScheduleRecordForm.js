import { useRef, useState } from "react";

import classes from './AddScheduleRecordForm.module.css';

function AddScheduleRecordForm(props) {
    const days = props.days;
    const subjects = props.subjects;
    const lessons = props.lessons;
    const teachers = props.teachers;
    const classGroups = props.classGroups;

    const selectDayRef = useRef();
    const [dayError, setDayError] = useState(false);

    const selectLessonRef = useRef();
    const [lessonError, setLessonError] = useState(false);

    const selectSubjectRef = useRef();
    const [subjectError, setSubjectError] = useState(false);

    const selectTeacherRef = useRef();
    const [teacherError, setTeacherError] = useState(false);

    const selectClassGroupRef = useRef();
    const [classGroupError, setClassGroupError] = useState(false);

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedDay = selectDayRef.current.value;
        const validDay = !!selectedDay;
        setDayError(!validDay);

        const selectedLesson = selectLessonRef.current.value;
        const validLesson = !!selectedLesson;
        setLessonError(!validLesson);

        const selectedSubject = selectSubjectRef.current.value;
        const validSubject = !!selectedSubject;
        setSubjectError(!validSubject);

        const selectedTeacher = selectTeacherRef.current.value;
        const validTeacher = !!selectedTeacher;
        setTeacherError(!validTeacher);

        const selectedClassGroup = selectClassGroupRef.current.value;
        const validClassGroup = !!selectedClassGroup;
        setClassGroupError(!validClassGroup);

        if(validDay && validLesson && validSubject && validTeacher && validClassGroup) {
            const classGroupNumber = Number.parseInt(selectedClassGroup);
            const classGroup = isNaN(classGroupNumber) ? null : classGroupNumber
            props.onAddScheduleRecord(selectedDay, Number.parseInt(selectedLesson), Number.parseInt(selectedSubject),
                                      Number.parseInt(selectedTeacher), classGroup);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть день:</label>
            <select ref={selectDayRef} required>
                {days.map(day =>
                    <option key={day}
                            value={day}>
                            {day}
                    </option>)
                }
            </select>
            {dayError && <p className={classes.error}>День має бути обраний</p>}

            <label>Оберіть урок:</label>
            <select ref={selectLessonRef} required>
                {lessons.map(lesson =>
                    <option key={lesson.lessonId}
                            value={lesson.lessonId}>
                            {`${lesson.lessonNumber}, ${lesson.startTime} - ${lesson.finishTime}`}
                    </option>)
                }
            </select>
            {lessonError && <p className={classes.error}>Урок має бути обраний</p>}

            <label>Оберіть предмет:</label>
            <select ref={selectSubjectRef} required>
                {subjects.map(subject =>
                    <option key={subject.subjectId}
                            value={subject.subjectId}>
                            {subject.subjectName}
                    </option>)
                }
            </select>
            {subjectError && <p className={classes.error}>Предмет має бути обраний</p>}

            <label>Оберіть вчителя:</label>
            <select ref={selectTeacherRef} required>
                {teachers.map(teacher =>
                    <option key={teacher.teacherId}
                            value={teacher.teacherId}>
                            {`${teacher.lastName} ${teacher.firstName} ${teacher.patronymic}`}
                    </option>)
                }
            </select>
            {teacherError && <p className={classes.error}>Вчитель має бути обраний</p>}

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

            <input type="submit" value="Додати запис" />
        </form>
    );
}

export default AddScheduleRecordForm;