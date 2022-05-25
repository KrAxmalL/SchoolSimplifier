import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getClassGroupsAndSubjects, getMarksForStudentOfClass } from "../../api/teacher";
import Modal from '../../layout/Modal';
import classes from './FormTeacherClassMarkBook.module.css';
import ContentTable from "../../components/table/ContentTable";
import ClassMarkBookSettingsForm from "../../components/formteacher/ClassMarkBookSettingsForm";

const markBookFields = ['ПІБ учня', 'Оцінки'];

function FormTeacherClassMarkBook() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [classGroupsSubjects, setClassGroupsSubjects] = useState([]);
    const [studentsMarks, setStudentsMarks] = useState([]);
    const [displayMarks, setDisplayMarks] = useState([]);
    const [markBookSettingFormVisible, setMarkBookSettingFormVisible] = useState(false);

    const studentsToDisplay = useMemo(() => {
        return studentsMarks.map(studentMarks => {
            return {
                studentInitials: `${studentMarks.student.studentLastName} ${studentMarks.student.studentFirstName} ${studentMarks.student.studentPatronymic}`,
                marks: studentMarks.studentMarks.map(mark => {
                    return !mark.studentPresent
                        ? 'Учень відсутній'
                        : 'Учень присутній' +
                            (mark.mark == null
                                ? ''
                                : `, ${mark.mark} ${mark.description == null ? '' : `(${mark.description})`}`)
                })
            }
        })
    }, [studentsMarks]);

    const subjects = useMemo(() => {
        return classGroupsSubjects.map(classGroupSubjects => classGroupSubjects.subjects)
                                  .reduce((prev, curr) => [...prev, ...curr], [])
                                  .filter((subject, index, arr) => arr.findIndex(subj => subj.subjectId === subject.subjectId) === index);
    }, [classGroupsSubjects]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const classGroupsSubjects = await getClassGroupsAndSubjects(accessToken);
                setClassGroupsSubjects(classGroupsSubjects);
                console.log(JSON.stringify(classGroupsSubjects));
            }
            catch(er) {
                console.log(er);
            }
        }
        fetchData();
    }, [accessToken, setClassGroupsSubjects]);

    const showMarkBookSettingFormHandler = (e) => {
        e.preventDefault();
        setMarkBookSettingFormVisible(true);
    }

    const hideMarkBookSettingFormHandler = (e) => {
        e.preventDefault();
        setMarkBookSettingFormVisible(false);
    }

    const setSettingsHandler = async (subjectId, classGroupId, markBookDate) => {
        console.log(subjectId, classGroupId, markBookDate);

        try {
            const studentsMarks = await getMarksForStudentOfClass(accessToken, classGroupId, subjectId, markBookDate);
            setStudentsMarks(studentsMarks);
            console.log(JSON.stringify(studentsMarks));
        }
        catch(er) {
            console.log(er);
        }
    }

    return (
        <div className={classes['page-container']}>
            <h2>Журнал оцінок</h2>
            <button onClick={showMarkBookSettingFormHandler}>Налаштування журналу</button>
            {markBookSettingFormVisible &&
                <Modal onClose={hideMarkBookSettingFormHandler}>
                    <ClassMarkBookSettingsForm subjects={subjects}
                                               classGroups={classGroupsSubjects}
                                               onSetSettings={setSettingsHandler} />
                </Modal>
            }
            <ContentTable columns={markBookFields} data={studentsToDisplay}/>
        </div>
    );
}

export default FormTeacherClassMarkBook;