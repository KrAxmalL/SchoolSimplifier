import { useRef, useState } from 'react';
import { getFullNameFromInitials } from '../../utils/transformation';
import classes from './AddSchoolClassForm.module.css';

const schoolClassNameRegexp = /^\d\d?-[А-Я]$/;

const AddSchoolClassForm = (props) => {
    const teachers = props.teachers;

    const enterSchoolClassNameRef = useRef();
    const selectFormTeacherRef = useRef();
    const enterClassGroupNumberRef = useRef();

    const [schoolClassNameError, setSchoolClassNameError] = useState(null);
    const [formTeacherError, setFormTeacherError] = useState(null);
    const [classGroupNumberError, setClassGroupNumberError] = useState(null);
    const cantAddSchoolClassError = props.cantAddSchoolClassError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        let schoolClassName = enterSchoolClassNameRef.current.value;
        let validSchoolClassName = !!schoolClassName;
        if(!validSchoolClassName) {
            setSchoolClassNameError('Назва класу не має бути порожньою');
        }
        schoolClassName = schoolClassName.trim();
        validSchoolClassName = schoolClassName.length > 0;
        if(!validSchoolClassName) {
            setSchoolClassNameError('Назва класу не має бути порожньою');
        }
        validSchoolClassName = schoolClassNameRegexp.test(schoolClassName);
        if(!validSchoolClassName) {
            setSchoolClassNameError('Назва класу не відповідає формату');
        }
        if(validSchoolClassName) {
            setSchoolClassNameError(null);
        }

        const selectedFormTeacher = selectFormTeacherRef.current.value;
        const validFormTeacher = !!selectedFormTeacher;
        setFormTeacherError(!validFormTeacher);

        let classGroupNumber = enterClassGroupNumberRef.current.value;
        let validClassGroupNumber = !!classGroupNumber;
        if(!validClassGroupNumber) {
            setClassGroupNumberError('Кількість груп не має бути порожньою');
        }
        classGroupNumber = Number.parseInt(classGroupNumber);
        validClassGroupNumber = !isNaN(classGroupNumber)
        if(!validClassGroupNumber) {
            setClassGroupNumberError('Кількість груп має бути числом');
        }
        validClassGroupNumber = classGroupNumber >= 0;
        if(!validClassGroupNumber) {
            setClassGroupNumberError("Кількість груп має бути невід'ємним числом");
        }
        if(validClassGroupNumber) {
            setClassGroupNumberError(null);
        }

        if(validSchoolClassName && validFormTeacher && validClassGroupNumber) {
            props.onAddSchoolClass(schoolClassName, Number.parseInt(selectedFormTeacher), classGroupNumber);
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <input type="text" required placeholder='Назва класу (формат: номер-буква)' ref={enterSchoolClassNameRef}></input>
            {schoolClassNameError && <p className={classes.error}>{schoolClassNameError}</p>}

            <label>Оберіть класного керівника:</label>
            <select ref={selectFormTeacherRef} required>
                {teachers.map(teacher =>
                    <option key={teacher.teacherId}
                            value={teacher.teacherId}>
                            {getFullNameFromInitials(teacher)}
                    </option>)
                }
            </select>
            {formTeacherError && <p className={classes.error}>{'Класний керівник має бути обраний'}</p>}

            <input type="text" required placeholder='Кількість груп' ref={enterClassGroupNumberRef}></input>
            {classGroupNumberError && <p className={classes.error}>{classGroupNumberError}</p>}

            <input type="submit" value="Додати клас" />
            {cantAddSchoolClassError && <p className={classes.error}>{cantAddSchoolClassError}</p>}
        </form>
    );
}

export default AddSchoolClassForm;