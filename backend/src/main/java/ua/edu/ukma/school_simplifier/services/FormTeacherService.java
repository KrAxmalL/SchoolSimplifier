package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.classgroup.ClassGroupSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

public interface FormTeacherService {

    TeacherSchoolClassDTO getClassInfoForTeacher(String teacherEmail);

    List<StudentMarksDTO> getMarksForStudentsOfClass(String teacherEmail);

    List<String> getSubjectsOfClass(String teacherEmail);

    List<ClassGroupSubjectsDTO> getClassGroupsAndSubjectsForTeacher(String teacherEmail);

    List<StudentMarksDTO> getMarksForTeacherClassAndGroupAndSubject(String teacherEmail, BigInteger classGroupId, BigInteger subjectId, LocalDate markDate);
}