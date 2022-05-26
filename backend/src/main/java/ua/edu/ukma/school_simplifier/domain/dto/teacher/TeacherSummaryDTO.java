package ua.edu.ukma.school_simplifier.domain.dto.teacher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Id;
import java.math.BigInteger;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TeacherSummaryDTO {

    private BigInteger teacherId;
    private String firstName;
    private String lastName;
    private String patronymic;
}
