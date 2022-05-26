import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassesDataForHeadTeacher } from "../../api/headteacher";
import SelectSchoolClassForm from "../../components/headteacher/SelectSchoolClassForm";
import ContentTable from "../../components/table/ContentTable";
import StudentsTable from "../../components/table/StudentsTable";
import { Days } from "../../domain/constants";
import Modal from "../../layout/Modal";

import classes from './HeadTeacherClass.module.css';

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

function HeadTeacherClass() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classData, setClassData] = useState(null);
    const [selectedClassData, setSelectedClassData] = useState(null);

    const [selectSchoolClassFormVisible, setSelectedSchoolClassFormVisible] = useState(false);

    const groupsToDisplay = useMemo(() => {
        if(selectedClassData) {
            return Object.keys(selectedClassData.groupStudents).map(groupNumber => {
                return (
                    <div key={groupNumber}>
                        <p>Учні {groupNumber} групи</p>
                        <StudentsTable students={selectedClassData.groupStudents[groupNumber]} />
                    </div>
                );
            });
        }
    }, [selectedClassData]);

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
    }

    const hideSelectSchoolClassFormHandler = (e) => {
        e.preventDefault();

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
            {selectSchoolClassFormVisible &&
                <Modal onClose={hideSelectSchoolClassFormHandler}>
                    <SelectSchoolClassForm schoolClasses={classData} onSelectSchoolClass={submitSelectSchoolClassFormHandler}/>
                </Modal>
            }
            {selectedClassData &&
                <React.Fragment>
                    <p>{selectedClassData.schoolClassName}</p>
                    <p>Список учнів</p>
                    <StudentsTable students={selectedClassData.classStudents} />
                    {groupsToDisplay}
                    <p>Розклад класу</p>

                </React.Fragment>
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
        </div>
    );
};

export default HeadTeacherClass;