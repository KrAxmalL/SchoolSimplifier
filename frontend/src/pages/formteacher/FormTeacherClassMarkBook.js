import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassDataForTeacher, getClassGroupsAndSubjects, getMarkBooksForClass } from "../../api/formteacher";
import Modal from '../../layout/Modal';
import classes from './FormTeacherClassMarkBook.module.css';
import TeacherTopicMarksTable from "../../components/table/TeacherTopicMarksTable";
import TeacherDateMarksTable from "../../components/table/TeacherDateMarksTable";
import SelectClassMarkBookForm from "../../components/formteacher/SelectClassMarkBookForm";
import SelectMarkBookTopicForm from "../../components/formteacher/SelectMarkBookTopicForm";
import SelectMarkBookDateForm from "../../components/formteacher/SelectMarkBookDateForm";

function FormTeacherClassMarkBook() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classGroupsSubjects, setClassGroupsSubjects] = useState([]);
    const [classData, setClassData] = useState([]);
    const [markBooks, setMarkBooks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectClassMarkBookFormVisible, setSelectClassMarkBookFormVisible] = useState(false);
    const [selectMarkBookTopicFormVisible, setSelectMarkBookTopicFormVisible] = useState(false);
    const [selectMarkBookDateFormVisible, setSelectMarkBookDateFormVisible] = useState(false);

    const [selectedStudents, setSelectedStudents] = useState(null);
    const [selectedMarkBook, setSelectedMarkBook] = useState(null);
    const [selectedTopicMarkBook, setSelectedTopicMarkBook] = useState(null);
    const [selectedDateMarkBook, setSelectedDateMarkBook] = useState(null);

    const subjects = useMemo(() => {
        return classGroupsSubjects.map(classGroupSubjects => classGroupSubjects.subjects)
                                  .reduce((prev, curr) => [...prev, ...curr], [])
                                  .filter((subject, index, arr) => arr.findIndex(subj => subj.subjectId === subject.subjectId) === index);
    }, [classGroupsSubjects]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const classData = await getClassDataForTeacher(accessToken);
                const classGroupsSubjects = await getClassGroupsAndSubjects(accessToken);
                const markBooks = await getMarkBooksForClass(accessToken);
                setClassData(classData);
                setClassGroupsSubjects(classGroupsSubjects);
                setMarkBooks(markBooks);
                console.log(JSON.stringify(classGroupsSubjects));
            }
            catch(er) {
                console.log(er);
            }
        }
        fetchData();
    }, [accessToken, setClassGroupsSubjects]);

    const showSelectClassMarkBookFormHandler = (e) => {
        e.preventDefault();

        setSelectClassMarkBookFormVisible(true);
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

    const hideModalHandler = (e) => {
        e.preventDefault();

        setModalVisible(false);
        setSelectClassMarkBookFormVisible(false);
        setSelectMarkBookTopicFormVisible(false);
        setSelectMarkBookDateFormVisible(false);
    }

    const submitSelectClassMarkBookFormHandler = (subjectId, classGroupId) => {
        console.log(subjectId, classGroupId);

        setSelectedStudents(classGroupId === null
                                ? classData.classStudents
                                : classData.groupStudents[`${classGroupId}`]);
        setSelectedMarkBook(markBooks.find(markBook => markBook.subjectId === subjectId
                                                        && markBook.classGroupId === classGroupId));
        setSelectedDateMarkBook(null);
        setSelectedTopicMarkBook(null);
    }

    const submitSelectMarkBookTopicFormHandler = (markBookNamedTopicId) => {
        console.log(markBookNamedTopicId);

        setSelectedTopicMarkBook(selectedMarkBook.markBookNamedTopics.find(topic => topic.markBookNamedTopicId === markBookNamedTopicId));
    }

    const submitSelectMarkBookDateFormHandler = (markBookDateTopicId) => {
        console.log(markBookDateTopicId);

        setSelectedDateMarkBook(selectedMarkBook.markBookDateTopics.find(topic => topic.markBookDateTopicId === markBookDateTopicId));
    }

    return (
        <div className={classes['page-container']}>
            {modalVisible &&
                <Modal onClose={hideModalHandler}>
                    {selectClassMarkBookFormVisible &&
                        <SelectClassMarkBookForm subjects={subjects}
                                                 classGroups={classGroupsSubjects}
                                                 onSelectClassMarkBook={submitSelectClassMarkBookFormHandler} />
                    }
                    {selectMarkBookTopicFormVisible &&
                        <SelectMarkBookTopicForm topics={selectedMarkBook.markBookNamedTopics}
                                                 onSelectMarkBookTopic={submitSelectMarkBookTopicFormHandler} />
                    }
                    {selectMarkBookDateFormVisible &&
                        <SelectMarkBookDateForm topics={selectedMarkBook.markBookDateTopics}
                                                onSelectMarkBookDate={submitSelectMarkBookDateFormHandler} />
                    }
                </Modal>
            }
            <h2>Журнал оцінок</h2>
            <button onClick={showSelectClassMarkBookFormHandler}>Налаштування журналу</button>

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

export default FormTeacherClassMarkBook;