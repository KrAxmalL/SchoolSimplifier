package ua.edu.ukma.school_simplifier.domain.dto.mappers;

import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.StudentInitials;
import ua.edu.ukma.school_simplifier.domain.models.Student;

public class StudentMapper {

    public static StudentInitials toStudentInitals(Student student) {
        StudentInitials studentInitials = new StudentInitials();
        studentInitials.setStudentLastName(student.getLastName());
        studentInitials.setStudentFirstName(student.getFirstName());
        studentInitials.setStudentPatronymic(student.getPatronymic());
        return studentInitials;
    }
}
