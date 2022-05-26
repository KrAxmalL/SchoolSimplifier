package ua.edu.ukma.school_simplifier.domain.dto.schoolclass;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ua.edu.ukma.school_simplifier.domain.dto.student.StudentSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.dto.teacher.TeacherSummaryDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudentSchoolClassDTO {

    private String schoolClassName;

    private TeacherSummaryDTO formTeacher;

    private List<StudentSummaryDTO> classStudents;
    private Map<Integer, List<StudentSummaryDTO>> groupStudents;
}
