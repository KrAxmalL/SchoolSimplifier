import { DOMAIN_URL } from "../config/config";

const STUDENTS_URL = DOMAIN_URL + '/students';

export async function getScheduleForStudent(accessToken) {
    const response = await fetch(STUDENTS_URL + '/schedule', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Student's schedule fetching failed");
    }
}

export async function getSubjectsForStudent(accessToken) {
    const response = await fetch(STUDENTS_URL + '/subjects', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Student's subjects fetching failed");
    }
}

export async function getClassDataForStudent(accessToken) {
    const response = await fetch(STUDENTS_URL + '/class', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Student's class data fetching failed");
    }
}

export async function getMarksForStudent(accessToken) {
    const response = await fetch(STUDENTS_URL + '/marks', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Student's marks fetching failed");
    }
}

export async function updateClassAndGroupForStudent(accessToken, studentId, schoolClassId, classGroupNumber) {
    const response = await fetch(STUDENTS_URL, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            studentId,
            schoolClassId,
            classGroupNumber
        })
    });
    if(!response.ok) {
        throw new Error("Student class and group updating failed");
    }
}