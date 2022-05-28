import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getClassDataForTeacher } from "../../api/formteacher";
import FullClassData from "../../components/formteacher/FullClassData";

import classes from './FormTeacherClass.module.css';

function FormTeacherClass() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const classData = await getClassDataForTeacher(accessToken);
                setClassData(classData);
                console.log(`teacher class data: ${JSON.stringify(classData)}`);
            }
            catch(er) {
                console.log(`teacher class error: ${er}`);
            }
        }
        fetchData();
    }, [accessToken, setClassData]);

    return (
        <div className={classes['page-container']}>
            <h2>Мій клас</h2>
            {classData &&
                <FullClassData classData={classData} />
            }
        </div>
    );
}

export default FormTeacherClass;