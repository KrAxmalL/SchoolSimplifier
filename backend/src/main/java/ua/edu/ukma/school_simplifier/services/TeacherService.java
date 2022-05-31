package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.mark.AddMarkBookDateMarkRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.AddMarkBookDateTopicDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.AddMarkBookNamedTopicDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.TeacherMarkBookDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.TeacherScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.SchoolClassStudentsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.SchoolClassSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.TeacherSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.dto.teacher.TeacherSummaryDTO;

import java.math.BigInteger;
import java.util.List;

public interface TeacherService {

    List<TeacherSummaryDTO> getAllTeachers();

    List<TeacherScheduleRecordDTO> getScheduleForTeacher(String teacherEmail);

    List<TeacherSubjectDTO> getSubjectsForTeacher(String teacherEmail);

    List<SchoolClassSubjectsDTO> getSchoolClassesAndSubjects(String teacherEmail);

    TeacherMarkBookDTO getMarkBookForClassAndGroupAndSubject(BigInteger schoolClassId, BigInteger classGroupId, BigInteger subjectId);

    SchoolClassStudentsDTO getStudentsOfClass(BigInteger schoolClassId);

    void addMarkBookDateTopic(AddMarkBookDateTopicDTO addMarkBookDateTopicDTO);

    void deleteMarkBookDateTopic(BigInteger markBookDateTopicId);

    void addMarkBookDateMarkRecord(AddMarkBookDateMarkRecordDTO addMarkBookDateMarkRecordDTO);

    void deleteMarkBookDateTopicRecord(BigInteger markBookDateTopicRecordId);

    void addMarkBookNamedTopic(AddMarkBookNamedTopicDTO addMarkBookNamedTopicDTO);
}
