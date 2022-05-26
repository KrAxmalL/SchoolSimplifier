import { DOMAIN_URL } from "../config/config";

const SCHEDULE_URL = DOMAIN_URL + '/schedule';

export async function addScheduleRecord(accessToken, day, lessonId, subjectId, teacherId, schoolClassId, classGroupNumber) {
    const response = await fetch(SCHEDULE_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            day,
            lessonId,
            subjectId,
            teacherId,
            schoolClassId,
            classGroupNumber
        })
    });
    if(!response.ok) {
        throw new Error("Schedule record adding failed");
    }
}