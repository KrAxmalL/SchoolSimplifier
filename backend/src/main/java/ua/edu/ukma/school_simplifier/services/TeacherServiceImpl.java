package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.yaml.snakeyaml.error.Mark;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.MarkRecordMapper;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.StudentMapper;
import ua.edu.ukma.school_simplifier.domain.dto.mark.AddMarkRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.TeacherMarkSummary;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.TeacherScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.ClassScheduleRecord;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.SchoolClassSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.StudentInitials;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.TeacherSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.models.*;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.repositories.*;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final MarkBookRepository markBookRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassGroupRepository classGroupRepository;

    @Override
    public List<TeacherScheduleRecordDTO> getScheduleForTeacher(String teacherEmail) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }

       final List<ScheduleRecord> scheduleRecords = teacherOpt.get().getScheduleRecords();
        return scheduleRecords.stream().map(scheduleRecord -> {
            TeacherScheduleRecordDTO resDTO = new TeacherScheduleRecordDTO();
            resDTO.setScheduleRecordId(scheduleRecord.getScheduleRecordId());
            resDTO.setDay(scheduleRecord.getDay());
            resDTO.setSubjectName(scheduleRecord.getSubject().getSubjectName());
            final Lesson scheduleLesson = scheduleRecord.getLesson();
            resDTO.setLessonNumber(scheduleLesson.getLessonNumber());
            resDTO.setLessonStartTime(scheduleLesson.getStartTime());
            resDTO.setLessonFinishTime(scheduleLesson.getFinishTime());
            resDTO.setClassName(scheduleRecord.getSchoolClass().getSchoolClassName());
            final ClassGroup scheduleGroup = scheduleRecord.getClassGroup();
            resDTO.setGroupNumber(scheduleGroup == null ? null : scheduleGroup.getClassGroupNumber());
            return resDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public List<TeacherSubjectDTO> getSubjectsForTeacher(String teacherEmail) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }

        final List<Object[]> subjectRecords = teacherRepository.findSubjectsForTeacher(teacherOpt.get().getTeacherId());
        return subjectRecords.stream().map(subjectObj -> {
            TeacherSubjectDTO resDTO = new TeacherSubjectDTO();
            resDTO.setSubjectName(subjectObj[0].toString());
            resDTO.setClassName(subjectObj[1].toString());
            resDTO.setClassGroupNumber(subjectObj[2] == null
                                            ? null
                                            : (Integer) subjectObj[2]
            );
            return resDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public TeacherSchoolClassDTO getClassInfoForTeacher(String teacherEmail) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }

        final Teacher teacher = teacherOpt.get();
        final SchoolClass teacherClass = teacher.getSchoolClass();
        if(teacherClass == null) {
            throw new InvalidParameterException("Teacher is not a form teacher");
        }

        TeacherSchoolClassDTO resTeacherSchoolClassDTO = new TeacherSchoolClassDTO();
        resTeacherSchoolClassDTO.setSchoolClassName(teacherClass.getSchoolClassName());
        resTeacherSchoolClassDTO.setClassStudents(teacherClass.getStudents().stream()
                                                .map(StudentMapper::toStudentInitals)
                                                .collect(Collectors.toList())
        );
        final List<ClassGroup> classGroups = teacherClass.getClassGroups();
        final Map<Integer, List<StudentInitials>> groupStudents = new HashMap<>();
        for(ClassGroup classGroup: classGroups) {
            List<StudentInitials> classGroupStudents = classGroup.getStudents()
                    .stream().map(StudentMapper::toStudentInitals).toList();
            groupStudents.put(classGroup.getClassGroupNumber(), classGroupStudents);
        }
        resTeacherSchoolClassDTO.setGroupStudents(groupStudents);

        List<Object[]> teacherClassScheduleRecords = teacherRepository.findScheduleRecordsForClass(teacherClass.getSchoolClassId());
        List<ClassScheduleRecord> classScheduleRecords = teacherClassScheduleRecords.stream().map(scheduleRecordObj -> {
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
    public List<StudentMarksDTO> getMarksForStudentsOfClass(String teacherEmail) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }

        final Teacher teacher = teacherOpt.get();
        final SchoolClass teacherClass = teacher.getSchoolClass();
        if(teacherClass == null) {
            throw new InvalidParameterException("Teacher is not a form teacher");
        }

        final List<Student> students = teacherClass.getStudents();
        final List<MarkBookRecord> alLMarks = markBookRepository.findAll();
        return students.stream().map(student -> {
            StudentMarksDTO resDTO = new StudentMarksDTO();
            resDTO.setStudentId(student.getStudentId());
            resDTO.setStudent(StudentMapper.toStudentInitals(student));
            final List<MarkBookRecord> studentMarksRecord =
                    alLMarks.stream()
                            .filter(markRecord -> markRecord.getStudent().getStudentId()
                                    .compareTo(student.getStudentId()) == 0
                            ).toList();
            resDTO.setStudentMarks(studentMarksRecord.stream()
                                                     .map(MarkRecordMapper::toTeacherMarkSummary)
                                                     .collect(Collectors.toList())
            );
            return resDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public List<String> getSubjectsOfClass(String teacherEmail) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }

        final Teacher teacher = teacherOpt.get();
        final SchoolClass teacherClass = teacher.getSchoolClass();
        if(teacherClass == null) {
            throw new InvalidParameterException("Teacher is not a form teacher");
        }

        return teacherRepository.findSubjectsForClass(teacherClass.getSchoolClassId()).stream()
                .map(Subject::getSubjectName).distinct().collect(Collectors.toList());
    }

    @Override
    public List<SchoolClassSubjectsDTO> getSchoolClassesAndSubjects(String teacherEmail) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }

        final Teacher teacher = teacherOpt.get();
        final List<SchoolClass> teacherClasses = teacherRepository.findClassesOfTeacher(teacher.getTeacherId());
        final List<SchoolClassSubjectsDTO> teacherClassesWithSubjects = new ArrayList<>();
        for(SchoolClass schoolClass: teacherClasses) {
            final List<ClassGroup> teacherClassGroups =
                    teacherRepository.findGroupsOfTeacherAndClass(teacher.getTeacherId(), schoolClass.getSchoolClassId())
                            .stream()
                            .map(classGroupId -> classGroupId == null ? null : classGroupRepository.findById(classGroupId).get())
                            .toList();
            log.info("class groups: " + teacherClassGroups.toString());
            for(ClassGroup classGroup: teacherClassGroups) {
                final SchoolClassSubjectsDTO schoolClassSubjectsDTO = new SchoolClassSubjectsDTO();
                schoolClassSubjectsDTO.setSchoolClassId(schoolClass.getSchoolClassId());
                schoolClassSubjectsDTO.setSchoolClassName(schoolClass.getSchoolClassName());
                if(classGroup == null) {
                    schoolClassSubjectsDTO.setClassGroupId(null);
                    schoolClassSubjectsDTO.setClassGroupNumber(null);
                }
                else {
                    schoolClassSubjectsDTO.setClassGroupId(classGroup.getClassGroupId());
                    schoolClassSubjectsDTO.setClassGroupNumber(classGroup.getClassGroupNumber());
                }
                final List<Subject> teacherClassSubjects =
                        teacherRepository.findSubjectsOfTeacherAndClassAndGroup(teacher.getTeacherId(),
                                schoolClass.getSchoolClassId(), classGroup == null ? null : classGroup.getClassGroupId());
                schoolClassSubjectsDTO.setSubjects(teacherClassSubjects);
                teacherClassesWithSubjects.add(schoolClassSubjectsDTO);
            }
        }
        return teacherClassesWithSubjects;
    }

    @Override
    public List<StudentMarksDTO> getMarksForStudentsOfGroupAndSubjectAndDate(BigInteger schoolClassId, BigInteger classGroupId,
                                                                             BigInteger subjectId, LocalDate markDate) {
        final Optional<SchoolClass> schoolClassOpt = schoolClassRepository.findById(schoolClassId);
        if(schoolClassOpt.isEmpty()) {
            throw new InvalidParameterException("Class with provided id doesn't exist");
        }

        final SchoolClass schoolClass = schoolClassOpt.get();
        List<Student> searchedStudents;
        if(classGroupId == null) {
            searchedStudents = schoolClass.getStudents();
        }
        else {
            Optional<ClassGroup> searchedGroupOpt =
                    schoolClass.getClassGroups()
                               .stream()
                               .filter(group -> group.getClassGroupId().compareTo(classGroupId) == 0)
                               .findFirst();
            if(searchedGroupOpt.isEmpty()) {
                throw new InvalidParameterException("Class group with provided id doesn't exist");
            }
            searchedStudents = searchedGroupOpt.get().getStudents();
        }
        final List<StudentMarksDTO> studentsMarks = new ArrayList<>(searchedStudents.size());
        for(Student student: searchedStudents) {
            final StudentMarksDTO studentMarksDTO = new StudentMarksDTO();
            studentMarksDTO.setStudentId(student.getStudentId());
            studentMarksDTO.setStudent(StudentMapper.toStudentInitals(student));
            final List<TeacherMarkSummary> marksOfStudent =
                    teacherRepository.findMarksForStudentOfSubjectAndDate(student.getStudentId(), subjectId, markDate)
                                                                         .stream()
                                                                         .map(MarkRecordMapper::toTeacherMarkSummary)
                                                                         .toList();
            studentMarksDTO.setStudentMarks(marksOfStudent);
            studentsMarks.add(studentMarksDTO);
        }

        return studentsMarks;
    }

    @Override
    public void addMarkRecordForStudent(String teacherEmail, AddMarkRecordDTO addMarkRecordDTO) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }

        if(addMarkRecordDTO.getRecordDate() == null) {
            throw new InvalidParameterException("Record date can't be null");
        }

        if(!addMarkRecordDTO.isStudentPresent() &&
                (addMarkRecordDTO.getMark() != null || addMarkRecordDTO.getDescription() != null)
        ) {
            throw new InvalidParameterException("Can't set mark or description if student is absent");
        }

        if(addMarkRecordDTO.getMark() != null &&
                (addMarkRecordDTO.getMark() < 1 || addMarkRecordDTO.getMark() > 12)
        ) {
            throw new InvalidParameterException("Mark must be a value between 1 and 12");
        }

        if(addMarkRecordDTO.getStudentId() == null) {
            throw new InvalidParameterException("Student id can't be null");
        }
        final Optional<Student> studentOpt = studentRepository.findById(addMarkRecordDTO.getStudentId());
        if(studentOpt.isEmpty()) {
            throw new InvalidParameterException("Student with provided id doesn't exist");
        }

        if(addMarkRecordDTO.getSubjectId() == null) {
            throw new InvalidParameterException("Subject id can't be null");
        }
        final Optional<Subject> subjectOpt = subjectRepository.findById(addMarkRecordDTO.getSubjectId());
        if(subjectOpt.isEmpty()) {
            throw new InvalidParameterException("Subject with provided id doesn't exist");
        }

        final List<Student> studentsOfTeacherOnSubject =
                teacherRepository.findStudentsOfTeacherOnSubject(teacherOpt.get().getTeacherId(), subjectOpt.get().getSubjectId());
        final BigInteger searchedStudentId = studentOpt.get().getStudentId();
        final Optional<Student> foundStudent =
                studentsOfTeacherOnSubject.stream()
                                          .filter(student -> student.getStudentId().compareTo(searchedStudentId) == 0)
                                          .findFirst();
        if(foundStudent.isEmpty()) {
            throw new InvalidParameterException("Provided teacher doesn't teach provided subject to provided student");
        }

        final MarkBookRecord markBookRecord = new MarkBookRecord();
        markBookRecord.setRecordDate(addMarkRecordDTO.getRecordDate());
        markBookRecord.setStudentPresent(addMarkRecordDTO.isStudentPresent());
        markBookRecord.setMark(addMarkRecordDTO.getMark());
        markBookRecord.setDescription(addMarkRecordDTO.getDescription());
        markBookRecord.setStudent(studentOpt.get());
        markBookRecord.setSubject(subjectOpt.get());
        markBookRepository.save(markBookRecord);
    }
}
