import { useRef, useState } from "react";
import { dateIsLessEqualThan } from "../../utils/validation";

import classes from './MarkBookSettingsForm.module.css';

function MarkBookSettingsForm(props) {
    const subjects = props.subjects;

    const selectSubjectRef = useRef();
    const selectStartDateRef = useRef();
    const selectFinishDateRef = useRef();

    const [subjectError, setSubjectError] = useState(false);
    const [startDateError, setStartDateError] = useState(false);
    const [finishDateError, setFinishDateError] = useState(false);

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedSubject = selectSubjectRef.current.value;
        const validSubject = !!selectedSubject;
        setSubjectError(!validSubject);

        const selectedStartDate = selectStartDateRef.current.value;
        const validStartDate = !!selectedStartDate;
        setStartDateError(!validStartDate);

        const selectedFinishDate = selectFinishDateRef.current.value;
        const validFinishDate = !!selectedFinishDate
                                && dateIsLessEqualThan(new Date(selectedStartDate), new Date(selectedFinishDate));
        setFinishDateError(!validFinishDate);

        if(validSubject && validStartDate && validFinishDate) {
            props.onSetSettings(selectedSubject, selectedStartDate, selectedFinishDate);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть предмет:</label>
            <select ref={selectSubjectRef} required>
                {subjects.map((subject, index) => <option key={index} value={subject}>{subject}</option>)}
            </select>
            {subjectError && <p className={classes.error}>Предмет має бути обраний</p>}

            <label>Введіть дату початку:</label>
            <input type='date' placeholder="Дата початку" required
                   ref={selectStartDateRef}></input>
            {startDateError && <p className={classes.error}>Дата початку має бути обрана</p>}

            <label>Введіть дату кінця:</label>
            <input type='date' placeholder="Дата кінця" required
                   ref={selectFinishDateRef}></input>
            {finishDateError && <p className={classes.error}>Дата кінця має бути більшою за дату початку</p>}

            <input type="submit" value="Зберегти налаштування" />
        </form>
    );
}

export default MarkBookSettingsForm;