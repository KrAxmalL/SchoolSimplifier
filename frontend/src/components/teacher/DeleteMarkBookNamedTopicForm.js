import { useRef, useState } from "react";

import classes from './DeleteMarkBookNamedTopicForm.module.css';

function DeleteMarkBookNamedTopicForm(props) {
    const topics = props.topics;

    const selectTopicRef = useRef();
    const [topicError, setTopicError] = useState(false);
    const cantDeleteMarkBookNamedTopicError = props.cantDeleteMarkBookNamedTopicError;

    const submitFormHandler = (e) => {
        e.preventDefault();

        const selectedTopic = selectTopicRef.current.value;
        const validTopic = !!selectedTopic;
        setTopicError(!validTopic);

        if(validTopic) {
            props.onDeleteMarkBookNamedTopic(Number.parseInt(selectedTopic));
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

            <input type="submit" value="Видалити тему" />
            {cantDeleteMarkBookNamedTopicError && <p className={classes.error}>{cantDeleteMarkBookNamedTopicError}</p>}
        </form>
    );
}

export default DeleteMarkBookNamedTopicForm;