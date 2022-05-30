import { useMemo } from "react";
import ContentTable from "./ContentTable";

const dateMarkDisplayFields  = ['Дата', 'Оцінка'];

const StudentDateMarksTable = (props) => {
    const dateMarkRecords = props.dateMarkRecords;

    const markToDisplay = useMemo(() => {
        if(dateMarkRecords) {
            return dateMarkRecords.map(dateMarkRecord => {
                return {
                    recordDate: dateMarkRecord.recordDate,
                    mark: !dateMarkRecord.studentPresent
                        ? 'Учень відсутній'
                        : dateMarkRecord.mark === null
                            ? 'Учень присутній, немає оцінки'
                            : `Учень присутній, ${dateMarkRecord.mark}`
                }
            });
        }
        else {
            return [];
        }
    }, [dateMarkRecords]);

    const content = markToDisplay.length === 0
                        ? <p>Немає оцінок для показу</p>
                        : <ContentTable columns={dateMarkDisplayFields} data={markToDisplay}/>

    return content;
}

export default StudentDateMarksTable;