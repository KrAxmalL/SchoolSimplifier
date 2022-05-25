package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.classgroup.ClassGroupSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.AddMarkRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.TeacherMarkSummary;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.TeacherScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.SchoolClassSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.TeacherSubjectDTO;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TeacherService {

    List<TeacherScheduleRecordDTO> getScheduleForTeacher(String teacherEmail);

    List<TeacherSubjectDTO> getSubjectsForTeacher(String teacherEmail);

    List<SchoolClassSubjectsDTO> getSchoolClassesAndSubjects(String teacherEmail);

    List<StudentMarksDTO> getMarksForStudentsOfGroupAndSubjectAndDate(BigInteger schoolClassId, BigInteger classGroupId, BigInteger subjectId, LocalDate markDate);

    void addMarkRecordForStudent(String teacherEmail, AddMarkRecordDTO addMarkRecordDTO);

    void deleteMark(BigInteger markRecordId);
}
