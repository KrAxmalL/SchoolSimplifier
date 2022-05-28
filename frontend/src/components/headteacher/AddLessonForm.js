import { useRef, useState } from 'react';
import classes from './AddLessonForm.module.css';

const lessonTimeRegexp = /^\d{2}:\d{2}$/;

const AddLessonForm = (props) => {

    const enterLessonNumberRef = useRef();
    const enterStartTimeRef = useRef();
    const enterFinishTimeRef = useRef();

    const [lessonNumberError, setLessonNumberError] = useState(null);
    const [startTimeError, setStartTimeError] = useState(null);
    const [finishTimeError, setFinishTimeError] = useState(null);
    const cantAddLessonError = props.cantAddLessonError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        let lessonNumber = enterLessonNumberRef.current.value;
        let validLessonNumber = !!lessonNumber;
        if(!validLessonNumber) {
            setLessonNumberError('Номер уроку не має бути порожнім');
        }
        lessonNumber = Number.parseInt(lessonNumber);
        validLessonNumber = !isNaN(lessonNumber)
        if(!validLessonNumber) {
            setLessonNumberError('Номер уроку має бути числом');
        }
        validLessonNumber = lessonNumber > 0;
        if(!validLessonNumber) {
            setLessonNumberError('Номер уроку має бути додатнім числом');
        }
        if(validLessonNumber) {
            setLessonNumberError(null);
        }

        let startTime = enterStartTimeRef.current.value;
        let validStartTime = !!startTime;
        if(!validStartTime) {
            setStartTimeError('Час початку уроку не має бути порожнім');
        }
        startTime = startTime.trim();
        validStartTime = startTime.length > 0;
        if(!validStartTime) {
            setStartTimeError('Час початку уроку не має бути порожнім');
        }
        validStartTime = lessonTimeRegexp.test(startTime);
        if(!validStartTime) {
            setStartTimeError('Час початку уроку не відповідає формату');
        }
        if(validStartTime) {
            setStartTimeError(null);
        }

        let finishTime = enterFinishTimeRef.current.value;
        let validFinishTime = !!finishTime;
        if(!validFinishTime) {
            setFinishTimeError('Час кінця уроку не має бути порожнім');
        }
        finishTime = finishTime.trim();
        validFinishTime = finishTime.length > 0;
        if(!validFinishTime) {
            setFinishTimeError('Час кінця уроку не має бути порожнім');
        }
        validFinishTime = lessonTimeRegexp.test(finishTime);
        if(!validFinishTime) {
            setFinishTimeError('Час кінця уроку не відповідає формату');
        }
        if(validFinishTime) {
            setFinishTimeError(null);
        }

        if(validLessonNumber && validStartTime && validFinishTime) {
            props.onAddLesson(lessonNumber, startTime, finishTime);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <input type="text" required placeholder='Номер уроку' ref={enterLessonNumberRef}></input>
            {lessonNumberError && <p className={classes.error}>{lessonNumberError}</p>}

            <input type="text" required placeholder='Час початку уроку (формат: dd:dd)' ref={enterStartTimeRef}></input>
            {startTimeError && <p className={classes.error}>{startTimeError}</p>}

            <input type="text" required placeholder='Час кінця уроку (формат: dd:dd)' ref={enterFinishTimeRef}></input>
            {finishTimeError && <p className={classes.error}>{finishTimeError}</p>}

            <input type="submit" value="Додати урок" />
            {cantAddLessonError && <p className={classes.error}>{cantAddLessonError}</p>}
        </form>
    );
}

export default AddLessonForm;