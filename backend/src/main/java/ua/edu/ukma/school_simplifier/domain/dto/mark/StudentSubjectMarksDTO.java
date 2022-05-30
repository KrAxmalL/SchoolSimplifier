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
public class StudentSubjectMarksDTO {

    private BigInteger subjectId;
    private String subjectName;
    private Integer classGroupNumber;
    private List<StudentDateMarkRecordSummaryDTO> dateMarkRecords;
    private List<StudentTopicMarkRecordSummary> topicMarkRecords;
}
