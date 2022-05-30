import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getMarksForStudent } from "../../api/student";
import SelectSubjectAndGroupForm from "../../components/student/SelectSubjectAndGroupForm";
import StudentDateMarksTable from "../../components/table/StudentDateMarksTable";
import StudentTopicMarksTable from "../../components/table/StudentTopicMarksTable";
import Modal from "../../layout/Modal";

import classes from './StudentMarks.module.css';

function StudentMarks() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [subjectsMarks, setSubjectsMarks] = useState([]);
    const [selectedSubjectMarks, setSelectedSubjectMarks] = useState(null);

    const [selectSubjectAndGroupFormVisible, setSelectSubjectAndGroupFormVisible] = useState(false);

    const subjects = useMemo(() => {
        return subjectsMarks.filter((subjectMarks, index, arr) => index === arr.findIndex(subjectMarksToDelete => subjectMarks.subjectId === subjectMarksToDelete.subjectId))
                            .map(subjectMarks => {
                                    return {
                                        subjectId: subjectMarks.subjectId,
                                        subjectName: subjectMarks.subjectName,
                                    }
                                });
    }, [subjectsMarks]);

    const subjectsGroups = useMemo(() => {
        return subjectsMarks.map(subjectMarks => {
            return {
                subjectId: subjectMarks.subjectId,
                subjectName: subjectMarks.subjectName,
                classGroupNumber: subjectMarks.classGroupNumber
            }
        })
    }, [subjectsMarks]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const subjectsMarks = await getMarksForStudent(accessToken);
                setSubjectsMarks(subjectsMarks);
                console.log(JSON.stringify(subjectsMarks));
            }
            catch(er) {
                console.log(er);
            }
        }
        fetchData();
    }, [accessToken, setSubjectsMarks]);

    const showSelectSubjectAndGroupFormHandler = (e) => {
        e.preventDefault();

        setSelectSubjectAndGroupFormVisible(true);
    }

    const hideModalHandler = (e) => {
        e.preventDefault();

        setSelectSubjectAndGroupFormVisible(false);
    }

    const submitSelectSubjectAndGroupFormHandler = (subjectId, classGroupNumber) => {
        console.log(subjectId, classGroupNumber);
        const selectedSubjectMarks = subjectsMarks.find(subjectMarks => subjectMarks.subjectId === subjectId 
                                                                        && subjectMarks.classGroupNumber === classGroupNumber);
        setSelectedSubjectMarks(selectedSubjectMarks);
    }

    return (
        <div className={classes['page-container']}>
            <h2>Оцінки</h2>
            {selectSubjectAndGroupFormVisible &&
                <Modal onClose={hideModalHandler}>
                    <SelectSubjectAndGroupForm subjects={subjects}
                                               subjectsGroups={subjectsGroups}
                                               onSelectSubjectAndGroup={submitSelectSubjectAndGroupFormHandler}/>
                </Modal>
            }
            <button onClick={showSelectSubjectAndGroupFormHandler}>Обрати предмет</button>
            {selectedSubjectMarks &&
                <React.Fragment>
                    <h3>Поточні оцінки</h3>
                    <StudentDateMarksTable dateMarkRecords={selectedSubjectMarks.dateMarkRecords} />

                    <h3>Тематичні оцінки</h3>
                    <StudentTopicMarksTable topicMarkRecords={selectedSubjectMarks.topicMarkRecords} />
                </React.Fragment>
            }
        </div>
    );
}

export default StudentMarks;