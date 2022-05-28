import { DOMAIN_URL } from "../config/config";

const SCHOOL_CLASSES_URL = DOMAIN_URL + '/schoolClasses'

export async function addSchoolClass(accessToken, schoolClassName, formTeacherId, classGroupNumber) {
    const response = await fetch(SCHOOL_CLASSES_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            schoolClassName,
            formTeacherId,
            classGroupNumber
        })
    });
    if(!response.ok) {
        throw new Error("School class adding failed");
    }
}

export async function deleteSchoolClass(accessToken, schoolClassId) {
    const response = await fetch(SCHOOL_CLASSES_URL + `/${schoolClassId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    });
    if(!response.ok) {
        throw new Error("School class deletion failed");
    }
}