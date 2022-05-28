import { useRef, useState } from "react";

import classes from './DeleteSchoolClassForm.module.css';

function DeleteSchoolClassForm(props) {
    const schoolClasses = props.schoolClasses;

    const selectSchoolClassRef = useRef();
    const [schoolClassError, setSchoolClassError] = useState(false);
    const cantDeleteSchoolClassError = props.cantDeleteSchoolClassError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        console.log("selected school class id: " + selectSchoolClassRef.current.value);

        const selectedSchoolClass = selectSchoolClassRef.current.value;
        const validSchoolClass = !!selectedSchoolClass;
        setSchoolClassError(!validSchoolClass);

        if(validSchoolClass) {
            props.onSelectSchoolClass(Number.parseInt(selectedSchoolClass));
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть клас:</label>
            <select ref={selectSchoolClassRef} required>
                {schoolClasses.map(schoolClass =>
                    <option key={schoolClass.schoolClassId}
                            value={schoolClass.schoolClassId}>
                            {schoolClass.schoolClassName}
                    </option>)
                }
            </select>
            {schoolClassError && <p className={classes.error}>Клас має бути обраний</p>}

            <input type="submit" value="Видалити клас" />
            {cantDeleteSchoolClassError && <p className={classes.error}>{cantDeleteSchoolClassError}</p>}
        </form>
    );
}

export default DeleteSchoolClassForm;