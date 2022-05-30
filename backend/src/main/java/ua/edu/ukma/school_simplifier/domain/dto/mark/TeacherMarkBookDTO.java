package ua.edu.ukma.school_simplifier.domain.dto.mark;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TeacherMarkBookDTO {

    private BigInteger markBookId;
    private BigInteger subjectId;
    private BigInteger teacherId;
    private BigInteger schoolClassId;
    private BigInteger classGroupId;

    private List<MarkBookDateTopicSummaryDTO> markBookDateTopics;
    private List<MarkBookNamedTopicSummaryDTO> markBookNamedTopics;
}
