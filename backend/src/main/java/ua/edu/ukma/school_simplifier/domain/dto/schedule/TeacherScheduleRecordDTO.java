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
public class TeacherScheduleRecordDTO {

    private BigInteger scheduleRecordId;

    private String day;
    private String subjectName;
    private Integer lessonNumber;
    private String lessonStartTime;
    private String lessonFinishTime;
    private String className;
    private Integer groupNumber;
}
