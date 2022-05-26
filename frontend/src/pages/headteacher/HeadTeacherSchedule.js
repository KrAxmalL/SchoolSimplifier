import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassesDataForHeadTeacher } from "../../api/headteacher";
import { getAllLessons } from "../../api/lessons";
import { addScheduleRecord, deleteScheduleRecord } from "../../api/schedule";
import { getAllSubjects } from "../../api/subjects";
import { getAllTeachers } from "../../api/teacher";
import AddScheduleRecordForm from "../../components/headteacher/AddScheduleRecordForm";
import DeleteScheduleRecordForm from "../../components/headteacher/DeleteScheduleRecordForm";
import SelectSchoolClassForm from "../../components/headteacher/SelectSchoolClassForm";
import FormTeacherScheduleTable from "../../components/table/FormTeacherScheduleTable";
import { Days } from "../../domain/constants";
import Modal from "../../layout/Modal";

import classes from './HeadTeacherSchedule.module.css';

function HeadTeacherSchedule() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classData, setClassData] = useState([]);
    const [selectedClassData, setSelectedClassData] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [lessons, setLessons] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectSchoolClassFormVisible, setSelectedSchoolClassFormVisible] = useState(false);
    const [addScheduleRecordFormVisible, setAddScheduleRecordFormVisible] = useState(false);
    const [deleteScheduleRecordFormVisible, setDeleteScheduleRecordFormVisible] = useState(false);

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
                const classData = await getClassesDataForHeadTeacher(accessToken);
                const teachers = await getAllTeachers(accessToken);
                const subjects = await getAllSubjects(accessToken);
                const lessons = await getAllLessons(accessToken);
                setClassData(classData);
                setTeachers(teachers);
                setSubjects(subjects)
                setLessons(lessons);
                console.log(`teacher class data: ${JSON.stringify(classData)}`);
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

    const hideModalHandler = (e) => {
        e.preventDefault();

        setModalVisible(false);
        setSelectedSchoolClassFormVisible(false);
        setAddScheduleRecordFormVisible(false);
        setDeleteScheduleRecordFormVisible(false);
    };

    const submitSelectSchoolClassFormHandler = (selectedSchoolClassId) => {
        const selectedClassData = classData.find(schoolClass => schoolClass.schoolClassId === selectedSchoolClassId);
        setSelectedClassData(selectedClassData);
    };

    const submitAddScheduleRecordFormHandler = async (day, lessonId, subjectId, teacherId, classGroupNumber) => {
        console.log(day, lessonId, subjectId, teacherId, classGroupNumber);

        try {
            await addScheduleRecord(accessToken, day, lessonId, subjectId, teacherId,
                                    selectedClassData.schoolClassId, classGroupNumber);
        } catch(er) {
            console.log(er);
        }
    }

    const submitDeleteScheduleRecordFormHandler = async (scheduleRecordId) => {
        try {
            await deleteScheduleRecord(accessToken, scheduleRecordId);
        } catch(er) {
            console.log(er);
        }
    }

    return (
        <div className={classes['page-container']}>
        <h2>Інформація про клас</h2>
        <button onClick={showSelectSchoolClassFormHandler}>Обрати клас</button>
        {modalVisible &&
            <Modal onClose={hideModalHandler}>
                {selectSchoolClassFormVisible &&
                    <SelectSchoolClassForm schoolClasses={classData}
                                           onSelectSchoolClass={submitSelectSchoolClassFormHandler}/>
                }
                {addScheduleRecordFormVisible &&
                    <AddScheduleRecordForm days={days}
                                           lessons={lessons}
                                           subjects={subjects}
                                           teachers={teachers}
                                           classGroups={classGroups}
                                           onAddScheduleRecord={submitAddScheduleRecordFormHandler} />
                }
                {deleteScheduleRecordFormVisible &&
                    <DeleteScheduleRecordForm scheduleRecords={selectedClassData.classScheduleRecords}
                                              onDeleteScheduleRecord={submitDeleteScheduleRecordFormHandler} />
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
    </div>
    );
};

export default HeadTeacherSchedule;