package ua.edu.ukma.school_simplifier.domain.dto.subject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ClassSubjectDTO {

    private BigInteger subjectId;
    private String subjectName;
    private Integer classGroupNumber;
    private String teacherLastName;
    private String teacherFirstName;
    private String teacherPatronymic;
}
