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