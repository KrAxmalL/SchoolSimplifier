import { useRef, useState } from "react";

import classes from './AddMarkBookDateTopicForm.module.css';

function AddMarkBookDateTopicForm(props) {

    const selectDateRef = useRef();
    const [dateError, setDateError] = useState(false);
    const cantAddMarkBookDateTopicError = props.cantAddMarkBookDateTopicError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedDate = selectDateRef.current.value;
        const validDate = !!selectedDate;
        setDateError(!validDate);

        if(validDate) {
            props.onAddMarkBookDateTopic(selectedDate);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть дату:</label>
            <input type='date' required ref={selectDateRef}></input>
            {dateError && <p className={classes.error}>Дата має бути обрана</p>}

            <input type="submit" value="Додати дату" />
            {cantAddMarkBookDateTopicError && <p className={classes.error}>{cantAddMarkBookDateTopicError}</p>}
        </form>
    );
}

export default AddMarkBookDateTopicForm;