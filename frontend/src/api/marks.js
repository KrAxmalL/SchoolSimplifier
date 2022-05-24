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