package ua.edu.ukma.school_simplifier.domain.dto.subject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ClassSubjectDTO {

    private String subjectName;
    private Integer classGroupNumber;
    private String teacherLastName;
    private String teacherFirstName;
    private String teacherPatronymic;
}
