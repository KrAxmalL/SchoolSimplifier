import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassesDataForHeadTeacher } from "../../api/headteacher";
import { addLesson, deleteLesson, getAllLessons } from "../../api/lessons";
import { addScheduleRecord, deleteScheduleRecord } from "../../api/schedule";
import { getAllSubjects } from "../../api/subjects";
import { getAllTeachers } from "../../api/teacher";
import AddLessonForm from "../../components/headteacher/AddLessonForm";
import AddScheduleRecordForm from "../../components/headteacher/AddScheduleRecordForm";
import DeleteLessonForm from "../../components/headteacher/DeleteLessonForm";
import DeleteScheduleRecordForm from "../../components/headteacher/DeleteScheduleRecordForm";
import SelectSchoolClassForm from "../../components/headteacher/SelectSchoolClassForm";
import FormTeacherScheduleTable from "../../components/table/FormTeacherScheduleTable";
import { Days } from "../../domain/constants";
import Modal from "../../layout/Modal";

import classes from './HeadTeacherSchedule.module.css';

function HeadTeacherSchedule() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classesData, setClassesData] = useState([]);
    const [selectedClassData, setSelectedClassData] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [lessons, setLessons] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectSchoolClassFormVisible, setSelectedSchoolClassFormVisible] = useState(false);
    const [addScheduleRecordFormVisible, setAddScheduleRecordFormVisible] = useState(false);
    const [deleteScheduleRecordFormVisible, setDeleteScheduleRecordFormVisible] = useState(false);
    const [addLessonFormVisible, setAddLessonFormVisible] = useState(false);
    const [cantAddLessonError, setCantAddLessonError] = useState(false);
    const [deleteLessonFormVisible, setDeleteLessonFormVisible] = useState(false);
    const [cantDeleteLessonError, setCantDeleteLessonError] = useState(null);

    const classGroups = useMemo(() => {
        if(selectedClassData) {
            const classGroups = Object.keys(selectedClassData.groupStudents);
            classGroups.push("Весь клас");
            return classGroups.map(group => {
                return {classGroupNumber: group}
            });
        }
    }, [selectedClassData]);

    const days = useMemo(() => {
        return Object.keys(Days).map(dayName => Days[dayName]);
    }, []);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const classesData = await getClassesDataForHeadTeacher(accessToken);
                const teachers = await getAllTeachers(accessToken);
                const subjects = await getAllSubjects(accessToken);
                const lessons = await getAllLessons(accessToken);
                setClassesData(classesData);
                setTeachers(teachers);
                setSubjects(subjects)
                setLessons(lessons);
                console.log(`teacher class data: ${JSON.stringify(classesData)}`);
            }
            catch(er) {
                console.log(`fetching failed: ${er}`);
            }
        }
        fetchData();
    }, [accessToken]);

    const showSelectSchoolClassFormHandler = (e) => {
        e.preventDefault();

        setSelectedSchoolClassFormVisible(true);
        setModalVisible(true);
    };

    const showAddScheduleRecordFormHandler = (e) => {
        e.preventDefault();

        setAddScheduleRecordFormVisible(true);
        setModalVisible(true);
    };

    const showDeleteScheduleRecordFormHandler = (e) => {
        e.preventDefault();

        setDeleteScheduleRecordFormVisible(true);
        setModalVisible(true);
    };

    const showAddLessonFormVisible = (e) => {
        e.preventDefault();

        setAddLessonFormVisible(true);
        setModalVisible(true);
    };

    const showDeleteLessonFormVisible = (e) => {
        e.preventDefault();

        setDeleteLessonFormVisible(true);
        setModalVisible(true);
    };

    const hideModalHandler = (e) => {
        e.preventDefault();

        setModalVisible(false);
        setSelectedSchoolClassFormVisible(false);
        setAddScheduleRecordFormVisible(false);
        setDeleteScheduleRecordFormVisible(false);
        setAddLessonFormVisible(false);
        setDeleteLessonFormVisible(false);
    };

    const submitSelectSchoolClassFormHandler = (selectedSchoolClassId) => {
        const selectedClassData = classesData.find(schoolClass => schoolClass.schoolClassId === selectedSchoolClassId);
        setSelectedClassData(selectedClassData);
    };

    const submitAddScheduleRecordFormHandler = async (day, lessonId, subjectId, teacherId, classGroupNumber) => {
        console.log(day, lessonId, subjectId, teacherId, classGroupNumber);

        try {
            await addScheduleRecord(accessToken, day, lessonId, subjectId, teacherId,
                                    selectedClassData.schoolClassId, classGroupNumber);
            const newClassesData = await getClassesDataForHeadTeacher(accessToken);
            setClassesData(newClassesData);
            setSelectedClassData(prevSelectedClassData => {
                return newClassesData.find(schoolClass => schoolClass.schoolClassId === prevSelectedClassData.schoolClassId)
            });
        } catch(er) {
            console.log(er);
        }
    }

    const submitDeleteScheduleRecordFormHandler = async (scheduleRecordId) => {
        try {
            await deleteScheduleRecord(accessToken, scheduleRecordId);
            const newClassesData = await getClassesDataForHeadTeacher(accessToken);
            setClassesData(newClassesData);
            setSelectedClassData(prevSelectedClassData => {
                return newClassesData.find(schoolClass => schoolClass.schoolClassId === prevSelectedClassData.schoolClassId)
            });
        } catch(er) {
            console.log(er);
        }
    }

    const submitAddLessonFormHandler = async (lessonNumber, startTime, finishTime) => {
        const lessonWithSameParametersExists = lessons.some(lesson => {
            return lesson.lessonNumber === lessonNumber
                   && lesson.startTime.localeCompare(startTime) === 0
                   && lesson.finishTime.localeCompare(finishTime) === 0
        });
        if(!lessonWithSameParametersExists) {
            setCantAddLessonError(null);
            try {
                await addLesson(accessToken, lessonNumber, startTime, finishTime);
            } catch(er) {
                console.log(er);
            }
        }
        else {
            setCantAddLessonError('Такий урок уже існує');
            return;
        }
    }

    const submitDeleteLessonFormHandler = async (lessonId) => {
        console.log(lessonId);

        const selectedLesson = lessons.find(lesson => lesson.lessonId === lessonId);
        const scheduleRecordsOfLesson = classesData.map(classData => classData.classScheduleRecords)
                                                 .reduce((prev, curr) => [...prev, ...curr], [])
                                                 .filter(scheduleRecord => {
                                                    return scheduleRecord.lessonNumber === selectedLesson.lessonNumber
                                                           && scheduleRecord.lessonStartTime.localeCompare(selectedLesson.startTime) === 0
                                                           && scheduleRecord.lessonFinishTime.localeCompare(selectedLesson.finishTime) === 0;
                                                   });
        console.log('records with lesson: ' + JSON.stringify(scheduleRecordsOfLesson));
        if(scheduleRecordsOfLesson.length === 0) {
            setCantDeleteLessonError(null);
            try {
                await deleteLesson(accessToken, lessonId);
            } catch(er) {
                console.log(er);
            }
        }
        else {
            setCantDeleteLessonError(`Існує ${scheduleRecordsOfLesson.length} записів у розкладі для даного уроку, не можна видалити`);
            return;
        }
    }

    return (
        <div className={classes['page-container']}>
        <h2>Інформація про клас</h2>
        <button onClick={showSelectSchoolClassFormHandler}>Обрати клас</button>
        {modalVisible &&
            <Modal onClose={hideModalHandler}>
                {selectSchoolClassFormVisible &&
                    <SelectSchoolClassForm schoolClasses={classesData}
                                           onSelectSchoolClass={submitSelectSchoolClassFormHandler}/>
                }
                {addScheduleRecordFormVisible &&
                    <AddScheduleRecordForm days={days}
                                           lessons={lessons}
                                           subjects={subjects}
                                           teachers={teachers}
                                           classGroups={classGroups}
                                           onAddScheduleRecord={submitAddScheduleRecordFormHandler}/>
                }
                {deleteScheduleRecordFormVisible &&
                    <DeleteScheduleRecordForm scheduleRecords={selectedClassData.classScheduleRecords}
                                              onDeleteScheduleRecord={submitDeleteScheduleRecordFormHandler} />
                }
                {addLessonFormVisible &&
                    <AddLessonForm onAddLesson={submitAddLessonFormHandler}
                                   cantAddLessonError={cantAddLessonError} />
                }
                {deleteLessonFormVisible &&
                    <DeleteLessonForm lessons={lessons}
                                      onDeleteLesson={submitDeleteLessonFormHandler}
                                      cantDeleteLessonError={cantDeleteLessonError} />
                }
            </Modal>
        }

        {selectedClassData &&
            <React.Fragment>
                <FormTeacherScheduleTable scheduleRecords={selectedClassData.classScheduleRecords} />
                <button onClick={showAddScheduleRecordFormHandler}>Додати запис у розклад</button>
                <button onClick={showDeleteScheduleRecordFormHandler}>Видалити запис із розкладу</button>
            </React.Fragment>
        }
        <button onClick={showAddLessonFormVisible}>Додати урок</button>
        <button onClick={showDeleteLessonFormVisible}>Видалити урок</button>
    </div>
    );
};

export default HeadTeacherSchedule;