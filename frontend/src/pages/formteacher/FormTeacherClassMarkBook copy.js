import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMarksForStudentOfClass, getSubjectsOfClass } from "../../api/teacher";
import Modal from '../../layout/Modal';
import classes from './FormTeacherClassMarkBook.module.css';
import { dateIsLessEqualThan } from "../../utils/validation";
import ContentTable from "../../components/table/ContentTable";
import ClassMarkBookSettingsForm from "../../components/formteacher/ClassMarkBookSettingsForm";

function FormTeacherClassMarkBook() {
    const accessToken = useSelector(state => state.auth.accessToken);
    const [studentsMarks, setStudentsMarks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [displayDates, setDisplayDates] = useState([]);
    const [displayMarks, setDisplayMarks] = useState([]);
    const [markBookSettingFormVisible, setMarkBookSettingFormVisible] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const studentsMarks = await getMarksForStudentOfClass(accessToken);
                const subjects = await getSubjectsOfClass(accessToken);
                setStudentsMarks(studentsMarks);
                setSubjects(subjects);
                console.log(JSON.stringify(studentsMarks));
            }
            catch(er) {
                console.log(er);
            }
        }
        fetchData();
    }, [accessToken, setStudentsMarks]);

    const showMarkBookSettingFormHandler = (e) => {
        e.preventDefault();
        setMarkBookSettingFormVisible(true);
    }

    const hideMarkBookSettingFormHandler = (e) => {
        e.preventDefault();
        setMarkBookSettingFormVisible(false);
    }

    const setSettingsHandler = (subjectName, startDate, finishDate) => {
        console.log(subjectName, startDate, finishDate);

        const resultMarkBook = studentsMarks.map(studentMarksObj => {
            return {
                student: studentMarksObj.student,
                studentMarks: studentMarksObj.studentMarks.filter(markRecord => {
                    return dateIsLessEqualThan(new Date(startDate), new Date(markRecord.recordDate))
                        && dateIsLessEqualThan(new Date(markRecord.recordDate), new Date(finishDate))
                        && (markRecord.subjectName.localeCompare(subjectName) === 0);
                })
            }
        });

        const displayDatesArr = [''];
        const displayMarksArr = resultMarkBook.map(studentMarksObj => [studentMarksObj.student]);
        console.log(displayMarksArr);
        for(let currDate = new Date(startDate); currDate <= new Date(finishDate); currDate.setDate(currDate.getDate() + 1)) {
            displayDatesArr.push(currDate.toLocaleDateString());
            displayMarksArr.forEach(studentMarkArr => {
                const studentMarksObj = resultMarkBook.find(studentMarksObj => studentMarksObj.student === studentMarkArr[0]);
                //const currentDateMarks = studentMarksObj.studentMarks.filter(markRecord => dateIsLessEqualThan(new Date(markRecord.recordDate), new Date(currDate)) /*new Date(markRecord.recordDate).toLocaleDateString().localeCompare(currDate) === 0*/);
                const currentDateMarks = studentMarksObj.studentMarks.filter(markRecord => new Date(markRecord.recordDate).getTime() === new Date(currDate).getTime());
                console.log('current date marks: ' + JSON.stringify(currentDateMarks));
                studentMarkArr.push(currentDateMarks);
            })
        }
        setDisplayDates(displayDatesArr);

        //const displayMarksArr = [];
        resultMarkBook.forEach(studentMarksObj => {
            for(let currDate = new Date(startDate); currDate <= new Date(finishDate); currDate.setDate(currDate.getDate() + 1)) {
                displayDatesArr.push(currDate.toLocaleDateString());
                //const studentMarksArr = studentMarksObj.studentMarks.filter(studentMark => new Date(studentMark.recordDate).localeCompare(startDate));
            }
    })

        console.log(JSON.stringify(resultMarkBook));
    }

    return (
        <div className={classes['page-container']}>
            <h2>Журнал оцінок</h2>
            <button onClick={showMarkBookSettingFormHandler}>Налаштування журналу</button>
            {markBookSettingFormVisible &&
                <Modal onClose={hideMarkBookSettingFormHandler}>
                    <ClassMarkBookSettingsForm subjects={subjects}
                                               onSetSettings={setSettingsHandler} />
                </Modal>
            }
            <ContentTable columns={displayDates} data={[]}/>
        </div>
    );
}

export default FormTeacherClassMarkBook;