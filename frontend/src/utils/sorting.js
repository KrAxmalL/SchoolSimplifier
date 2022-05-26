
export function sortStudentsByInitials(students) {
    return students.sort((stud1, stud2) => {
        let compareRes = stud1.lastName.localeCompare(stud2.lastName);
        if(compareRes === 0) {
            compareRes = stud1.firstName.localeCompare(stud2.firstName);
            if(compareRes === 0) {
                compareRes = stud1.patronymic.localeCompare(stud2.patronymic);
            }
        }
        return compareRes;
    });
};

export function sortScheduleRecords(scheduleRecords) {
    return scheduleRecords.sort((rec1, rec2) => {
        let compareRes = rec1.lessonNumber - rec2.lessonNumber;
        if(compareRes === 0) {
            compareRes = rec1.groupNumber - rec2.groupNumber;
        }
        return compareRes;
    });
};

export function sortSubjects(subjects) {
    return subjects.sort((subj1, subj2) => {
        let compareRes = subj1.subjectName.localeCompare(subj2.subjectName);
        if(compareRes === 0) {
            compareRes = subj1.groupNumber - subj2.groupNumber;
        }
        return compareRes;
    });
}