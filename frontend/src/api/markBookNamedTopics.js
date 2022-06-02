import { DOMAIN_URL } from "../domain/constants";

const MARK_BOOK_NAMED_TOPICS_URL = DOMAIN_URL + '/namedTopics';

export async function addMarkBookNamedTopic(accessToken, topicName, markBookId) {
    const response = await fetch(MARK_BOOK_NAMED_TOPICS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            topicName,
            markBookId
        })
    });
    if(!response.ok) {
        throw new Error("Mark book named topic adding failed");
    }
}

export async function deleteMarkBookNamedTopic(accessToken, namedTopicId) {
    const response = await fetch(MARK_BOOK_NAMED_TOPICS_URL + `/${namedTopicId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    });
    if(!response.ok) {
        throw new Error("Mark book named topic deletion failed");
    }
}