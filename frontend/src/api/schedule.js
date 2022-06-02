import { DOMAIN_URL } from "../domain/constants";

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

export async function deleteScheduleRecord(accessToken, scheduleRecordId) {
    const response = await fetch(SCHEDULE_URL + `/${scheduleRecordId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    });
    if(!response.ok) {
        throw new Error("Schedule record deletion failed");
    }
}