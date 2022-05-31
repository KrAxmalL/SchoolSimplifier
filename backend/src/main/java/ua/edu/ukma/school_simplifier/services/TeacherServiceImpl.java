package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.StudentMapper;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.TeacherMapper;
import ua.edu.ukma.school_simplifier.domain.dto.mark.*;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.TeacherScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.SchoolClassStudentsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.SchoolClassSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.student.StudentSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.TeacherSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.dto.teacher.TeacherSummaryDTO;
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
    private final ClassGroupRepository classGroupRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final MarkBookRepository markBookRepository;
    private final MarkBookDateTopicRepository markBookDateTopicRepository;
    private final DateMarkRecordRepository dateMarkRecordRepository;

    private final SchoolClassService schoolClassService;

    @Override
    public List<TeacherSummaryDTO> getAllTeachers() {
        return teacherRepository.findAll().stream()
                                .map(TeacherMapper::toTeacherSummary).toList();
    }

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

        final List<Object[]> subjectRecords = subjectRepository.findSubjectsForTeacher(teacherOpt.get().getTeacherId());
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
    public List<SchoolClassSubjectsDTO> getSchoolClassesAndSubjects(String teacherEmail) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }

        final Teacher teacher = teacherOpt.get();
        final List<SchoolClass> teacherClasses = schoolClassRepository.findClassesOfTeacher(teacher.getTeacherId());
        final List<SchoolClassSubjectsDTO> teacherClassesWithSubjects = new ArrayList<>();
        for(SchoolClass schoolClass: teacherClasses) {
            final List<ClassGroup> teacherClassGroups =
                    classGroupRepository.findGroupsOfTeacherAndClass(teacher.getTeacherId(), schoolClass.getSchoolClassId())
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
                        subjectRepository.findSubjectsOfTeacherAndClassAndGroup(teacher.getTeacherId(),
                                schoolClass.getSchoolClassId(), classGroup == null ? null : classGroup.getClassGroupId());
                schoolClassSubjectsDTO.setSubjects(teacherClassSubjects);
                teacherClassesWithSubjects.add(schoolClassSubjectsDTO);
            }
        }
        return teacherClassesWithSubjects;
    }

    @Override
    public TeacherMarkBookDTO getMarkBookForClassAndGroupAndSubject(BigInteger schoolClassId, BigInteger classGroupId,
                                                                    BigInteger subjectId) {
        final SchoolClass schoolClass = schoolClassRepository.findById(schoolClassId)
                .orElseThrow(() -> new InvalidParameterException("Class with provided id doesn't exist"));
        final MarkBook searchedMarkBook = schoolClass.getMarkBooks()
                .stream()
                .filter(markBook -> {
                    final ClassGroup markBookClassGroup = markBook.getClassGroup();
                    final boolean validClassGroup = (markBookClassGroup == null && classGroupId == null)
                            || (markBookClassGroup != null && markBookClassGroup.getClassGroupId().equals(classGroupId));
                    return validClassGroup
                            && markBook.getSubject().getSubjectId().equals(subjectId);
                })
                .findFirst()
                .orElseThrow(() -> new InvalidParameterException("Searched mark book doesn't exist"));
        final TeacherMarkBookDTO teacherMarkBookDTO = new TeacherMarkBookDTO();
        teacherMarkBookDTO.setMarkBookId(searchedMarkBook.getMarkBookId());
        teacherMarkBookDTO.setTeacherId(searchedMarkBook.getTeacher().getTeacherId());
        teacherMarkBookDTO.setSubjectId(searchedMarkBook.getSubject().getSubjectId());
        teacherMarkBookDTO.setSchoolClassId(searchedMarkBook.getSchoolClass().getSchoolClassId());
        teacherMarkBookDTO.setClassGroupId(searchedMarkBook.getClassGroup() == null
                                                ? null
                                                : searchedMarkBook.getClassGroup().getClassGroupId());
        final List<MarkBookNamedTopicSummaryDTO> markBookNamedTopics =
        searchedMarkBook.getMarkBookNamedTopics()
                .stream()
                .map(namedTopic -> {
                    MarkBookNamedTopicSummaryDTO resDTO = new MarkBookNamedTopicSummaryDTO();
                    resDTO.setMarkBookNamedTopicId(namedTopic.getMarkBookNamedTopicId());
                    resDTO.setTopicName(namedTopic.getTopicName());
                    final List<TeacherTopicMarkRecordSummaryDTO> teacherTopicMarkRecordSummaryDTOS =
                            namedTopic.getTopicMarkRecords()
                                            .stream()
                                            .map(topicMarkRecord -> {
                                                TeacherTopicMarkRecordSummaryDTO markResDTO = new TeacherTopicMarkRecordSummaryDTO();
                                                markResDTO.setTopicMarkRecordId(topicMarkRecord.getTopicMarkRecordId());
                                                markResDTO.setMark(topicMarkRecord.getMark());
                                                markResDTO.setStudent(StudentMapper.toStudentSummary(topicMarkRecord.getStudent()));
                                                return markResDTO;
                                            }).toList();
                    resDTO.setTopicMarks(teacherTopicMarkRecordSummaryDTOS);
                    return resDTO;
                }).toList();
        teacherMarkBookDTO.setMarkBookNamedTopics(markBookNamedTopics);

        final List<MarkBookDateTopicSummaryDTO> markBookDateTopics =
                searchedMarkBook.getMarkBookDateTopics()
                        .stream()
                        .map(dateTopic -> {
                            MarkBookDateTopicSummaryDTO resDTO = new MarkBookDateTopicSummaryDTO();
                            resDTO.setMarkBookDateTopicId(dateTopic.getMarkBookDateTopicId());
                            resDTO.setTopicDate(dateTopic.getTopicDate());
                            final List<TeacherDateMarkRecordSummaryDTO> teacherDateMarkRecordSummaryDTOS =
                                    dateTopic.getDateMarkRecords()
                                            .stream()
                                            .map(dateMarkRecord -> {
                                                TeacherDateMarkRecordSummaryDTO  markResDTO = new TeacherDateMarkRecordSummaryDTO();
                                                markResDTO.setDateMarkRecordId(dateMarkRecord.getDateMarkRecordId());
                                                markResDTO.setStudentPresent(dateMarkRecord.getStudentPresent());
                                                markResDTO.setMark(dateMarkRecord.getMark());
                                                markResDTO.setStudent(StudentMapper.toStudentSummary(dateMarkRecord.getStudent()));
                                                return markResDTO;
                                            }).toList();
                            resDTO.setTopicMarks(teacherDateMarkRecordSummaryDTOS);
                            return resDTO;
                        }).toList();
        teacherMarkBookDTO.setMarkBookDateTopics(markBookDateTopics);
        return teacherMarkBookDTO;
    }

    @Override
    public SchoolClassStudentsDTO getStudentsOfClass(BigInteger schoolClassId) {
        final SchoolClass schoolClass = schoolClassRepository.findById(schoolClassId)
                .orElseThrow(() -> new InvalidParameterException("Class with provided id doesn't exist"));

        final SchoolClassStudentsDTO schoolClassStudentsDTO = new SchoolClassStudentsDTO();
        final TeacherSchoolClassDTO teacherSchoolClassDTO = schoolClassService.getClassInfo(schoolClass);
        schoolClassStudentsDTO.setSchoolClassId(teacherSchoolClassDTO.getSchoolClassId());
        schoolClassStudentsDTO.setSchoolClassName(teacherSchoolClassDTO.getSchoolClassName());
        schoolClassStudentsDTO.setClassStudents(teacherSchoolClassDTO.getClassStudents());
        schoolClassStudentsDTO.setGroupStudents(teacherSchoolClassDTO.getGroupStudents());

        return schoolClassStudentsDTO;
    }

    @Override
    public void addMarkBookDateTopic(AddMarkBookDateTopicDTO addMarkBookDateTopicDTO) {
        final LocalDate topicDate = addMarkBookDateTopicDTO.getTopicDate();
        final BigInteger markBookId = addMarkBookDateTopicDTO.getMarkBookId();
        if(topicDate == null) {
            throw new InvalidParameterException("Topic date must not be null");
        }
        if(markBookId == null) {
            throw new InvalidParameterException("Mark book id must not be null");
        }
        final MarkBook markBook = markBookRepository.findById(markBookId)
                .orElseThrow(() -> new InvalidParameterException("Mark book with provided id must doesn't exist"));
        final boolean topicWithDateExists = markBook.getMarkBookDateTopics()
                .stream()
                .anyMatch(dateTopic -> dateTopic.getTopicDate().compareTo(topicDate) == 0);
        if(topicWithDateExists) {
            throw new InvalidParameterException("Date topic with provided date already exists");
        }

        final MarkBookDateTopic markBookDateTopic = new MarkBookDateTopic();
        markBookDateTopic.setTopicDate(topicDate);
        markBookDateTopic.setMarkBook(markBook);
        markBookDateTopic.setDateMarkRecords(Collections.emptyList());
        markBookDateTopicRepository.save(markBookDateTopic);
    }

    @Override
    public void deleteMarkBookDateTopic(BigInteger markBookDateTopicId) {
        if(markBookDateTopicId == null) {
            throw new InvalidParameterException("Date topic id must not be null");
        }

        final MarkBookDateTopic markBookDateTopic = markBookDateTopicRepository.findById(markBookDateTopicId)
                .orElseThrow(() -> new InvalidParameterException("Date topic with provided id doesn't exist"));
        if(markBookDateTopic.getDateMarkRecords().size() > 0) {
            throw new InvalidParameterException("Can't delete date topic while it has date mark records");
        }

        markBookDateTopicRepository.deleteById(markBookDateTopicId);
    }

    @Override
    public void addMarkBookDateMarkRecord(AddMarkBookDateMarkRecordDTO addMarkBookDateMarkRecordDTO) {
        final BigInteger studentId = addMarkBookDateMarkRecordDTO.getStudentId();
        if(studentId == null) {
            throw new InvalidParameterException("Student id must not be null");
        }
        final Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->  new InvalidParameterException("Student with provided id doesn't exist"));

        final BigInteger markBookDateTopicId = addMarkBookDateMarkRecordDTO.getMarkBookDateTopicId();
        if(markBookDateTopicId == null) {
            throw new InvalidParameterException("Mark book date topic id must not be null");
        }
        final MarkBookDateTopic markBookDateTopic = markBookDateTopicRepository.findById(markBookDateTopicId)
                .orElseThrow(() -> new InvalidParameterException("Mark book date topic with provided id doesn't exist"));

        boolean studentHasMark = markBookDateTopic.getDateMarkRecords()
                .stream()
                .anyMatch(dateMarkRecord -> dateMarkRecord.getStudent().getStudentId().compareTo(studentId) == 0);
        if(studentHasMark) {
            throw new InvalidParameterException("Student already has a mark record in provided mark book date topic");
        }

        final Boolean studentPresent = addMarkBookDateMarkRecordDTO.getStudentPresent();
        final Integer mark = addMarkBookDateMarkRecordDTO.getMark();

        if(studentPresent == null) {
            throw new InvalidParameterException("Student present field must not be null");
        }

        if(!studentPresent && mark != null) {
            throw new InvalidParameterException("Mark field must be null if student present is false");
        }

        if(mark != null && (mark < 1 || mark > 12)) {
            throw new InvalidParameterException("Mark value must be between 1 and 12");
        }

        final DateMarkRecord dateMarkRecord = new DateMarkRecord();
        dateMarkRecord.setStudentPresent(studentPresent);
        dateMarkRecord.setMark(mark);
        dateMarkRecord.setStudent(student);
        dateMarkRecord.setMarkBookDateTopic(markBookDateTopic);
        dateMarkRecordRepository.save(dateMarkRecord);
    }

    @Override
    public void deleteMarkBookDateTopicRecord(BigInteger markBookDateTopicRecordId) {
        if(markBookDateTopicRecordId == null) {
            throw new InvalidParameterException("Date topic mark record id must not be null");
        }
        if(!dateMarkRecordRepository.existsById(markBookDateTopicRecordId)) {
            throw new InvalidParameterException("Date topic mark record with provided id doesn't exist");
        }

        dateMarkRecordRepository.deleteById(markBookDateTopicRecordId);
    }
}
