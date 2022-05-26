import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassesDataForHeadTeacher } from "../../api/headteacher";
import SelectSchoolClassForm from "../../components/headteacher/SelectSchoolClassForm";
import ContentTable from "../../components/table/ContentTable";
import { Days } from "../../domain/constants";
import Modal from "../../layout/Modal";

import classes from './HeadTeacherSchedule.module.css';

const scheduleDisplayFields = ['Номер уроку', 'Предмет', 'Час', 'Група', 'Вчитель'];

const getScheduleRecordsForDay = (schedule, day) => {
    return schedule.filter(scheduleRecord =>
        scheduleRecord.day.toLowerCase()
                          .localeCompare(day.toLowerCase()) === 0
    );
};

const transformScheduleForDisplaying = (schedule) => {
    return schedule.map(scheduleRecord => {
        return {
            lessonNumber: scheduleRecord.lessonNumber,
            subjectName: scheduleRecord.subjectName,
            lessonTime: `${scheduleRecord.lessonStartTime} - ${scheduleRecord.lessonFinishTime}`,
            groupNumber: scheduleRecord.groupNumber !== null
                            ? scheduleRecord.groupNumber
                            : 'Весь клас',
            teacherInitials: `${scheduleRecord.teacherLastName} ${scheduleRecord.teacherFirstName} ${scheduleRecord.teacherPatronymic}`
        }
    });
};

function HeadTeacherSchedule() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classData, setClassData] = useState(null);
    const [selectedClassData, setSelectedClassData] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectSchoolClassFormVisible, setSelectedSchoolClassFormVisible] = useState(false);

    const scheduleByDays = useMemo(() => {
        if(selectedClassData) {
            return {
                monday: getScheduleRecordsForDay(selectedClassData.classScheduleRecords, Days.MONDAY),
                tuesday: getScheduleRecordsForDay(selectedClassData.classScheduleRecords, Days.TUESDAY),
                wednesday: getScheduleRecordsForDay(selectedClassData.classScheduleRecords, Days.WEDNESDAY),
                thursday: getScheduleRecordsForDay(selectedClassData.classScheduleRecords, Days.THURSDAY),
                friday: getScheduleRecordsForDay(selectedClassData.classScheduleRecords, Days.FRIDAY),
                saturday: getScheduleRecordsForDay(selectedClassData.classScheduleRecords, Days.SATURDAY),
            }
        }
    }, [selectedClassData]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const classData = await getClassesDataForHeadTeacher(accessToken);
                setClassData(classData);
                console.log(`teacher class data: ${JSON.stringify(classData)}`);
            }
            catch(er) {
                console.log(`teacher class error: ${er}`);
            }
        }
        fetchData();
    }, [accessToken, setClassData]);

    const showSelectSchoolClassFormHandler = (e) => {
        e.preventDefault();

        setSelectedSchoolClassFormVisible(true);
        setModalVisible(true);
    }

    const hideModalHandler = (e) => {
        e.preventDefault();

        setModalVisible(false);
        setSelectedSchoolClassFormVisible(false);
    }

    const submitSelectSchoolClassFormHandler = (selectedSchoolClassId) => {
        const selectedClassData = classData.find(schoolClass => schoolClass.schoolClassId === selectedSchoolClassId);
        setSelectedClassData(selectedClassData);
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
            </Modal>
        }

        <h2>Розклад уроків</h2>
        {scheduleByDays &&
            Object.keys(scheduleByDays).map(dayName => {
                return (
                    <div key={dayName}>
                        <h3>{Days[dayName.toUpperCase()]}</h3>
                        {scheduleByDays[dayName].length === 0
                            ? <p>Немає уроків у цей день</p>
                            : <ContentTable columns={scheduleDisplayFields} data={transformScheduleForDisplaying(scheduleByDays[dayName])} />
                        }
                    </div>
                );
            })
        }

        {selectedClassData &&
            <React.Fragment>
                <button>Додати запис у розклад</button>
                <button>Видалити запис із розкладу</button>
            </React.Fragment>
        }
    </div>
    );
};

export default HeadTeacherSchedule;