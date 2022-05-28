package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.AddSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.models.SchoolClass;

import java.math.BigInteger;

public interface SchoolClassService {

    TeacherSchoolClassDTO getClassInfo(SchoolClass schoolClass);

    void addSchoolClass(AddSchoolClassDTO addSchoolClassDTO);
}
