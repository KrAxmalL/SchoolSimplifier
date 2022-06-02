import { DOMAIN_URL } from "../domain/constants";

const MARKS_URL = DOMAIN_URL + '/markBooks';

export async function getMarkBookForClassAndGroupAndSubject(accessToken, schoolClassId, classGroupId, subjectId) {
    const classGroupStr = classGroupId == null
                            ? ''
                            : `classGroupId=${classGroupId}&`
    const response = await fetch(`${MARKS_URL}?schoolClassId=${schoolClassId}&${classGroupStr}subjectId=${subjectId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teacher's mark book fetching failed");
    }
}

export async function addMarkForStudent(accessToken, studentId, subjectId, markDate, studentPresent, mark, description) {
    const response = await fetch(MARKS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            studentId,
            subjectId,
            recordDate: markDate,
            studentPresent,
            mark,
            description
        })
    });
    if(!response.ok) {
        throw new Error("Mark adding failed");
    }
}

export async function deleteMark(accessToken, markRecordId) {
    const response = await fetch(MARKS_URL + `/${markRecordId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    });
    if(!response.ok) {
        throw new Error("Mark deletion failed");
    }
}