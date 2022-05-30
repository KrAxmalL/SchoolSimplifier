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
public class StudentDateMarkRecordSummaryDTO {

    private BigInteger dateMarkRecordId;
    private LocalDate recordDate;
    private Boolean studentPresent;
    private Integer mark;
}
