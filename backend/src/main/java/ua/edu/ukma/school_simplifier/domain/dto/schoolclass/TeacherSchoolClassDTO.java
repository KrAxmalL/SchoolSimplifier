package ua.edu.ukma.school_simplifier.domain.dto.schoolclass;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TeacherSchoolClassDTO {

    private BigInteger schoolClassId;
    private String schoolClassName;

    private List<StudentInitials> classStudents;
    private Map<Integer, List<StudentInitials>> groupStudents;
    private List<ClassScheduleRecord> classScheduleRecords;
}
