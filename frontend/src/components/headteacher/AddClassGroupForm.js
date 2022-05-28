import { useRef, useState } from 'react';
import classes from './AddClassGroupForm.module.css';

const AddClassGroupForm = (props) => {

    const enterClassGroupNumberRef = useRef();
    const [classGroupNumberError, setClassGroupNumberError] = useState(null);
    const cantAddClassGroupError = props.cantAddClassGroupError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        let classGroupNumber = enterClassGroupNumberRef.current.value;
        let validClassGroupNumber = !!classGroupNumber;
        if(!validClassGroupNumber) {
            setClassGroupNumberError('Номер групи не має бути порожнім');
        }
        classGroupNumber = Number.parseInt(classGroupNumber);
        validClassGroupNumber = !isNaN(classGroupNumber)
        if(!validClassGroupNumber) {
            setClassGroupNumberError('Номер групи має бути числом');
        }
        validClassGroupNumber = classGroupNumber > 0;
        if(!validClassGroupNumber) {
            setClassGroupNumberError('Номер групи має бути додатнім числом');
        }
        if(validClassGroupNumber) {
            setClassGroupNumberError(null);
        }

        if(validClassGroupNumber) {
            props.onAddClassGroup(classGroupNumber);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <input type="text" required placeholder='Номер групи' ref={enterClassGroupNumberRef}></input>
            {classGroupNumberError && <p className={classes.error}>{classGroupNumberError}</p>}

            <input type="submit" value="Додати групу" />
            {cantAddClassGroupError && <p className={classes.error}>{cantAddClassGroupError}</p>}
        </form>
    );
}

export default AddClassGroupForm;