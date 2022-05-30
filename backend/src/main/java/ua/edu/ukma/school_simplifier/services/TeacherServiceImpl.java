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
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.SchoolClassSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.TeacherSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.dto.teacher.TeacherSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.models.*;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.repositories.*;

import java.math.BigInteger;
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
                studentRepository.findStudentsOfTeacherOnSubject(teacherOpt.get().getTeacherId(), subjectOpt.get().getSubjectId());
        final BigInteger searchedStudentId = studentOpt.get().getStudentId();
        final Optional<Student> foundStudent =
                studentsOfTeacherOnSubject.stream()
                                          .filter(student -> student.getStudentId().compareTo(searchedStudentId) == 0)
                                          .findFirst();
        if(foundStudent.isEmpty()) {
            throw new InvalidParameterException("Provided teacher doesn't teach provided subject to provided student");
        }

//        final MarkBookRecord markBookRecord = new MarkBookRecord();
//        markBookRecord.setRecordDate(addMarkRecordDTO.getRecordDate());
//        markBookRecord.setStudentPresent(addMarkRecordDTO.isStudentPresent());
//        markBookRecord.setMark(addMarkRecordDTO.getMark());
//        markBookRecord.setDescription(addMarkRecordDTO.getDescription());
//        markBookRecord.setStudent(studentOpt.get());
//        markBookRecord.setSubject(subjectOpt.get());
//        markBookRepository.save(markBookRecord);
    }

    @Override
    public void deleteMark(BigInteger markRecordId) {
        if(!markBookRepository.existsById(markRecordId)) {
            throw new InvalidParameterException("Mark book record with provided id doesn't exist");
        }
        markBookRepository.deleteById(markRecordId);
    }
}
