import { DOMAIN_URL } from "../domain/constants";

const HEAD_TEACHERS_URL = DOMAIN_URL + '/headteachers';

export async function getClassesDataForHeadTeacher(accessToken) {
    const response = await fetch(HEAD_TEACHERS_URL + '/classes', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Head teacher's classes data fetching failed");
    }
}

export async function getAllStudentForHeadTeacher(accessToken) {
    const response = await fetch(HEAD_TEACHERS_URL + '/students', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Head teacher's students fetching failed");
    }
}