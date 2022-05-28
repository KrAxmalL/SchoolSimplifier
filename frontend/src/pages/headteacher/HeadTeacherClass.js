import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { addClassGroup, deleteClassGroup } from "../../api/classGroups";
import { getClassesDataForHeadTeacher } from "../../api/headteacher";
import { addSchoolClass, deleteSchoolClass } from "../../api/schoolClasses";
import { getAllTeachers } from "../../api/teacher";
import FullClassData from "../../components/formteacher/FullClassData";
import AddClassGroupForm from "../../components/headteacher/AddClassGroupForm";
import AddSchoolClassForm from "../../components/headteacher/AddSchoolClassForm";
import DeleteClassGroupForm from "../../components/headteacher/DeleteClassGroupForm";
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
    const [addClassGroupFormVisible, setAddClassGroupFormVisible] = useState(false);
    const [deleteClassGroupFormVisible, setDeleteClassGroupFormVisible] = useState(false);
    const [cantDeleteSchoolClassError, setCantDeleteSchoolClassError] = useState(null);
    const [cantAddClassGroupError, setCantAddClassGroupError] = useState(null);
    const [cantDeleteClassGroupError, setCantDeleteClassGroupError] = useState(null);

    const classGroups = useMemo(() => {
        if(selectedClassData) {
            return Object.keys(selectedClassData.groupStudents).map(groupNumber => {
                return {classGroupNumber: groupNumber}
            });
        }
        else {
            return [];
        }
    }, [selectedClassData]);

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

    const showAddClassGroupFormHandler = (e) => {
        e.preventDefault();

        setAddClassGroupFormVisible(true);
        setModalVisible(true);
    }

    const showDeleteClassGroupFormHandler = (e) => {
        e.preventDefault();

        setDeleteClassGroupFormVisible(true);
        setModalVisible(true);
    }

    const hideModalHandler = (e) => {
        e.preventDefault();

        setModalVisible(false);
        setSelectSchoolClassFormVisible(false);
        setAddSchoolClassFormVisible(false);
        setDeleteSchoolClassFormVisible(false);
        setAddClassGroupFormVisible(false);
        setDeleteClassGroupFormVisible(false);
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
                setSelectedClassData(prevClassData => {
                    return newClassesData.find(schoolClass => schoolClass.schoolClassId === prevClassData.schoolClassId);
                });
            } catch(er) {
                console.log(er);
            }
        }
        else {
            setCantDeleteSchoolClassError(`У класі є ${studentNumber} учнів та ${classGroupsNumber} груп, не можна видалити клас`);
            return;
        }
    }

    const submitAddClassGroupFormHandler = async (classGroupNumber) => {
        const groupWithSuchNumberExists = Object.keys(selectedClassData.groupStudents)
                                                .some(groupNumber => Number.parseInt(groupNumber) === classGroupNumber);
        if(!groupWithSuchNumberExists) {
            setCantAddClassGroupError(null);
            try {
                await addClassGroup(accessToken, classGroupNumber, selectedClassData.schoolClassId);
                const newClassesData = await getClassesDataForHeadTeacher(accessToken);
                setClassesData(newClassesData);
                setSelectedClassData(prevClassData => {
                    return newClassesData.find(schoolClass => schoolClass.schoolClassId === prevClassData.schoolClassId);
                });
            } catch(er) {
                console.log(er);
            }
        }
        else {
            setCantAddClassGroupError('У класі вже є група із таким номером');
            return;
        }
    }

    const submitDeleteClassGroupFormHandler = async (classGroupNumber) => {
        const groupStudents = selectedClassData.groupStudents[`${classGroupNumber}`];
        if(groupStudents.length === 0) {
            setCantDeleteClassGroupError(null);
            try {
                await deleteClassGroup(accessToken, classGroupNumber, selectedClassData.schoolClassId);
                const newClassesData = await getClassesDataForHeadTeacher(accessToken);
                setClassesData(newClassesData);
                setSelectedClassData(prevClassData => {
                    return newClassesData.find(schoolClass => schoolClass.schoolClassId === prevClassData.schoolClassId);
                });
            } catch(er) {
                console.log(er);
            }
        }
        else {
            setCantDeleteClassGroupError(`У групі є ${groupStudents.length} учнів, не можна видалити`);
            return;
        }
    }

    return (
        <div className={classes['page-container']}>
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
                    {addClassGroupFormVisible &&
                        <AddClassGroupForm onAddClassGroup={submitAddClassGroupFormHandler}
                                          cantAddClassGroupError={cantAddClassGroupError}/>
                    }
                    {deleteClassGroupFormVisible &&
                        <DeleteClassGroupForm classGroups={classGroups}
                                              onDeleteClassGroup={submitDeleteClassGroupFormHandler}
                                              cantDeleteClassGroupError={cantDeleteClassGroupError}/>
                    }
                </Modal>
            }
            <h2>Інформація про клас</h2>
            <button onClick={showSelectSchoolClassFormHandler}>Обрати клас</button>
            <button onClick={showAddSchoolClassFormHandler}>Додати клас</button>
            <button onClick={showDeleteSchoolClassFormHandler}>Видалити клас</button>
            {selectedClassData &&
                <React.Fragment>
                    <button onClick={showAddClassGroupFormHandler}>Додати групу для класу</button>
                    <button onClick={showDeleteClassGroupFormHandler}>Видалити групу для класу</button>
                    <FullClassData classData={selectedClassData} />
                </React.Fragment>
            }
        </div>
    );
};

export default HeadTeacherClass;