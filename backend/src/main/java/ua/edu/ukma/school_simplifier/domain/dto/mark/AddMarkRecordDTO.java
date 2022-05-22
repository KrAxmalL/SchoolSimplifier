package ua.edu.ukma.school_simplifier.domain.dto.mark;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AddMarkRecordDTO {

    private BigInteger studentId;
    private BigInteger subjectId;

    private LocalDate recordDate;
    private boolean studentPresent;
    private Integer mark;
    private String description;
}
