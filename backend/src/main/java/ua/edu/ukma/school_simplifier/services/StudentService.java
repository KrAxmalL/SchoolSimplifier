package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;

import java.util.List;

public interface StudentService {

    List<StudentScheduleRecordDTO> getScheduleForStudent(String studentEmail);
}
