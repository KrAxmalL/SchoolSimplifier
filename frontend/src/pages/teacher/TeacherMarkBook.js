import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { addMarkForStudent, deleteMark, getMarkBookForClassAndGroupAndSubject } from '../../api/markBooks';
import { getClassesWithSubjectsForTeacher, getStudentsOfClass } from '../../api/teacher';
import SelectMarkBookDateForm from '../../components/formteacher/SelectMarkBookDateForm';
import SelectMarkBookTopicForm from '../../components/formteacher/SelectMarkBookTopicForm';
import TeacherDateMarksTable from '../../components/table/TeacherDateMarksTable';
import TeacherTopicMarksTable from '../../components/table/TeacherTopicMarksTable';
import AddMarkForm from '../../components/teacher/AddMarkForm';
import DeleteMarkForm from '../../components/teacher/DeleteMarkForm';
import SelectMarkBookForm from '../../components/teacher/SelectMarkBookForm';
import Modal from '../../layout/Modal';
import classes from './TeacherMarkBook.module.css';

function TeacherMarkBook() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classesWithSubjects, setClassesWithSubjects] = useState([]);

    const [selectedStudents, setSelectedStudents] = useState(null);
    const [selectedMarkBook, setSelectedMarkBook] = useState(null);
    const [selectedTopicMarkBook, setSelectedTopicMarkBook] = useState(null);
    const [selectedDateMarkBook, setSelectedDateMarkBook] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectMarkBookFormVisible, setSelectMarkBookFormVisible] = useState(false);
    const [selectMarkBookTopicFormVisible, setSelectMarkBookTopicFormVisible] = useState(false);
    const [selectMarkBookDateFormVisible, setSelectMarkBookDateFormVisible] = useState(false);
    const [addMarkFormVisible, setAddMarkFormVisible] = useState(false);
    const [deleteMarkFormVisible, setDeleteMarkFormVisible] = useState(false);

    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSchoolClass, setSelectedSchoolClass] = useState(null);
    const [selectedClassGroup, setSelectedClassGroup] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

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

    const showSelectMarkBookFormHandler = (e) => {
        e.preventDefault();

        setSelectMarkBookFormVisible(true);
        setModalVisible(true);
    }

    const showSelectMarkBookTopicFormHandler = (e) => {
        e.preventDefault();

        setSelectMarkBookTopicFormVisible(true);
        setModalVisible(true);
    }

    const showSelectMarkBookDateFormHandler = (e) => {
        e.preventDefault();

        setSelectMarkBookDateFormVisible(true);
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

    const hideModalHandler = (e) => {
        e.preventDefault();

        setModalVisible(false);
        setSelectMarkBookFormVisible(false);
        setSelectMarkBookDateFormVisible(false);
        setSelectMarkBookTopicFormVisible(false);
        setAddMarkFormVisible(false);
        setDeleteMarkFormVisible(false);
    }

    const submitSelectMarkBookFormHandler = async(subjectId, schoolClassId, classGroupNumber) => {
        console.log(subjectId, schoolClassId, classGroupNumber);
        setSelectedSubject(subjectId);
        setSelectedSchoolClass(schoolClassId);
        setSelectedClassGroup(classGroupNumber);

        try {
            const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, schoolClassId,
                 classGroupNumber, subjectId);
            const studentsOfClass = await getStudentsOfClass(accessToken, schoolClassId);
            setSelectedMarkBook(markBook);
            setSelectedStudents(classGroupNumber === null
                                    ? studentsOfClass.classStudents
                                    : studentsOfClass.groupStudents[`${classGroupNumber}`]);
            console.log(JSON.stringify(markBook));
        }
        catch(er) {
            console.log(er);
        }
    }

    const submitSelectMarkBookTopicFormHandler = (markBookNamedTopicId) => {
        console.log(markBookNamedTopicId);

        setSelectedTopicMarkBook(selectedMarkBook.markBookNamedTopics.find(topic => topic.markBookNamedTopicId === markBookNamedTopicId));
    }

    const submitSelectMarkBookDateFormHandler = (markBookDateTopicId) => {
        console.log(markBookDateTopicId);

        setSelectedDateMarkBook(selectedMarkBook.markBookDateTopics.find(topic => topic.markBookDateTopicId === markBookDateTopicId));
    }

    const submitAddMarkFormHandler = async (selectedStudentId, selectedDate, studentPresent, mark, description) => {
        // try {
        //     await addMarkForStudent(accessToken, selectedStudentId, selectedSubject, selectedDate, studentPresent, mark, description);
        // } catch(er) {
        //     console.log(er);
        // }
    }

    const submitDeleteMarkFormHandler = async (selectedMarkRecordId) => {
        // try {
        //     await deleteMark(accessToken, selectedMarkRecordId);
        // } catch(er) {
        //     console.log(er);
        // }
    }

    return (
        <div className={classes['page-container']}>
            {modalVisible &&
                <Modal onClose={hideModalHandler}>
                    {selectMarkBookFormVisible &&
                        <SelectMarkBookForm subjects={subjects}
                                            schoolClasses={classesWithSubjects}
                                            onSelectMarkBook={submitSelectMarkBookFormHandler} />
                    }
                    {selectMarkBookTopicFormVisible &&
                        <SelectMarkBookTopicForm topics={selectedMarkBook.markBookNamedTopics}
                                                 onSelectMarkBookTopic={submitSelectMarkBookTopicFormHandler} />
                    }
                    {selectMarkBookDateFormVisible &&
                        <SelectMarkBookDateForm topics={selectedMarkBook.markBookDateTopics}
                                                onSelectMarkBookDate={submitSelectMarkBookDateFormHandler} />
                    }
                    {addMarkFormVisible &&
                        <AddMarkForm students={[]}
                                     onAddMark={submitAddMarkFormHandler} />
                    }
                    {deleteMarkFormVisible &&
                        <DeleteMarkForm studentsMarks={[]}
                                        onDeleteMark={submitDeleteMarkFormHandler} />
                    }
                </Modal>
            }

            <h2>Журнал оцінок</h2>
            <button onClick={showSelectMarkBookFormHandler}>Обрати журнал</button>
            {selectedMarkBook &&
                <React.Fragment>
                    <h3>Журнал поточних оцінок</h3>
                    <button onClick={showSelectMarkBookDateFormHandler}>Обрати дату</button>
                    {selectedDateMarkBook &&
                        <TeacherDateMarksTable students={selectedStudents}
                                               dateMarkRecords={selectedDateMarkBook.topicMarks} />
                    }

                    <h3>Журнал тематичних оцінок</h3>
                    <button onClick={showSelectMarkBookTopicFormHandler}>Обрати тему</button>
                    {selectedTopicMarkBook &&
                        <TeacherTopicMarksTable students={selectedStudents}
                                                topicMarkRecords={selectedTopicMarkBook.topicMarks} />
                    }
                </React.Fragment>
            }
        </div>
    );
}

export default TeacherMarkBook;