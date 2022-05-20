package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.schedule.TeacherScheduleRecordDTO;

import java.util.List;

public interface TeacherService {

    List<TeacherScheduleRecordDTO> getScheduleForTeacher(String teacherEmail);
}
