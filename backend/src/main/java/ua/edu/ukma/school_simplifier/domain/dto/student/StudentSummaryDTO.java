package ua.edu.ukma.school_simplifier.domain.dto.student;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudentSummaryDTO {

    private BigInteger studentId;
    private String firstName;
    private String lastName;
    private String patronymic;
}
