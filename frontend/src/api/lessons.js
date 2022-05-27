import { DOMAIN_URL } from "../config/config";

const LESSONS_URL = DOMAIN_URL + '/lessons';

export async function getAllLessons(accessToken) {
    const response = await fetch(LESSONS_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Lessons fetching failed");
    }
}

export async function addLesson(accessToken, lessonNumber, startTime, finishTime) {
    const response = await fetch(LESSONS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            lessonNumber,
            startTime,
            finishTime
        })
    });
    if(!response.ok) {
        throw new Error("Lesson adding failed");
    }
}