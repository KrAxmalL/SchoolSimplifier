package ua.edu.ukma.school_simplifier.domain.dto.classgroup;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AddClassGroupDTO {

    private Integer classGroupNumber;
    private BigInteger schoolClassId;
}
