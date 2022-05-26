package ua.edu.ukma.school_simplifier.domain.dto.mappers;

import ua.edu.ukma.school_simplifier.domain.dto.student.StudentSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.models.Student;

public class StudentMapper {

    public static StudentSummaryDTO toStudentSummary(Student student) {
        StudentSummaryDTO studentSummaryDTO = new StudentSummaryDTO();
        studentSummaryDTO.setStudentId(student.getStudentId());
        studentSummaryDTO.setLastName(student.getLastName());
        studentSummaryDTO.setFirstName(student.getFirstName());
        studentSummaryDTO.setPatronymic(student.getPatronymic());
        return studentSummaryDTO;
    }
}
