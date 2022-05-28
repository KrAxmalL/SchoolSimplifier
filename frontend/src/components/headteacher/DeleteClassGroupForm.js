import { useRef, useState } from "react";

import classes from './DeleteClassGroupForm.module.css';

function DeleteClassGroupForm(props) {
    const classGroups = props.classGroups;

    const selectClassGroupRef = useRef();
    const [classGroupError, setClassGroupError] = useState(false);
    const cantDeleteClassGroupError = props.cantDeleteClassGroupError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedClassGroup = selectClassGroupRef.current.value;
        const validClassGroup = !!selectedClassGroup;
        setClassGroupError(!validClassGroup);

        if(validClassGroup) {
            props.onDeleteClassGroup(Number.parseInt(selectedClassGroup));
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
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

            <input type="submit" value="Видалити групу" />
            {cantDeleteClassGroupError && <p className={classes.error}>{cantDeleteClassGroupError}</p>}
        </form>
    );
}

export default DeleteClassGroupForm;