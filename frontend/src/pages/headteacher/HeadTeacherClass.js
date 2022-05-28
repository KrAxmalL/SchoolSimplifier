import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getClassesDataForHeadTeacher } from "../../api/headteacher";
import FullClassData from "../../components/formteacher/FullClassData";
import SelectSchoolClassForm from "../../components/headteacher/SelectSchoolClassForm";
import Modal from "../../layout/Modal";

import classes from './HeadTeacherClass.module.css';

function HeadTeacherClass() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classData, setClassData] = useState([]);
    const [selectedClassData, setSelectedClassData] = useState(null);

    const [selectSchoolClassFormVisible, setSelectedSchoolClassFormVisible] = useState(false);

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
                <FullClassData classData={selectedClassData} />
            }
        </div>
    );
};

export default HeadTeacherClass;