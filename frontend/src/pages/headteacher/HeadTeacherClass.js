import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassesDataForHeadTeacher } from "../../api/headteacher";
import SelectSchoolClassForm from "../../components/headteacher/SelectSchoolClassForm";
import FormTeacherScheduleTable from "../../components/table/FormTeacherScheduleTable";
import StudentsTable from "../../components/table/StudentsTable";
import Modal from "../../layout/Modal";

import classes from './HeadTeacherClass.module.css';

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
            {selectedClassData &&
                <FormTeacherScheduleTable scheduleRecords={selectedClassData.classScheduleRecords} />
            }
        </div>
    );
};

export default HeadTeacherClass;