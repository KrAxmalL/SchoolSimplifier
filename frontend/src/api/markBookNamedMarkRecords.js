import { DOMAIN_URL } from "../domain/constants";

const MARK_BOOK_NAMED_MARK_RECORDS = DOMAIN_URL + '/namedMarkRecords';

export async function addMarkBookNamedRecord(accessToken, studentId, markBookNamedTopicId, mark) {
    const response = await fetch(MARK_BOOK_NAMED_MARK_RECORDS, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            studentId,
            markBookNamedTopicId,
            mark
        })
    });
    if(!response.ok) {
        throw new Error("Mark book named mark record adding failed");
    }
}

export async function deleteMarkBookNamedTopicRecord(accessToken, markBookNamedTopicRecordId) {
    const response = await fetch(MARK_BOOK_NAMED_MARK_RECORDS + `/${markBookNamedTopicRecordId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    });
    if(!response.ok) {
        throw new Error("Mark book named mark record deletion failed");
    }
}
