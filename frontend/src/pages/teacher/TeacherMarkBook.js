
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { addMarkForStudent, deleteMark, getMarksForStudentsOfGroupAndSubjectAndDate } from '../../api/marks';
import { getClassesWithSubjectsForTeacher, getSubjectsForTeacher } from '../../api/teacher';
import ContentTable from '../../components/table/ContentTable';
import AddMarkForm from '../../components/teacher/AddMarkForm';
import DeleteMarkForm from '../../components/teacher/DeleteMarkForm';
import SelectMarkBookForm from '../../components/teacher/SelectMarkBookForm';
import Modal from '../../layout/Modal';
import classes from './TeacherMarkBook.module.css';

const markBookFields = ['ПІБ учня', 'Оцінки'];

function TeacherMarkBook() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classesWithSubjects, setClassesWithSubjects] = useState([]);
    const [markBookSelected, setMarkBookSelected] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectMarkBookFormVisible, setSelectMarkBookFormVisible] = useState(false);
    const [addMarkFormVisible, setAddMarkFormVisible] = useState(false);
    const [deleteMarkFormVisible, setDeleteMarkFormVisible] = useState(false);
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

    const hideModalHandler = (e) => {
        e.preventDefault();
        setModalVisible(false);
        setSelectMarkBookFormVisible(false);
        setAddMarkFormVisible(false);
        setDeleteMarkFormVisible(false);
    }

    const showMarkBookSettingFormHandler = (e) => {
        e.preventDefault();
        setSelectMarkBookFormVisible(true);
        setModalVisible(true);
    }

    const showAddMarkFormHandler = (e) => {
        e.preventDefault();

        setAddMarkFormVisible(true);
        setModalVisible(true);
    }

    const showDeleteMarkFormHandler = (e) => {
        e.preventDefault();

        setDeleteMarkFormVisible(true);
        setModalVisible(true);
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
            setMarkBookSelected(true);
            console.log(JSON.stringify(studentsMarks));
        }
        catch(er) {
            console.log(er);
        }
    }

    const submitAddMarkFormHandler = async (selectedStudentId, selectedDate, studentPresent, mark, description) => {
        try {
            await addMarkForStudent(accessToken, selectedStudentId, selectedSubject, selectedDate, studentPresent, mark, description);
        } catch(er) {
            console.log(er);
        }
    }

    const submitDeleteMarkFormHandler = async (selectedMarkRecordId) => {
        try {
            await deleteMark(accessToken, selectedMarkRecordId);
        } catch(er) {
            console.log(er);
        }
    }

    return (
        <div className={classes['page-container']}>
            <h2>Журнал оцінок</h2>
            {modalVisible &&
                <Modal onClose={hideModalHandler}>
                    {selectMarkBookFormVisible &&
                        <SelectMarkBookForm subjects={subjects}
                                            schoolClasses={classesWithSubjects}
                                            onSelectMarkBook={submitSelectMarkBookFormHandler} />
                    }
                    {addMarkFormVisible &&
                        <AddMarkForm students={studentsMarks}
                                     onAddMark={submitAddMarkFormHandler} />
                    }
                    {deleteMarkFormVisible &&
                        <DeleteMarkForm studentsMarks={studentsMarks}
                                        onDeleteMark={submitDeleteMarkFormHandler} />
                    }
                </Modal>
            }
            <ContentTable columns={markBookFields} data={studentsToDisplay}/>
            <button onClick={showMarkBookSettingFormHandler}>Налаштування журналу</button>
            {markBookSelected && <button onClick={showAddMarkFormHandler}>Відмітити учнів</button>}
            {markBookSelected && <button onClick={showDeleteMarkFormHandler}>Видалити запис</button>}
        </div>
    );
}

export default TeacherMarkBook;