import { DOMAIN_URL } from "../domain/constants";

const TEACHERS_URL = DOMAIN_URL + '/teachers';

export async function getAllTeachers(accessToken) {
    const response = await fetch(TEACHERS_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teachers fetching failed");
    }
}

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

export async function getClassesWithSubjectsForTeacher(accessToken) {
    const response = await fetch(TEACHERS_URL + '/classes', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teacher's classes and subjects data fetching failed");
    }
}

export async function getStudentsOfClass(accessToken, schoolClassId) {
    const response = await fetch(TEACHERS_URL + `/students?schoolClassId=${schoolClassId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Class students fetching failed");
    }
}