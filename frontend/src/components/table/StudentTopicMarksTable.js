import { useMemo } from "react";
import ContentTable from "./ContentTable";

const topicMarkDisplayFields  = ['Тема', 'Оцінка'];

const StudentTopicMarksTable = (props) => {
    const topicMarkRecords = props.topicMarkRecords;

    const markToDisplay = useMemo(() => {
        if(topicMarkRecords) {
            return topicMarkRecords.map(topicMarkRecord => {
                return {
                    topicName: topicMarkRecord.topicName,
                    mark: topicMarkRecord.mark
                }
            });
        }
        else {
            return [];
        }
    }, [topicMarkRecords]);

    const content = markToDisplay.length === 0
                        ? <p>Немає оцінок для показу</p>
                        : <ContentTable columns={topicMarkDisplayFields} data={markToDisplay}/>

    return content;
}

export default StudentTopicMarksTable;