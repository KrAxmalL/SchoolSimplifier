package ua.edu.ukma.school_simplifier.domain.dto.mappers;

import ua.edu.ukma.school_simplifier.domain.dto.teacher.TeacherSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.models.Teacher;

public class TeacherMapper {

    public static TeacherSummaryDTO toTeacherSummary(Teacher teacher) {
        TeacherSummaryDTO teacherSummaryDTO = new TeacherSummaryDTO();
        teacherSummaryDTO.setTeacherId(teacher.getTeacherId());
        teacherSummaryDTO.setFirstName(teacher.getFirstName());
        teacherSummaryDTO.setLastName(teacher.getLastName());
        teacherSummaryDTO.setPatronymic(teacher.getPatronymic());
        return teacherSummaryDTO;
    }
}
