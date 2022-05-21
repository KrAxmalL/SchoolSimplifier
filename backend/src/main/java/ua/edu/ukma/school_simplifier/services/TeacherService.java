package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.TeacherScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.TeacherSubjectDTO;

import java.util.List;
import java.util.Optional;

public interface TeacherService {

    List<TeacherScheduleRecordDTO> getScheduleForTeacher(String teacherEmail);

    List<TeacherSubjectDTO> getSubjectsForTeacher(String teacherEmail);

    TeacherSchoolClassDTO getClassInfoForTeacher(String teacherEmail);

    List<StudentMarksDTO> getMarksForStudentsOfClass(String teacherEmail);

    List<String> getSubjectsOfClass(String teacherEmail);
}
