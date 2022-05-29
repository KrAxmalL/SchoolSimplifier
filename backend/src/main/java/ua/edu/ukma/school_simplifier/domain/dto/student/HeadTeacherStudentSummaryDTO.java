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
public class HeadTeacherStudentSummaryDTO {

    private StudentSummaryDTO student;
    private BigInteger schoolClassId;
    private Integer classGroupNumber;
}
