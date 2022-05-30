package ua.edu.ukma.school_simplifier.domain.dto.mark;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ua.edu.ukma.school_simplifier.domain.dto.student.StudentSummaryDTO;

import java.math.BigInteger;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TeacherDateMarkRecordSummaryDTO {

    private StudentSummaryDTO student;
    private BigInteger dateMarkRecordId;
    private Boolean studentPresent;
    private Integer mark;
}
