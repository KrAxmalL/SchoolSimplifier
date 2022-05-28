import { DOMAIN_URL } from "../config/config";

const CLASS_GROUPS_URL = DOMAIN_URL + '/classGroups'

export async function addClassGroup(accessToken, classGroupNumber, schoolClassId) {
    const response = await fetch(CLASS_GROUPS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            classGroupNumber,
            schoolClassId
        })
    });
    if(!response.ok) {
        throw new Error("Class group adding failed");
    }
}

export async function deleteClassGroup(accessToken, classGroupNumber, schoolClassId) {
    const response = await fetch(CLASS_GROUPS_URL + `/${schoolClassId}/${classGroupNumber}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    });
    if(!response.ok) {
        throw new Error("Class group deletion failed");
    }
}