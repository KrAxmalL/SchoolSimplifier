package ua.edu.ukma.school_simplifier.domain.dto.schedule;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AddScheduleRecordDTO {

    private String day;
    private BigInteger lessonId;
    private BigInteger subjectId;
    private BigInteger teacherId;
    private BigInteger schoolClassId;
    private Integer classGroupNumber;
}
