import { useEffect, useMemo, useRef, useState } from "react";

import classes from './SelectSubjectAndGroupForm.module.css';

function SelectSubjectAndGroupForm(props) {

    const subjects = props.subjects;
    const subjectsGroups = props.subjectsGroups;

    const [selectedSubject, setSelectedSubject] = useState(null);

    const selectSubjectRef = useRef();
    const selectClassGroupRef = useRef();

    const [subjectError, setSubjectError] = useState(false);
    const [classGroupError, setClassGroupError] = useState(false);

    const selectedClassGroups = useMemo(() => {
        return subjectsGroups.filter(subjectGroups => subjectGroups.subjectId === null
                                                      || subjectGroups.subjectId === selectedSubject)
                             .map(subjectGroups => {
                                 return {
                                     classGroupNumber: subjectGroups.classGroupNumber === null
                                     ? 'Весь клас'
                                     : subjectGroups.classGroupNumber
                                 }
                             });
    }, [subjectsGroups, selectedSubject]);

    useEffect(() => {
        selectSubjectRef.current.value = null;
        selectClassGroupRef.current.value = null;
    }, []);

    useEffect(() => {
        selectClassGroupRef.current.value = null;
    }, [selectedSubject]);

    const subjectChangeHandler = (e) => {
        setSelectedSubject(Number.parseInt(selectSubjectRef.current.value));
    }

    const submitFormHandler = (e) => {
        e.preventDefault();

        console.log("selected subject id: " + selectSubjectRef.current.value);
        console.log("selected class group id: " + selectClassGroupRef.current.value);

        const selectedSubject = selectSubjectRef.current.value;
        const validSubject = !!selectedSubject;
        setSubjectError(!validSubject);

        const selectedClassGroup = selectClassGroupRef.current.value;
        const validClassGroup = !!selectedClassGroup;
        setClassGroupError(!validClassGroup);

        if(validSubject && validClassGroup) {
            const classGroupNumber = Number.parseInt(selectedClassGroup);
            props.onSelectSubjectAndGroup(Number.parseInt(selectedSubject),
                                          isNaN(classGroupNumber) ? null : classGroupNumber);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть предмет:</label>
            <select ref={selectSubjectRef} required onChange={subjectChangeHandler}>
                {subjects.map(subject => <option key={subject.subjectId} value={subject.subjectId}>{subject.subjectName}</option>)}
            </select>
            {subjectError && <p className={classes.error}>Предмет має бути обраний</p>}

            <label>Оберіть групу:</label>
            <select ref={selectClassGroupRef} required>
            {selectedClassGroups.map(classGroup =>
                        <option key={classGroup.classGroupNumber}
                                value={classGroup.classGroupNumber}>
                                    {classGroup.classGroupNumber}
                        </option>)
            }
            </select>
            {classGroupError && <p className={classes.error}>Група має бути обрана</p>}

            <input type="submit" value="Обрати" />
        </form>
    );
}

export default SelectSubjectAndGroupForm;