import { useRef, useState } from "react";

import classes from './DeleteLessonForm.module.css';

function DeleteLessonForm(props) {
    const lessons = props.lessons;
    const cantDeleteLessonError = props.cantDeleteLessonError;

    const selectLessonRef = useRef();
    const [lessonError, setLessonError] = useState(false);

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedLesson = selectLessonRef.current.value;
        const validLesson = !!selectedLesson;
        setLessonError(!validLesson);

        if(validLesson) {
            props.onDeleteLesson(Number.parseInt(selectedLesson));
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
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

            <input type="submit" value="Видалити урок" />
            {cantDeleteLessonError && <p className={classes.error}>{cantDeleteLessonError}</p>}
        </form>
    );
}

export default DeleteLessonForm;