package ua.edu.ukma.school_simplifier.domain.dto.mark;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AddMarkBookDateMarkRecordDTO {

    private BigInteger studentId;
    private BigInteger markBookDateTopicId;

    private Boolean studentPresent;
    private Integer mark;
}
