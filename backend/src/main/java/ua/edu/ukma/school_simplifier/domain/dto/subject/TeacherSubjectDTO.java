package ua.edu.ukma.school_simplifier.domain.dto.subject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TeacherSubjectDTO {

    private String subjectName;
    private String className;
    private Integer classGroupNumber;
}
