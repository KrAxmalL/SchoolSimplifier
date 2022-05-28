import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassesDataForHeadTeacher } from "../../api/headteacher";
import { addSchoolClass, deleteSchoolClass } from "../../api/schoolClasses";
import { getAllTeachers } from "../../api/teacher";
import FullClassData from "../../components/formteacher/FullClassData";
import AddSchoolClassForm from "../../components/headteacher/AddSchoolClassForm";
import DeleteSchoolClassForm from "../../components/headteacher/DeleteSchoolClassForm";
import SelectSchoolClassForm from "../../components/headteacher/SelectSchoolClassForm";
import Modal from "../../layout/Modal";

import classes from './HeadTeacherClass.module.css';

function HeadTeacherClass() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classesData, setClassesData] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedClassData, setSelectedClassData] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectSchoolClassFormVisible, setSelectSchoolClassFormVisible] = useState(false);
    const [addSchoolClassFormVisible, setAddSchoolClassFormVisible] = useState(false);
    const [deleteSchoolClassFormVisible, setDeleteSchoolClassFormVisible] = useState(false);
    const [cantDeleteSchoolClassError, setCantDeleteSchoolClassError] = useState(null);

    const notFormTeachers = useMemo(() => {
        return teachers.filter(teacher => !classesData.some(classData => classData.formTeacher.teacherId === teacher.teacherId));
    }, [classesData, teachers]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const classesData = await getClassesDataForHeadTeacher(accessToken);
                const teachers = await getAllTeachers(accessToken);
                setClassesData(classesData);
                setTeachers(teachers);
                console.log(`teacher class data: ${JSON.stringify(classesData)}`);
            }
            catch(er) {
                console.log(`teacher class error: ${er}`);
            }
        }
        fetchData();
    }, [accessToken, setClassesData]);

    const showSelectSchoolClassFormHandler = (e) => {
        e.preventDefault();

        setSelectSchoolClassFormVisible(true);
        setModalVisible(true);
    }

    const showAddSchoolClassFormHandler = (e) => {
        e.preventDefault();

        setAddSchoolClassFormVisible(true);
        setModalVisible(true);
    }

    const showDeleteSchoolClassFormHandler = (e) => {
        e.preventDefault();

        setDeleteSchoolClassFormVisible(true);
        setModalVisible(true);
    }

    const hideModalHandler = (e) => {
        e.preventDefault();

        setModalVisible(false);
        setSelectSchoolClassFormVisible(false);
        setAddSchoolClassFormVisible(false);
        setDeleteSchoolClassFormVisible(false);
    }

    const submitSelectSchoolClassFormHandler = (selectedSchoolClassId) => {
        const selectedClassData = classesData.find(schoolClass => schoolClass.schoolClassId === selectedSchoolClassId);
        setSelectedClassData(selectedClassData);
    }

    const submitAddSchoolClassFormHandler = async (schoolClassName, formTeacherId, classGroupNumber) => {
        console.log(schoolClassName, formTeacherId, classGroupNumber);
        try {
            await addSchoolClass(accessToken, schoolClassName, formTeacherId, classGroupNumber);
            const newClassesData = await getClassesDataForHeadTeacher(accessToken);
            setClassesData(newClassesData);
        } catch(er) {
            console.log(er);
        }
    }

    const submitDeleteSchoolClassFormHandler = async (schoolClassId) => {
        console.log(schoolClassId);
        const classToDeleteData = classesData.find(classData => classData.schoolClassId === schoolClassId);
        const studentNumber = classToDeleteData.classStudents.length;
        const classGroupsNumber = Object.keys(classToDeleteData.groupStudents).length;
        if(studentNumber === 0 && classGroupsNumber === 0) {
            setCantDeleteSchoolClassError(null);
            try {
                await deleteSchoolClass(accessToken, schoolClassId);
                const newClassesData = await getClassesDataForHeadTeacher(accessToken);
                setClassesData(newClassesData);
            } catch(er) {
                console.log(er);
            }
        }
        else {
            setCantDeleteSchoolClassError(`У класі є ${studentNumber} учнів та ${classGroupsNumber} груп, не можна видалити клас`);
            return;
        }
    }

    return (
        <div className={classes['page-container']}>
            <h2>Інформація про клас</h2>
            <button onClick={showSelectSchoolClassFormHandler}>Обрати клас</button>
            <button onClick={showAddSchoolClassFormHandler}>Додати клас</button>
            <button onClick={showDeleteSchoolClassFormHandler}>Видалити клас</button>
            {modalVisible &&
                <Modal onClose={hideModalHandler}>
                    {selectSchoolClassFormVisible &&
                        <SelectSchoolClassForm schoolClasses={classesData}
                                               onSelectSchoolClass={submitSelectSchoolClassFormHandler}/>
                    }
                    {addSchoolClassFormVisible &&
                     <AddSchoolClassForm teachers={notFormTeachers}
                                         onAddSchoolClass={submitAddSchoolClassFormHandler}/>
                    }
                    {deleteSchoolClassFormVisible &&
                        <DeleteSchoolClassForm schoolClasses={classesData}
                                               onSelectSchoolClass={submitDeleteSchoolClassFormHandler}
                                               cantDeleteSchoolClassError={cantDeleteSchoolClassError}/>
                    }
                </Modal>
            }
            {selectedClassData &&
                <FullClassData classData={selectedClassData} />
            }
        </div>
    );
};

export default HeadTeacherClass;