import { useRef, useState } from "react";

import classes from './AddMarkBookNamedTopicForm.module.css';

function AddMarkBookNamedTopicForm(props) {

    const enterNameRef = useRef();
    const [nameError, setNameError] = useState(false);
    const cantAddMarkBookNamedTopicError = props.cantAddMarkBookNamedTopicError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        const enteredName = enterNameRef.current.value;
        const trimmedName = enteredName === null
                                    ? null
                                    : enteredName.trim();
        const validName = !!trimmedName;
        setNameError(!validName);

        if(validName) {
            props.onAddMarkBookNamedTopic(trimmedName);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Введіть назву теми:</label>
            <input type='text' required ref={enterNameRef}></input>
            {nameError && <p className={classes.error}>Назва теми не має бути порожньою</p>}

            <input type="submit" value="Додати тему" />
            {cantAddMarkBookNamedTopicError && <p className={classes.error}>{cantAddMarkBookNamedTopicError}</p>}
        </form>
    );
}

export default AddMarkBookNamedTopicForm;