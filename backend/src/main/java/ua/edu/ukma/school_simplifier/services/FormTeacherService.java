package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.classgroup.ClassGroupSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.TeacherMarkBookDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;

import java.util.List;

public interface FormTeacherService {

    TeacherSchoolClassDTO getClassInfoForTeacher(String teacherEmail);

    List<TeacherMarkBookDTO> getMarkBooksForClass(String teacherEmail);

    List<String> getSubjectsOfClass(String teacherEmail);

    List<ClassGroupSubjectsDTO> getClassGroupsAndSubjectsForTeacher(String teacherEmail);
}
