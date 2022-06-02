import { DOMAIN_URL } from "../domain/constants";

const SUBJECTS_URL = DOMAIN_URL + '/subjects';

export async function getAllSubjects(accessToken) {
    const response = await fetch(SUBJECTS_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if(response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Subjects fetching failed");
    }
}