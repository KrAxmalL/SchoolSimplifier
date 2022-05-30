import { useRef, useState } from "react";

import classes from './SelectMarkBookTopicForm.module.css';

function SelectMarkBookTopicForm(props) {
    const topics = props.topics;

    const selectTopicRef = useRef();
    const [topicError, setTopicError] = useState(false);

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedTopic = selectTopicRef.current.value;
        const validTopic = !!selectedTopic;
        setTopicError(!validTopic);

        if(validTopic) {
            props.onSelectMarkBookTopic(Number.parseInt(selectedTopic));
        }
    }

    return (
        <form className={classes['form-layout']} onSubmit={submitFormHandler}>
            <label>Оберіть тему:</label>
            <select ref={selectTopicRef} required>
                {topics.map(topic =>
                                <option key={topic.markBookNamedTopicId}
                                        value={topic.markBookNamedTopicId}>
                                            {topic.topicName}
                                </option>)
                }
            </select>
            {topicError && <p className={classes.error}>Тема має бути обрана</p>}

            <input type="submit" value="Обрати тему" />
        </form>
    );
}

export default SelectMarkBookTopicForm;