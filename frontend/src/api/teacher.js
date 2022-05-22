import { DOMAIN_URL } from "../config/config";

const TEACHERS_URL = DOMAIN_URL + '/teachers';

export async function getScheduleForTeacher(accessToken) {
    const response = await fetch(TEACHERS_URL + '/schedule', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teacher's schedule fetching failed");
    }
}

export async function getSubjectsForTeacher(accessToken) {
    const response = await fetch(TEACHERS_URL + '/subjects', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teacher's subjects fetching failed");
    }
}

export async function getClassDataForTeacher(accessToken) {
    const response = await fetch(TEACHERS_URL + '/class', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teacher's class data fetching failed");
    }
}

export async function getMarksForStudentOfClass(accessToken) {
    const response = await fetch(TEACHERS_URL + '/class/markBook', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teacher's class mark book data fetching failed");
    }
}

export async function getSubjectsOfClass(accessToken) {
    const response = await fetch(TEACHERS_URL + '/class/subjects', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teacher's class mark book data fetching failed");
    }
}