import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { addMarkBookDateRecord } from '../../api/markBookDateMarkRecords';
import { addMarkBookDateTopic, deleteMarkBookDateTopic } from '../../api/markBookDateTopics';
import { getMarkBookForClassAndGroupAndSubject } from '../../api/markBooks';
import { getClassesWithSubjectsForTeacher, getStudentsOfClass } from '../../api/teacher';
import SelectMarkBookDateForm from '../../components/formteacher/SelectMarkBookDateForm';
import SelectMarkBookTopicForm from '../../components/formteacher/SelectMarkBookTopicForm';
import TeacherDateMarksTable from '../../components/table/TeacherDateMarksTable';
import TeacherTopicMarksTable from '../../components/table/TeacherTopicMarksTable';
import AddMarkBookDateRecordForm from '../../components/teacher/AddMarkBookDateRecordForm';
import AddMarkBookDateTopicForm from '../../components/teacher/AddMarkBookDateTopicForm';
import DeleteMarkBookDateTopicForm from '../../components/teacher/DeleteMarkBookDateTopicForm';
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
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedSchoolClassId, setSelectedSchoolClassId] = useState(null);
    const [selectedClassGroupNumber, setSelectedClassGroupNumber] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectMarkBookFormVisible, setSelectMarkBookFormVisible] = useState(false);
    const [selectMarkBookTopicFormVisible, setSelectMarkBookTopicFormVisible] = useState(false);
    const [selectMarkBookDateFormVisible, setSelectMarkBookDateFormVisible] = useState(false);
    const [addMarkBookDateFormVisible, setAddMarkBookDateFormVisible] = useState(false);
    const [cantAddMarkBookDateTopicError, setCantAddMarkBookDateTopicError] = useState(null);
    const [deleteMarkBookDateFormVisible, setDeleteMarkBookDateFormVisible] = useState(false);
    const [cantDeleteMarkBookDateTopicError, setCantDeleteMarkBookDateTopicError] = useState(null);
    const [addMarkBookDateRecordFormVisible, setAddMarkBookDateRecordFormVisible] = useState(false);
    const [deleteMarkBookDateRecordFormVisible, setDeleteMarkBookDateRecordFormVisible] = useState(false);
    const [addMarkBookTopicFormVisible, setAddMarkBookTopicFormVisible] = useState(false);
    const [deleteMarkBookTopicFormVisible, setDeleteMarkBookTopicFormVisible] = useState(false);
    const [addMarkBookTopicRecordFormVisible, setAddMarkBookTopicRecordFormVisible] = useState(false);
    const [deleteMarkBookTopicRecordFormVisible, setDeleteMarkBookTopicRecordFormVisible] = useState(false);

    const subjects = useMemo(() => {
        return classesWithSubjects.map(classData => classData.subjects)
                                  .reduce((prev, curr) => [...prev, ...curr], [])
                                  .filter((subject, index, subjects) => subjects.findIndex(subj => subj.subjectId === subject.subjectId) === index);
    }, [classesWithSubjects]);

    const studentsWithoutDateMarkRecords = useMemo(() => {
        if(selectedStudents && selectedDateMarkBook) {
            return selectedStudents.filter(student =>
                !selectedDateMarkBook.topicMarks.some(studentDateMarkRecord => 
                    student.studentId === studentDateMarkRecord.student.studentId
                )
            );
        }
        else {
            return [];
        }
    }, [selectedStudents, selectedDateMarkBook]);

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

    const showAddMarkBookDateFormHandler = (e) => {
        e.preventDefault();

        setAddMarkBookDateFormVisible(true);
        setModalVisible(true);
    }

    const showDeleteMarkBookDateFormHandler = (e) => {
        e.preventDefault();

        setDeleteMarkBookDateFormVisible(true);
        setModalVisible(true);
    }

    const showAddMarkBookDateRecordFormHandler = (e) => {
        e.preventDefault();

        setAddMarkBookDateRecordFormVisible(true);
        setModalVisible(true);
    }

    const showDeleteMarkBookDateRecordFormHandler = (e) => {
        e.preventDefault();

        setDeleteMarkBookDateRecordFormVisible(true);
        setModalVisible(true);
    }

    const showAddMarkBookTopicFormHandler = (e) => {
        e.preventDefault();

        setAddMarkBookTopicFormVisible(true);
        setModalVisible(true);
    }

    const showDeleteMarkBookTopicFormHandler = (e) => {
        e.preventDefault();

        setDeleteMarkBookTopicFormVisible(true);
        setModalVisible(true);
    }

    const showAddMarkBookTopicRecordFormHandler = (e) => {
        e.preventDefault();

        setAddMarkBookTopicRecordFormVisible(true);
        setModalVisible(true);
    }

    const showDeleteMarkBookTopicRecordFormHandler = (e) => {
        e.preventDefault();

        setDeleteMarkBookTopicRecordFormVisible(true);
        setModalVisible(true);
    }

    const hideModalHandler = (e) => {
        e.preventDefault();

        setModalVisible(false);
        setSelectMarkBookFormVisible(false);
        setSelectMarkBookDateFormVisible(false);
        setSelectMarkBookTopicFormVisible(false);
        setAddMarkBookDateFormVisible(false);
        setDeleteMarkBookDateFormVisible(false);
        setAddMarkBookDateRecordFormVisible(false);
        setDeleteMarkBookDateRecordFormVisible(false);
        setAddMarkBookTopicFormVisible(false);
        setDeleteMarkBookTopicFormVisible(false);
        setAddMarkBookTopicRecordFormVisible(false);
        setDeleteMarkBookTopicRecordFormVisible(false);
        //todo: set form errors to null
    }

    const submitSelectMarkBookFormHandler = async(subjectId, schoolClassId, classGroupNumber) => {
        console.log(subjectId, schoolClassId, classGroupNumber);
        try {
            const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, schoolClassId,
                 classGroupNumber, subjectId);
            const studentsOfClass = await getStudentsOfClass(accessToken, schoolClassId);
            setSelectedMarkBook(markBook);
            setSelectedStudents(classGroupNumber === null
                                    ? studentsOfClass.classStudents
                                    : studentsOfClass.groupStudents[`${classGroupNumber}`]);
            setSelectedSubjectId(subjectId);
            setSelectedSchoolClassId(schoolClassId);
            setSelectedClassGroupNumber(classGroupNumber);
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

    const submitAddMarkBookDateTopicFormHandler = async (topicDate) => {
        const topicWithDate = selectedMarkBook.markBookDateTopics.find(dateTopic => dateTopic.topicDate.localeCompare(topicDate) === 0);
        if(topicWithDate) {
            setCantAddMarkBookDateTopicError('Обрана дата уже існує в журналі');
            return;
        }
        else {
            setCantAddMarkBookDateTopicError(null);
            try {
                await addMarkBookDateTopic(accessToken, topicDate, selectedMarkBook.markBookId);
                const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, selectedSchoolClassId,
                    selectedClassGroupNumber, selectedSubjectId);
                setSelectedMarkBook(markBook);

            } catch(er) {
                console.log(er);
            }
        }
    }

    const submitDeleteMarkBookDateTopicFormHandler = async (dateTopicId) => {
        const dateTopicToDelete = selectedMarkBook.markBookDateTopics.find(dateTopic => dateTopic.markBookDateTopicId === dateTopicId);
        const dateMarkRecordNumber = dateTopicToDelete.topicMarks.length;
        if(dateMarkRecordNumber > 0) {
            setCantDeleteMarkBookDateTopicError(`Існує ${dateMarkRecordNumber} оцінок за обрану дату, не можна видалити`);
            return;
        }
        else {
            setCantDeleteMarkBookDateTopicError(null);
            try {
                await deleteMarkBookDateTopic(accessToken, dateTopicId);
                const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, selectedSchoolClassId,
                    selectedClassGroupNumber, selectedSubjectId);
                setSelectedMarkBook(markBook);
            } catch(er) {
                console.log(er);
            }
        }
    }

    const submitAddMarkBookDateRecordFormHandler = async (studentId, studentPresent, mark) => {
        try {
            await addMarkBookDateRecord(accessToken, studentId, selectedDateMarkBook.markBookDateTopicId,
                                        studentPresent, mark);
            const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, selectedSchoolClassId,
                                                                         selectedClassGroupNumber, selectedSubjectId);
            setSelectedMarkBook(markBook);
            setSelectedDateMarkBook(markBook.markBookDateTopics.find(topic =>
                 topic.markBookDateTopicId === selectedDateMarkBook.markBookDateTopicId)
            );
            setSelectedTopicMarkBook(selectedMarkBook.markBookNamedTopics.find(topic =>
                topic.markBookNamedTopicId === selectedTopicMarkBook.markBookNamedTopicId)
            );
        } catch(er) {
            console.log(er);
        }
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
                    {selectMarkBookDateFormVisible &&
                        <SelectMarkBookDateForm topics={selectedMarkBook.markBookDateTopics}
                                                onSelectMarkBookDate={submitSelectMarkBookDateFormHandler} />
                    }
                    {selectMarkBookTopicFormVisible &&
                        <SelectMarkBookTopicForm topics={selectedMarkBook.markBookNamedTopics}
                                                 onSelectMarkBookTopic={submitSelectMarkBookTopicFormHandler} />
                    }
                    {addMarkBookDateFormVisible &&
                        <AddMarkBookDateTopicForm onAddMarkBookDateTopic={submitAddMarkBookDateTopicFormHandler}
                                                  cantAddMarkBookDateTopicError={cantAddMarkBookDateTopicError} />
                    }
                    {deleteMarkBookDateFormVisible &&
                        <DeleteMarkBookDateTopicForm topics={selectedMarkBook.markBookDateTopics} 
                                                     onDeleteMarkBookDateTopic={submitDeleteMarkBookDateTopicFormHandler}
                                                     cantDeleteMarkBookDateTopicError={cantDeleteMarkBookDateTopicError} />
                    }
                    {addMarkBookDateRecordFormVisible &&
                        <AddMarkBookDateRecordForm students={studentsWithoutDateMarkRecords}
                                                   onAddMarkBookDateRecord={submitAddMarkBookDateRecordFormHandler} />
                    }
                    {deleteMarkBookDateRecordFormVisible &&
                        <></>
                    }
                    {addMarkBookTopicFormVisible &&
                        <></>
                    }
                    {deleteMarkBookTopicFormVisible &&
                        <></>
                    }
                    {addMarkBookTopicRecordFormVisible &&
                        <></>
                    }
                    {deleteMarkBookTopicRecordFormVisible &&
                        <></>
                    }
                </Modal>
            }

            <h2>Журнал оцінок</h2>
            <button onClick={showSelectMarkBookFormHandler}>Обрати журнал</button>
            {selectedMarkBook &&
                <React.Fragment>
                    <h3>Журнал поточних оцінок</h3>
                    <button onClick={showSelectMarkBookDateFormHandler}>Обрати дату</button>
                    <button onClick={showAddMarkBookDateFormHandler}>Додати дату</button>
                    <button onClick={showDeleteMarkBookDateFormHandler}>Видалити дату</button>
                    {selectedDateMarkBook &&
                        <React.Fragment>
                            <TeacherDateMarksTable students={selectedStudents}
                                                dateMarkRecords={selectedDateMarkBook.topicMarks} />
                            <button onClick={showAddMarkBookDateRecordFormHandler}>Додати поточну оцінку</button>
                            <button onClick={showDeleteMarkBookDateRecordFormHandler}>Видалити поточну оцінку</button>
                        </React.Fragment>
                    }

                    <h3>Журнал тематичних оцінок</h3>
                    <button onClick={showSelectMarkBookTopicFormHandler}>Обрати тему</button>
                    <button onClick={showAddMarkBookTopicFormHandler}>Додати тему</button>
                    <button onClick={showDeleteMarkBookTopicFormHandler}>Видалити тему</button>
                    {selectedTopicMarkBook &&
                        <React.Fragment>
                            <TeacherTopicMarksTable students={selectedStudents}
                                                    topicMarkRecords={selectedTopicMarkBook.topicMarks} />
                            <button onClick={showAddMarkBookTopicRecordFormHandler}>Додати тематичну оцінку</button>
                            <button onClick={showDeleteMarkBookTopicRecordFormHandler}>Видалити тематичну оцінку</button>
                        </React.Fragment>
                    }
                </React.Fragment>
            }
        </div>
    );
}

export default TeacherMarkBook;