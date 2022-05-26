package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.StudentMapper;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.ClassScheduleRecord;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.student.StudentSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.models.ClassGroup;
import ua.edu.ukma.school_simplifier.domain.models.SchoolClass;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.repositories.ScheduleRepository;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class SchoolClassServiceImpl implements SchoolClassService{

    private final ScheduleRepository scheduleRepository;

    @Override
    public TeacherSchoolClassDTO getClassInfo(SchoolClass schoolClass) {
        if(schoolClass == null) {
            throw new InvalidParameterException("Provided class can't be null");
        }

        TeacherSchoolClassDTO resTeacherSchoolClassDTO = new TeacherSchoolClassDTO();
        resTeacherSchoolClassDTO.setSchoolClassId(schoolClass.getSchoolClassId());
        resTeacherSchoolClassDTO.setSchoolClassName(schoolClass.getSchoolClassName());
        resTeacherSchoolClassDTO.setClassStudents(schoolClass.getStudents().stream()
                .map(StudentMapper::toStudentSummary)
                .collect(Collectors.toList())
        );
        final List<ClassGroup> classGroups = schoolClass.getClassGroups();
        final Map<Integer, List<StudentSummaryDTO>> groupStudents = new HashMap<>();
        for(ClassGroup classGroup: classGroups) {
            List<StudentSummaryDTO> classGroupStudents = classGroup.getStudents()
                    .stream().map(StudentMapper::toStudentSummary).toList();
            groupStudents.put(classGroup.getClassGroupNumber(), classGroupStudents);
        }
        resTeacherSchoolClassDTO.setGroupStudents(groupStudents);

        List<Object[]> schoolClassScheduleRecords = scheduleRepository.findScheduleRecordsForClass(schoolClass.getSchoolClassId());
        List<ClassScheduleRecord> classScheduleRecords = schoolClassScheduleRecords.stream().map(scheduleRecordObj -> {
            ClassScheduleRecord resDTO = new ClassScheduleRecord();
            resDTO.setScheduleRecordId((BigInteger) scheduleRecordObj[0]);
            resDTO.setDay(scheduleRecordObj[1].toString());
            resDTO.setSubjectName(scheduleRecordObj[2].toString());
            resDTO.setLessonNumber((Integer) scheduleRecordObj[3]);
            resDTO.setLessonStartTime(scheduleRecordObj[4].toString());
            resDTO.setLessonFinishTime(scheduleRecordObj[5].toString());
            resDTO.setGroupNumber(scheduleRecordObj[6] == null
                    ? null
                    : (Integer) scheduleRecordObj[6]
            );
            resDTO.setTeacherLastName(scheduleRecordObj[7].toString());
            resDTO.setTeacherFirstName(scheduleRecordObj[8].toString());
            resDTO.setTeacherPatronymic(scheduleRecordObj[9].toString());
            return resDTO;
        }).collect(Collectors.toList());
        resTeacherSchoolClassDTO.setClassScheduleRecords(classScheduleRecords);
        return resTeacherSchoolClassDTO;
    }
}
