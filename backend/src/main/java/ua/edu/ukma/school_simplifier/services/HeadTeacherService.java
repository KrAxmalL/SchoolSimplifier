package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;

import java.util.List;

public interface HeadTeacherService {

    List<TeacherSchoolClassDTO> getAllClassesInfo();
}
