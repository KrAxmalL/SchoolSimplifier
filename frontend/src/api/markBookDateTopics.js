import { DOMAIN_URL } from "../config/config";

const MARK_BOOK_DATE_TOPICS_URL = DOMAIN_URL + '/dateTopics';

export async function addMarkBookDateTopic(accessToken, topicDate, markBookId) {
    const response = await fetch(MARK_BOOK_DATE_TOPICS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            topicDate,
            markBookId
        })
    });
    if(!response.ok) {
        throw new Error("Mark book date topic adding failed");
    }
}

export async function deleteMarkBookDateTopic(accessToken, dateTopicId) {
    const response = await fetch(MARK_BOOK_DATE_TOPICS_URL + `/${dateTopicId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    });
    if(!response.ok) {
        throw new Error("Mark book date topic deletion failed");
    }
}