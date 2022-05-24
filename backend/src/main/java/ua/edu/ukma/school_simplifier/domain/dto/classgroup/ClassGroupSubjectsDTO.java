package ua.edu.ukma.school_simplifier.domain.dto.classgroup;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ua.edu.ukma.school_simplifier.domain.models.Subject;

import java.math.BigInteger;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ClassGroupSubjectsDTO {

    private BigInteger classGroupId;
    private Integer classGroupNumber;

    private List<Subject> subjects;
}
