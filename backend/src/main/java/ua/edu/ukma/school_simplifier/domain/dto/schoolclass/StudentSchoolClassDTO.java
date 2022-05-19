package ua.edu.ukma.school_simplifier.domain.dto.schoolclass;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudentSchoolClassDTO {

    private String schoolClassName;

    private String teacherLastName;
    private String teacherFirstName;
    private String teacherPatronymic;

    private List<StudentInitials> classStudents;

    private Map<Integer, List<StudentInitials>> groupStudents;
}
