import { DOMAIN_URL } from "../config/config";

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
