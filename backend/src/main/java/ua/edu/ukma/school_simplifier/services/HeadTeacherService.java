package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.student.HeadTeacherStudentSummaryDTO;

import java.util.List;

public interface HeadTeacherService {

    List<TeacherSchoolClassDTO> getAllClassesInfo();

    List<HeadTeacherStudentSummaryDTO> getAllStudents();
}
