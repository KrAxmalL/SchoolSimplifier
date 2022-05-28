package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.MarkRecordMapper;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.StudentMapper;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.TeacherMapper;
import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentSubjectMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.StudentSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.student.StudentSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.dto.student.UpdateStudentClassAndGroupDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.ClassSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.models.*;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.repositories.ScheduleRepository;
import ua.edu.ukma.school_simplifier.repositories.SchoolClassRepository;
import ua.edu.ukma.school_simplifier.repositories.StudentRepository;
import ua.edu.ukma.school_simplifier.repositories.SubjectRepository;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ScheduleRepository scheduleRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolClassRepository schoolClassRepository;

    private final SubjectService subjectService;

    @Override
    public List<StudentScheduleRecordDTO> getScheduleForStudent(String studentEmail) {
        final Optional<Student> studentOpt = studentRepository.findStudentByEmail(studentEmail);
        if(studentOpt.isEmpty()) {
            throw new InvalidParameterException("Student with provided email doesn't exist");
        }

        List<Object[]> scheduleRecords = scheduleRepository.findScheduleRecordsForStudent(studentOpt.get().getStudentId());
        return scheduleRecords.stream().map(studentObj -> {
            StudentScheduleRecordDTO resDTO = new StudentScheduleRecordDTO();
            resDTO.setScheduleRecordId((BigInteger) studentObj[0]);
            resDTO.setDay(studentObj[1].toString());
            resDTO.setSubjectName(studentObj[2].toString());
            resDTO.setLessonNumber((Integer) studentObj[3]);
            resDTO.setLessonStartTime(studentObj[4].toString());
            resDTO.setLessonFinishTime(studentObj[5].toString());
            resDTO.setTeacherLastName(studentObj[6].toString());
            resDTO.setTeacherFirstName(studentObj[7].toString());
            resDTO.setTeacherPatronymic(studentObj[8].toString());
            return resDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ClassSubjectDTO> getSubjectsForStudent(String studentEmail) {
        final Optional<Student> studentOpt = studentRepository.findStudentByEmail(studentEmail);
        if(studentOpt.isEmpty()) {
            throw new InvalidParameterException("Student with provided email doesn't exist");
        }

        return subjectService.getSubjectsOfClassByClassGroups(studentOpt.get().getSchoolClass().getSchoolClassId());
    }

    @Override
    public StudentSchoolClassDTO getClassInfoForStudent(String studentEmail) {
        final Optional<Student> studentOpt = studentRepository.findStudentByEmail(studentEmail);
        if(studentOpt.isEmpty()) {
            throw new InvalidParameterException("Student with provided email doesn't exist");
        }

        final BigInteger studentId = studentOpt.get().getStudentId();
        Optional<SchoolClass> schoolClassOpt = schoolClassRepository.findClassOfStudent(studentId);
        if(schoolClassOpt.isEmpty()) {
            throw new InvalidParameterException("Student doesn't belong to any class");
        }

        final SchoolClass schoolClass = schoolClassOpt.get();
        final Teacher formTeacher = schoolClass.getFormTeacher();
        final List<Student> classmates = schoolClass.getStudents();
        final List<ClassGroup> classGroups = schoolClass.getClassGroups();

        final StudentSchoolClassDTO resDTO = new StudentSchoolClassDTO();
        resDTO.setSchoolClassName(schoolClass.getSchoolClassName());
        resDTO.setFormTeacher(TeacherMapper.toTeacherSummary(formTeacher));
        resDTO.setClassStudents(classmates.stream().map(StudentMapper::toStudentSummary).toList());
        final Map<Integer, List<StudentSummaryDTO>> groupStudents = new HashMap<>();
        for(ClassGroup classGroup: classGroups) {
            List<StudentSummaryDTO> classGroupStudents = classGroup.getStudents()
                    .stream().map(StudentMapper::toStudentSummary).toList();
            groupStudents.put(classGroup.getClassGroupNumber(), classGroupStudents);
        }
        resDTO.setGroupStudents(groupStudents);

        return resDTO;
    }

    @Override
    public List<StudentSubjectMarksDTO> getMarksForStudent(String studentEmail) {
        final Optional<Student> studentOpt = studentRepository.findStudentByEmail(studentEmail);
        if(studentOpt.isEmpty()) {
            throw new InvalidParameterException("Student with provided email doesn't exist");
        }

        Student student = studentOpt.get();
        List<MarkBookRecord> allStudentMarks = student.getMarkBookRecords();
        List<StudentSubjectMarksDTO> marksBySubjects = new ArrayList<>();
        allStudentMarks.stream()
                .map(MarkBookRecord::getSubject)
                .distinct()
                .forEach(subject -> {
                    StudentSubjectMarksDTO resDTO = new StudentSubjectMarksDTO();
                    resDTO.setSubjectName(subject.getSubjectName());
                    resDTO.setMarks(allStudentMarks.stream()
                            .filter(mark -> mark.isStudentPresent() && mark.getMark() != null &&
                                            mark.getSubject().getSubjectId().compareTo(subject.getSubjectId()) == 0)
                            .map(MarkRecordMapper::toMarkSummary)
                            .collect(Collectors.toList()));
                    marksBySubjects.add(resDTO);
                    }
                );
        return marksBySubjects;
    }

    @Override
    public void updateClassAndGroupForStudent(UpdateStudentClassAndGroupDTO updateStudentClassAndGroupDTO) {
        final BigInteger studentId = updateStudentClassAndGroupDTO.getStudentId();
        if(studentId == null) {
            throw new InvalidParameterException("Student id can't be null");
        }
        final Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new InvalidParameterException("Student with provided id doesn't exist"));

        final BigInteger schoolClassId = updateStudentClassAndGroupDTO.getSchoolClassId();
        if(schoolClassId == null) {
            throw new InvalidParameterException("School class id can't be null");
        }
        final SchoolClass schoolClass = schoolClassRepository.findById(schoolClassId)
                .orElseThrow(() -> new InvalidParameterException("Class with provided id doesn't exist"));

        final Integer classGroupNumber = updateStudentClassAndGroupDTO.getClassGroupNumber();
        final ClassGroup newClassGroup  = schoolClass.getClassGroups().stream()
                                      .filter(classGroup -> classGroup.getClassGroupNumber().equals(classGroupNumber))
                                      .findAny()
                                      .orElse(null);
        if(newClassGroup == null && classGroupNumber != null) {
            throw new InvalidParameterException("School class doesn't have group with provided number");
        }

        student.setSchoolClass(schoolClass);
        student.setClassGroup(newClassGroup);
        studentRepository.save(student);
    }
}
