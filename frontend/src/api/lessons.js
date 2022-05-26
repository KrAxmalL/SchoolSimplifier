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