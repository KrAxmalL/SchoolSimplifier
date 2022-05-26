import { useRef, useState } from "react";

import classes from './DeleteScheduleRecordForm.module.css';

function DeleteScheduleRecordForm(props) {
    const scheduleRecords = props.scheduleRecords;

    const selectScheduleRecordRef = useRef();
    const [scheduleRecordError, setScheduleRecordError] = useState(false);

    const submitFormHandler = (e) => {
        e.preventDefault();

        console.log("selected schedule record id: " + selectScheduleRecordRef.current.value);

        const selectedScheduleRecord = selectScheduleRecordRef.current.value;
        const validScheduleRecord = !!selectedScheduleRecord;
        setScheduleRecordError(!validScheduleRecord);

        if(validScheduleRecord) {
            props.onDeleteScheduleRecord(Number.parseInt(selectedScheduleRecord));
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть запис:</label>
            <select ref={selectScheduleRecordRef} required>
                {scheduleRecords.map(scheduleRecord =>
                    <option key={scheduleRecord.scheduleRecordId}
                            value={scheduleRecord.scheduleRecordId}>
                            {`${scheduleRecord.day}, ${scheduleRecord.lessonNumber}, ${scheduleRecord.lessonStartTime} - ${scheduleRecord.lessonFinishTime}, 
                              ${scheduleRecord.subjectName}, ${scheduleRecord.groupNumber !== null
                                                                    ? `${scheduleRecord.groupNumber} група`
                                                                    : 'Весь клас'}, 
                              ${scheduleRecord.teacherLastName} ${scheduleRecord.teacherFirstName} ${scheduleRecord.teacherPatronymic}`
                            }
                    </option>)
                }
            </select>
            {scheduleRecordError && <p className={classes.error}>Клас має бути обраний</p>}

            <input type="submit" value="Видалити запис" />
        </form>
    );
}

export default DeleteScheduleRecordForm;