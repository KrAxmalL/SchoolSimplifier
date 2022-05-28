package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.StudentMapper;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.AddSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.ClassScheduleRecord;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.student.StudentSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.ClassSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.models.ClassGroup;
import ua.edu.ukma.school_simplifier.domain.models.SchoolClass;
import ua.edu.ukma.school_simplifier.domain.models.Teacher;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.repositories.ClassGroupRepository;
import ua.edu.ukma.school_simplifier.repositories.ScheduleRepository;
import ua.edu.ukma.school_simplifier.repositories.SchoolClassRepository;
import ua.edu.ukma.school_simplifier.repositories.TeacherRepository;

import java.math.BigInteger;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class SchoolClassServiceImpl implements SchoolClassService{

    private final SchoolClassRepository schoolClassRepository;
    private final ClassGroupRepository classGroupRepository;
    private final TeacherRepository teacherRepository;
    private final ScheduleRepository scheduleRepository;
    private final SubjectService subjectService;

    private static final String SCHOOL_CLASS_NAME_REGEXP = "^\\d\\d?-[а-яА-Я]$";

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

        final List<ClassSubjectDTO> classSubjects = subjectService.getSubjectsOfClassByClassGroups(schoolClass.getSchoolClassId());
        resTeacherSchoolClassDTO.setClassSubjects(classSubjects);

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

    @Override
    public void addSchoolClass(AddSchoolClassDTO addSchoolClassDTO) {
        final String schoolClassName = validateSchoolClassName(addSchoolClassDTO.getSchoolClassName());
        if(schoolClassRepository.findClassByName(schoolClassName).isPresent()) {
            throw new InvalidParameterException("School class with provided name already exists");
        }

        final Teacher newFormTeacher = teacherRepository.findById(addSchoolClassDTO.getFormTeacherId())
                .orElseThrow(() -> new InvalidParameterException("Teacher with provided id doesn't exist"));
        if(newFormTeacher.getSchoolClass() != null) {
            throw new InvalidParameterException("Provided teacher is already a form teacher of other class");
        }

        final Integer classGroupNumber = addSchoolClassDTO.getClassGroupNumber();
        if(classGroupNumber == null) {
            throw new InvalidParameterException("Class group number can't be null");
        }
        if(classGroupNumber < 0) {
            throw new InvalidParameterException("Class group number must be equal or greater than 0");
        }

        SchoolClass schoolClassToAdd = new SchoolClass();
        schoolClassToAdd.setSchoolClassName(schoolClassName);
        schoolClassToAdd.setFormTeacher(newFormTeacher);
        schoolClassToAdd = schoolClassRepository.save(schoolClassToAdd);

        for(int groupNum = 1; groupNum <= classGroupNumber; ++groupNum) {
            final ClassGroup classGroup = new ClassGroup();
            classGroup.setSchoolClass(schoolClassToAdd);
            classGroup.setClassGroupNumber(groupNum);
            classGroupRepository.save(classGroup);
        }
    }

    private String validateSchoolClassName(String schoolClassName) {
        if(schoolClassName == null) {
            throw new InvalidParameterException("School class name can't be null");
        }

        final String schoolClassNameRes = schoolClassName.trim();
        if(schoolClassNameRes.isBlank()) {
            throw new InvalidParameterException("School class name can't be empty");
        }

        if(!schoolClassNameRes.matches(SCHOOL_CLASS_NAME_REGEXP)) {
            throw new InvalidParameterException("Invalid school class name format");
        }

        return schoolClassNameRes;
    }
}
