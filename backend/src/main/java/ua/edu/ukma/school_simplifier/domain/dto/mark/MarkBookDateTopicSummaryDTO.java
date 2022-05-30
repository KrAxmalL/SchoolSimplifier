package ua.edu.ukma.school_simplifier.domain.dto.mark;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MarkBookDateTopicSummaryDTO {

    private BigInteger markBookDateTopicId;
    private LocalDate topicDate;
    private List<TeacherDateMarkRecordSummaryDTO> topicMarks;
}
