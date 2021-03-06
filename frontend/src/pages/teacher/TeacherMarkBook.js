import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { addMarkBookDateRecord, deleteMarkBookDateTopicRecord } from '../../api/markBookDateMarkRecords';
import { addMarkBookDateTopic, deleteMarkBookDateTopic } from '../../api/markBookDateTopics';
import { addMarkBookNamedRecord, deleteMarkBookNamedTopicRecord } from '../../api/markBookNamedMarkRecords';
import { addMarkBookNamedTopic, deleteMarkBookNamedTopic } from '../../api/markBookNamedTopics';
import { getMarkBookForClassAndGroupAndSubject } from '../../api/markBooks';
import { getClassesWithSubjectsForTeacher, getStudentsOfClass } from '../../api/teacher';
import SelectMarkBookDateForm from '../../components/formteacher/SelectMarkBookDateForm';
import SelectMarkBookTopicForm from '../../components/formteacher/SelectMarkBookTopicForm';
import TeacherDateMarksTable from '../../components/table/TeacherDateMarksTable';
import TeacherTopicMarksTable from '../../components/table/TeacherTopicMarksTable';
import AddMarkBookDateRecordForm from '../../components/teacher/AddMarkBookDateRecordForm';
import AddMarkBookDateTopicForm from '../../components/teacher/AddMarkBookDateTopicForm';
import AddMarkBookNamedRecordForm from '../../components/teacher/AddMarkBookNamedRecordForm';
import AddMarkBookNamedTopicForm from '../../components/teacher/AddMarkBookNamedTopicForm';
import DeleteMarkBookDateTopicForm from '../../components/teacher/DeleteMarkBookDateTopicForm';
import DeleteMarkBookNamedTopicForm from '../../components/teacher/DeleteMarkBookNamedTopicForm';
import SelectMarkBookForm from '../../components/teacher/SelectMarkBookForm';
import SelectStudentToDeleteMarkRecordForm from '../../components/teacher/SelectStudentToDeleteMarkRecordForm';
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
    const [cantAddMarkBookNamedTopicError, setCantAddMarkBookNamedTopicError] = useState(null);
    const [deleteMarkBookTopicFormVisible, setDeleteMarkBookTopicFormVisible] = useState(false);
    const [cantDeleteMarkBookNamedTopicError, setCantDeleteMarkBookNamedTopicError] = useState(null);
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

    const studentsWithDateMarkRecords = useMemo(() => {
        if(selectedStudents && selectedDateMarkBook) {
            return selectedStudents.filter(student =>
                selectedDateMarkBook.topicMarks.some(studentDateMarkRecord =>
                    student.studentId === studentDateMarkRecord.student.studentId
                )
            );
        }
        else {
            return [];
        }
    }, [selectedStudents, selectedDateMarkBook]);

    const studentsWithoutNamedMarkRecords = useMemo(() => {
        if(selectedStudents && selectedTopicMarkBook) {
            return selectedStudents.filter(student =>
                !selectedTopicMarkBook.topicMarks.some(studentTopicMarkRecord =>
                    student.studentId === studentTopicMarkRecord.student.studentId
                )
            );
        }
        else {
            return [];
        }
    }, [selectedStudents, selectedTopicMarkBook]);

    const studentsWithNamedMarkRecords = useMemo(() => {
        if(selectedStudents && selectedTopicMarkBook) {
            return selectedStudents.filter(student =>
                selectedTopicMarkBook.topicMarks.some(studentTopicMarkRecord =>
                    student.studentId === studentTopicMarkRecord.student.studentId
                )
            );
        }
        else {
            return [];
        }
    }, [selectedStudents, selectedTopicMarkBook]);

    useEffect(() => {
        if(selectedDateMarkBook !== null) {
            setSelectedDateMarkBook(selectedMarkBook.markBookDateTopics.find(topic =>
                topic.markBookDateTopicId === selectedDateMarkBook.markBookDateTopicId)
            );
        }
       if(selectedTopicMarkBook !== null) {
           setSelectedTopicMarkBook(selectedMarkBook.markBookNamedTopics.find(topic =>
               topic.markBookNamedTopicId === selectedTopicMarkBook.markBookNamedTopicId)
           );
       }
    }, [selectedMarkBook, setSelectedDateMarkBook, setSelectedTopicMarkBook]);

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
        setCantAddMarkBookDateTopicError(null);
        setCantDeleteMarkBookDateTopicError(null);
        setCantAddMarkBookNamedTopicError(null);
        setCantDeleteMarkBookNamedTopicError(null);
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
            setCantAddMarkBookDateTopicError('???????????? ???????? ?????? ?????????? ?? ??????????????');
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
            setCantDeleteMarkBookDateTopicError(`?????????? ${dateMarkRecordNumber} ???????????? ???? ???????????? ????????, ???? ?????????? ????????????????`);
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
        } catch(er) {
            console.log(er);
        }
    }

    const submitDeleteMarkBookDateRecordFormHandler = async (studentId) => {
        const dateMarkRecordToDelete =
            selectedDateMarkBook.topicMarks.find(dateMarkRecord => dateMarkRecord.student.studentId === studentId);
        try {
            await deleteMarkBookDateTopicRecord(accessToken, dateMarkRecordToDelete.dateMarkRecordId);
            const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, selectedSchoolClassId,
                                                                         selectedClassGroupNumber, selectedSubjectId);
            setSelectedMarkBook(markBook);
        } catch(er) {
            console.log(er);
        }
    }

    const submitAddMarkBookNamedTopicFormHandler = async (topicName) => {
        const topicWithName = selectedMarkBook.markBookNamedTopics.find(namedTopic =>
            namedTopic.topicName.localeCompare(topicName) === 0);
        if(topicWithName) {
            setCantAddMarkBookNamedTopicError('???????? ???? ?????????? ???????????? ?????? ?????????? ?? ??????????????');
            return;
        }
        else {
            setCantAddMarkBookNamedTopicError(null);
            try {
                await addMarkBookNamedTopic(accessToken, topicName, selectedMarkBook.markBookId);
                const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, selectedSchoolClassId,
                    selectedClassGroupNumber, selectedSubjectId);
                setSelectedMarkBook(markBook);
            } catch(er) {
                console.log(er);
            }
        }
    }

    const submitDeleteMarkBookNamedTopicFormHandler = async (namedTopicId) => {
        const namedTopicToDelete = selectedMarkBook.markBookNamedTopics.find(namedTopic =>
            namedTopic.markBookNamedTopicId === namedTopicId);
        const namedMarkRecordNumber = namedTopicToDelete.topicMarks.length;
        if(namedMarkRecordNumber > 0) {
            setCantDeleteMarkBookNamedTopicError(`?????????? ${namedMarkRecordNumber} ???????????? ???? ???????????? ????????, ???? ?????????? ????????????????`);
            return;
        }
        else {
            setCantDeleteMarkBookNamedTopicError(null);
            try {
                await deleteMarkBookNamedTopic(accessToken, namedTopicId);
                const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, selectedSchoolClassId,
                    selectedClassGroupNumber, selectedSubjectId);
                setSelectedMarkBook(markBook);
            } catch(er) {
                console.log(er);
            }
        }
    }

    const submitAddMarkBookNamedRecordFormHandler = async (studentId, mark) => {
        try {
            await addMarkBookNamedRecord(accessToken, studentId, selectedTopicMarkBook.markBookNamedTopicId,
                                         mark);
            const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, selectedSchoolClassId,
                                                                         selectedClassGroupNumber, selectedSubjectId);
            setSelectedMarkBook(markBook);
        } catch(er) {
            console.log(er);
        }
    }

    const submitDeleteMarkBookNamedRecordFormHandler = async (studentId) => {
        const namedMarkRecordToDelete =
            selectedTopicMarkBook.topicMarks.find(namedMarkRecord => namedMarkRecord.student.studentId === studentId);
        try {
            await deleteMarkBookNamedTopicRecord(accessToken, namedMarkRecordToDelete.topicMarkRecordId);
            const markBook = await getMarkBookForClassAndGroupAndSubject(accessToken, selectedSchoolClassId,
                                                                         selectedClassGroupNumber, selectedSubjectId);
            setSelectedMarkBook(markBook);
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
                        <SelectStudentToDeleteMarkRecordForm
                                    students={studentsWithDateMarkRecords}
                                    onSelectStudentToDeleteMarkRecord={submitDeleteMarkBookDateRecordFormHandler} />
                    }
                    {addMarkBookTopicFormVisible &&
                        <AddMarkBookNamedTopicForm onAddMarkBookNamedTopic={submitAddMarkBookNamedTopicFormHandler}
                                                   cantAddMarkBookNamedTopicError={cantAddMarkBookNamedTopicError} />
                    }
                    {deleteMarkBookTopicFormVisible &&
                        <DeleteMarkBookNamedTopicForm topics={selectedMarkBook.markBookNamedTopics}
                                                      onDeleteMarkBookNamedTopic={submitDeleteMarkBookNamedTopicFormHandler}
                                                      cantDeleteMarkBookNamedTopicError={cantDeleteMarkBookNamedTopicError} />
                    }
                    {addMarkBookTopicRecordFormVisible &&
                        <AddMarkBookNamedRecordForm students={studentsWithoutNamedMarkRecords}
                                                    onAddMarkBookNamedRecord={submitAddMarkBookNamedRecordFormHandler} />
                    }
                    {deleteMarkBookTopicRecordFormVisible &&
                        <SelectStudentToDeleteMarkRecordForm
                                    students={studentsWithNamedMarkRecords}
                                     onSelectStudentToDeleteMarkRecord={submitDeleteMarkBookNamedRecordFormHandler} />
                    }
                </Modal>
            }

            <h2>???????????? ????????????</h2>
            <button onClick={showSelectMarkBookFormHandler}>???????????? ????????????</button>
            {selectedMarkBook &&
                <React.Fragment>
                    <h3>???????????? ???????????????? ????????????</h3>
                    <button onClick={showSelectMarkBookDateFormHandler}>???????????? ????????</button>
                    <button onClick={showAddMarkBookDateFormHandler}>???????????? ????????</button>
                    <button onClick={showDeleteMarkBookDateFormHandler}>???????????????? ????????</button>
                    {selectedDateMarkBook &&
                        <React.Fragment>
                            <TeacherDateMarksTable students={selectedStudents}
                                                dateMarkRecords={selectedDateMarkBook.topicMarks} />
                            <button onClick={showAddMarkBookDateRecordFormHandler}>???????????? ?????????????? ????????????</button>
                            <button onClick={showDeleteMarkBookDateRecordFormHandler}>???????????????? ?????????????? ????????????</button>
                        </React.Fragment>
                    }

                    <h3>???????????? ???????????????????? ????????????</h3>
                    <button onClick={showSelectMarkBookTopicFormHandler}>???????????? ????????</button>
                    <button onClick={showAddMarkBookTopicFormHandler}>???????????? ????????</button>
                    <button onClick={showDeleteMarkBookTopicFormHandler}>???????????????? ????????</button>
                    {selectedTopicMarkBook &&
                        <React.Fragment>
                            <TeacherTopicMarksTable students={selectedStudents}
                                                    topicMarkRecords={selectedTopicMarkBook.topicMarks} />
                            <button onClick={showAddMarkBookTopicRecordFormHandler}>???????????? ?????????????????? ????????????</button>
                            <button onClick={showDeleteMarkBookTopicRecordFormHandler}>???????????????? ?????????????????? ????????????</button>
                        </React.Fragment>
                    }
                </React.Fragment>
            }
        </div>
    );
}

export default TeacherMarkBook;