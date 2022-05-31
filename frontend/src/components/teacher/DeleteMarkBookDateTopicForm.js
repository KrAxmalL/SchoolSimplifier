import { useRef, useState } from "react";

import classes from './DeleteMarkBookDateTopicForm.module.css';

function DeleteMarkBookDateTopicForm(props) {
    const topics = props.topics;

    const selectTopicRef = useRef();
    const [topicError, setTopicError] = useState(false);
    const cantDeleteMarkBookDateTopicError = props.cantDeleteMarkBookDateTopicError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedTopic = selectTopicRef.current.value;
        const validTopic = !!selectedTopic;
        setTopicError(!validTopic);

        if(validTopic) {
            props.onDeleteMarkBookDateTopic(Number.parseInt(selectedTopic));
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть дату:</label>
            <select ref={selectTopicRef} required>
                {topics.map(topic =>
                                <option key={topic.markBookDateTopicId}
                                        value={topic.markBookDateTopicId}>
                                            {topic.topicDate}
                                </option>)
                }
            </select>
            {topicError && <p className={classes.error}>Дата має бути обрана</p>}

            <input type="submit" value="Видалити дату" />
            {cantDeleteMarkBookDateTopicError && <p className={classes.error}>{cantDeleteMarkBookDateTopicError}</p>}
        </form>
    );
}

export default DeleteMarkBookDateTopicForm;