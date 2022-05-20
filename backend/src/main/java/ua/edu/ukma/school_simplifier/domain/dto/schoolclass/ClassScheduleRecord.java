package ua.edu.ukma.school_simplifier.domain.dto.schoolclass;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ClassScheduleRecord {

    private BigInteger scheduleRecordId;

    private String day;
    private String subjectName;
    private Integer lessonNumber;
    private String lessonStartTime;
    private String lessonFinishTime;
    private Integer groupNumber;
    private String teacherLastName;
    private String teacherFirstName;
    private String teacherPatronymic;
}
