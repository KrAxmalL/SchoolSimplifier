import { DOMAIN_URL } from "../config/config";

const MARKS_URL = DOMAIN_URL + '/marks';

export async function getMarksForStudentsOfGroupAndSubjectAndDate(accessToken, schoolClassId, classGroupId, subjectId, markDate) {
    const classGroupStr = classGroupId == null
                            ? ''
                            : `classGroupId=${classGroupId}&`
    const response = await fetch(`${MARKS_URL}?schoolClassId=${schoolClassId}&${classGroupStr}subjectId=${subjectId}&markDate=${markDate}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teacher's student and marks data fetching failed");
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