package ua.edu.ukma.school_simplifier.domain.dto.schoolclass;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ua.edu.ukma.school_simplifier.domain.dto.student.StudentSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.ClassSubjectDTO;

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

    private List<StudentSummaryDTO> classStudents;
    private Map<Integer, List<StudentSummaryDTO>> groupStudents;
    private List<ClassSubjectDTO> classSubjects;
    private List<ClassScheduleRecord> classScheduleRecords;
}
