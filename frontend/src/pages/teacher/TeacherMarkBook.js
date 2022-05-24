
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMarksForStudentsOfGroupAndSubjectAndDate } from '../../api/marks';
import { getClassesWithSubjectsForTeacher, getSubjectsForTeacher } from '../../api/teacher';
import ContentTable from '../../components/table/ContentTable';
import SelectMarkBookForm from '../../components/teacher/SelectMarkBookForm';
import MarkBookSettingsForm from '../../components/teacher/SelectMarkBookForm';
import Modal from '../../layout/Modal';
import classes from './TeacherMarkBook.module.css';

const markBookFields = ['ПІБ учня', 'Оцінки'];

function TeacherMarkBook() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classesWithSubjects, setClassesWithSubjects] = useState([]);
    const [selectMarkBookFormVisible, setSelectMarkBookFormVisible] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSchoolClass, setSelectedSchoolClass] = useState(null);
    const [selectedClassGroup, setSelectedClassGroup] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [studentsMarks, setStudentsMarks] = useState([]);

    const studentsToDisplay = useMemo(() => {
        return studentsMarks.map(studentMarks => {
            return {
                studentInitials: `${studentMarks.student.studentLastName} ${studentMarks.student.studentFirstName} ${studentMarks.student.studentPatronymic}`,
                marks: studentMarks.studentMarks.map(mark => {
                    return !mark.studentPresent
                        ? 'Учень відсутній'
                        : 'Учень присутній' +
                            (mark.mark == null
                                ? ''
                                : `, ${mark.mark} ${mark.description == null ? '' : `(${mark.description})`}`)
                })
            }
        })
    }, [studentsMarks]);

    const subjects = useMemo(() => {
        return classesWithSubjects.map(classData => classData.subjects)
                                  .reduce((prev, curr) => [...prev, ...curr], [])
                                  .filter((subject, index, subjects) => subjects.findIndex(subj => subj.subjectId === subject.subjectId) === index);
    }, [classesWithSubjects]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const classesWithSubjects = await getClassesWithSubjectsForTeacher(accessToken);
                setClassesWithSubjects(classesWithSubjects);
                console.log(JSON.stringify(classesWithSubjects));
            }
            catch(er) {
                console.log(er);
            }
        }
        fetchData();
    }, [accessToken, setClassesWithSubjects]);

    const showMarkBookSettingFormHandler = (e) => {
        e.preventDefault();
        setSelectMarkBookFormVisible(true);
    }

    const hideMarkBookSettingFormHandler = (e) => {
        e.preventDefault();
        setSelectMarkBookFormVisible(false);
    }

    const submitSelectMarkBookFormHandler = async(subjectId, schoolClassId, classGroupId, markBookDate) => {
        console.log(subjectId, schoolClassId, classGroupId, markBookDate);
        setSelectedSubject(subjectId);
        setSelectedSchoolClass(schoolClassId);
        setSelectedClassGroup(classGroupId);
        setSelectedDate(markBookDate);

        try {
            const studentsMarks = await getMarksForStudentsOfGroupAndSubjectAndDate(accessToken, schoolClassId,
                 classGroupId, subjectId, markBookDate);
            setStudentsMarks(studentsMarks);
            console.log(JSON.stringify(studentsMarks));
        }
        catch(er) {
            console.log(er);
        }
    }

    return (
        <div className={classes['page-container']}>
            <h2>Журнал оцінок</h2>
            {selectMarkBookFormVisible &&
                <Modal onClose={hideMarkBookSettingFormHandler}>
                    <SelectMarkBookForm subjects={subjects}
                                        schoolClasses={classesWithSubjects}
                                        onSelectMarkBook={submitSelectMarkBookFormHandler} />
                </Modal>
            }
            {<ContentTable columns={markBookFields} data={studentsToDisplay}/>}
            <button onClick={showMarkBookSettingFormHandler}>Налаштування журналу</button>
        </div>
    );
}

export default TeacherMarkBook;