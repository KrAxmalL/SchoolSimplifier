import { useEffect, useMemo, useRef, useState } from "react";

import classes from './SelectClassMarkBookForm.module.css';

function SelectClassMarkBookForm(props) {
    const subjects = props.subjects;
    const classGroups = props.classGroups;

    const selectSubjectRef = useRef();
    const [selectedSubject, setSelectedSubject] = useState(null);
    const selectClassGroupRef = useRef();

    const [subjectError, setSubjectError] = useState(false);
    const [classGroupError, setClassGroupError] = useState(false);

    useEffect(() => {
        selectSubjectRef.current.value = null;
        selectClassGroupRef.current.value = null;
    }, []);

    const availableGroups = useMemo(() => {
        return classGroups.filter(classGroup => classGroup.subjects.some(subject => subject.subjectId === selectedSubject));
    }, [classGroups, selectedSubject]);

    useEffect(() => {
        selectClassGroupRef.current.value = null;
    }, [selectedSubject]);

    const subjectsOptions = useMemo(() => {
        return subjects.map(subject => {
            return (
                <option key={subject.subjectId}
                        value={subject.subjectId}>
                        {subject.subjectName}
                </option>
            );
        });
    }, [subjects]);

    const classGroupsOptions = useMemo(() => {
        return availableGroups.map(classGroup => {
            return (
                <option key={classGroup.classGroupId}
                        value={classGroup.classGroupNumber}>
                        {`${classGroup.classGroupId === null ? 'Весь клас' : `${classGroup.classGroupNumber} група`}`}
                </option>
            );
        });
    }, [availableGroups]);

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedSubject = selectSubjectRef.current.value;
        const validSubject = !!selectedSubject;
        setSubjectError(!validSubject);

        const selectedClassGroup = selectClassGroupRef.current.value;
        const validClassGroup = !!selectedClassGroup;
        setClassGroupError(!validClassGroup);

        if(validSubject && validClassGroup) {
            const classGroupIdAsInt = Number.parseInt(selectedClassGroup);
            props.onSelectClassMarkBook(Number.parseInt(selectedSubject),
                                        isNaN(classGroupIdAsInt) ? null : classGroupIdAsInt);
        }
    }

    const changeSubjectHandler = (e) => {
        setSelectedSubject(Number.parseInt(selectSubjectRef.current.value));
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть предмет:</label>
            <select ref={selectSubjectRef} required onChange={changeSubjectHandler}>
                {subjectsOptions}
            </select>
            {subjectError && <p className={classes.error}>Предмет має бути обраний</p>}

            <label>Оберіть групу:</label>
            <select ref={selectClassGroupRef} required>
                {classGroupsOptions}
            </select>
            {classGroupError && <p className={classes.error}>Група має бути обрана</p>}

            <input type="submit" value="Обрати журнал" />
        </form>
    );
}

export default SelectClassMarkBookForm;