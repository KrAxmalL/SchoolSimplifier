import { useEffect, useMemo, useRef, useState } from "react";

import classes from './SelectMarkBookForm.module.css';

function SelectMarkBookForm(props) {

    const subjects = props.subjects;
    const schoolClasses = props.schoolClasses;

    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSchoolClass, setSelectedSchoolClass] = useState(null);

    const selectSubjectRef = useRef();
    const selectSchoolClassRef = useRef();
    const selectClassGroupRef = useRef();

    const [subjectError, setSubjectError] = useState(false);
    const [schoolClassError, setSchoolClassError] = useState(false);
    const [classGroupError, setClassGroupError] = useState(false);

    useEffect(() => {
        selectSubjectRef.current.value = null;
        selectSchoolClassRef.current.value = null;
        selectClassGroupRef.current.value = null;
    }, []);

    const allowedClasses = useMemo(() => {
        return schoolClasses.filter(schoolClass => schoolClass.subjects.some(subject => subject.subjectId === selectedSubject));
    }, [schoolClasses, selectedSubject]);

    useEffect(() => {
        selectSchoolClassRef.current.value = null;
        selectClassGroupRef.current.value = null;
    }, [selectedSubject]);

    useEffect(() => {
        selectClassGroupRef.current.value = null;
    }, [selectedSchoolClass]);

    const schoolClassesOptions = useMemo(() => {
        return allowedClasses.filter((schoolClass, index, arr) => arr.findIndex(schoolCl => schoolCl.schoolClassId === schoolClass.schoolClassId) === index)
                             .map(schoolClass => {
                                    return (
                                        <option key={schoolClass.schoolClassId}
                                                value={schoolClass.schoolClassId}>
                                            {schoolClass.schoolClassName}
                                        </option>
                                    );
                                });
    }, [allowedClasses]);

    const classGroupsOptions = useMemo(() => {
        return allowedClasses.filter(schoolClass => schoolClass.schoolClassId === selectedSchoolClass)
                             .map(schoolClass => {
                                return (
                                    <option key={schoolClass.classGroupId}
                                            value={schoolClass.classGroupNumber}>
                                            {`${schoolClass.classGroupId === null ? 'Весь клас' : `${schoolClass.classGroupNumber} група`}`}
                                    </option>
                                );
        });
    }, [allowedClasses, selectedSchoolClass]);

    const subjectChangeHandler = (e) => {
        setSelectedSubject(Number.parseInt(selectSubjectRef.current.value));
    }

    const schoolClassChangeHandler = (e) => {
        setSelectedSchoolClass(Number.parseInt(selectSchoolClassRef.current.value));
    }

    const submitFormHandler = (e) => {
        e.preventDefault();

        console.log("selected subject id: " + selectSubjectRef.current.value);
        console.log("selected class group id: " + selectClassGroupRef.current.value);
        console.log("selected school class id: " + selectSchoolClassRef.current.value);

        const selectedSubject = selectSubjectRef.current.value;
        const validSubject = !!selectedSubject;
        setSubjectError(!validSubject);

        const selectedSchoolClass = selectSchoolClassRef.current.value;
        const validSchoolClass = !!selectedSchoolClass;
        setSchoolClassError(!validSchoolClass);

        const selectedClassGroup = selectClassGroupRef.current.value;
        const validClassGroup = !!selectedClassGroup;
        setClassGroupError(!validClassGroup);

        if(validSubject && validSchoolClass && validClassGroup) {
            const classGroupIdAsInt = Number.parseInt(selectedClassGroup);
            props.onSelectMarkBook(Number.parseInt(selectedSubject), Number.parseInt(selectedSchoolClass),
                                   isNaN(classGroupIdAsInt) ? null : classGroupIdAsInt);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть предмет:</label>
            <select ref={selectSubjectRef} required onChange={subjectChangeHandler}>
                {subjects.map(subject => <option key={subject.subjectId} value={subject.subjectId}>{subject.subjectName}</option>)}
            </select>
            {subjectError && <p className={classes.error}>Предмет має бути обраний</p>}

            <label>Оберіть клас:</label>
            <select ref={selectSchoolClassRef} required onChange={schoolClassChangeHandler}>
                {schoolClassesOptions}
            </select>
            {schoolClassError && <p className={classes.error}>Клас має бути обраний</p>}

            <label>Оберіть групу:</label>
            <select ref={selectClassGroupRef} required>
                {classGroupsOptions}
            </select>
            {classGroupError && <p className={classes.error}>Група має бути обрана</p>}

            <input type="submit" value="Обрати журнал" />
        </form>
    );
}

export default SelectMarkBookForm;