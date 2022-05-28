package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentSubjectMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.StudentSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.student.UpdateStudentClassAndGroupDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.ClassSubjectDTO;

import java.util.List;

public interface StudentService {

    List<StudentScheduleRecordDTO> getScheduleForStudent(String studentEmail);

    List<ClassSubjectDTO> getSubjectsForStudent(String studentEmail);

    StudentSchoolClassDTO getClassInfoForStudent(String studentEmail);

    List<StudentSubjectMarksDTO> getMarksForStudent(String studentEmail);

    void updateClassAndGroupForStudent(UpdateStudentClassAndGroupDTO updateStudentClassAndGroupDTO);
}
