import { DOMAIN_URL } from "../domain/constants";

const MARK_BOOK_DATE_MARK_RECORDS = DOMAIN_URL + '/dateMarkRecords';

export async function addMarkBookDateRecord(accessToken, studentId, markBookDateTopicId, studentPresent, mark) {
    const response = await fetch(MARK_BOOK_DATE_MARK_RECORDS, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            studentId,
            markBookDateTopicId,
            studentPresent,
            mark
        })
    });
    if(!response.ok) {
        throw new Error("Mark book date mark record adding failed");
    }
}

export async function deleteMarkBookDateTopicRecord(accessToken, markBookDateTopicRecordId) {
    const response = await fetch(MARK_BOOK_DATE_MARK_RECORDS + `/${markBookDateTopicRecordId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    });
    if(!response.ok) {
        throw new Error("Mark book date mark record deletion failed");
    }
}
