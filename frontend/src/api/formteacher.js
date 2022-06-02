import { DOMAIN_URL } from "../domain/constants";

const FORM_TEACHERS_URL = DOMAIN_URL + '/formteachers';

export async function getClassDataForTeacher(accessToken) {
    const response = await fetch(FORM_TEACHERS_URL + '/class', {
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

export async function getSubjectsOfClass(accessToken) {
    const response = await fetch(FORM_TEACHERS_URL + '/class/subjects', {
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

export async function getClassGroupsAndSubjects(accessToken) {
    const response = await fetch(FORM_TEACHERS_URL + '/class/groupsSubjects', {
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

export async function getMarkBooksForClass(accessToken) {
    const response = await fetch(FORM_TEACHERS_URL + `/class/markBooks`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Teacher's class mark book fetching failed");
    }
}