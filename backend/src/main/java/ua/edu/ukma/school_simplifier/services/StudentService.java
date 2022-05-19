package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.StudentSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.StudentSubjectDTO;

import java.util.List;

public interface StudentService {

    List<StudentScheduleRecordDTO> getScheduleForStudent(String studentEmail);

    List<StudentSubjectDTO> getSubjectsForStudent(String studentEmail);

    StudentSchoolClassDTO getClassInfoForStudent(String studentEmail);
}
