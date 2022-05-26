package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.classgroup.ClassGroupSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.MarkRecordMapper;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.StudentMapper;
import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
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
public class FormTeacherServiceImpl implements FormTeacherService {

    private final TeacherRepository teacherRepository;
    private final MarkBookRepository markBookRepository;
    private final SubjectRepository subjectRepository;

    private final TeacherService teacherService;
    private final SchoolClassService schoolClassService;

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

        return schoolClassService.getClassInfo(teacherClass);
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
            resDTO.setStudent(StudentMapper.toStudentSummary(student));
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

        return subjectRepository.findSubjectsForClass(teacherClass.getSchoolClassId()).stream()
                .map(Subject::getSubjectName).distinct().collect(Collectors.toList());
    }

    @Override
    public List<ClassGroupSubjectsDTO> getClassGroupsAndSubjectsForTeacher(String teacherEmail) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }
        final SchoolClass teacherClass = teacherOpt.get().getSchoolClass();
        final List<ClassGroup> classGroups = teacherClass.getClassGroups();
        final List<ClassGroupSubjectsDTO> classGroupsSubjects = new ArrayList<>(classGroups.size() + 1);
        for(ClassGroup classGroup: classGroups) {
            ClassGroupSubjectsDTO classGroupSubjectsDTO = new ClassGroupSubjectsDTO();
            classGroupSubjectsDTO.setClassGroupId(classGroup.getClassGroupId());
            classGroupSubjectsDTO.setClassGroupNumber(classGroup.getClassGroupNumber());
            final List<Subject> groupSubjects = subjectRepository.findSubjectsOfClassGroup(classGroup.getClassGroupId());
            classGroupSubjectsDTO.setSubjects(groupSubjects);
            classGroupsSubjects.add(classGroupSubjectsDTO);
        }

        ClassGroupSubjectsDTO classGroupSubjectsDTO = new ClassGroupSubjectsDTO();
        classGroupSubjectsDTO.setClassGroupId(null);
        classGroupSubjectsDTO.setClassGroupNumber(null);
        final List<Subject> groupSubjects = subjectRepository.findSubjectsOfClass(teacherClass.getSchoolClassId());
        classGroupSubjectsDTO.setSubjects(groupSubjects);
        classGroupsSubjects.add(classGroupSubjectsDTO);

        return classGroupsSubjects;
    }

    @Override
    public List<StudentMarksDTO> getMarksForTeacherClassAndGroupAndSubject(String teacherEmail, BigInteger classGroupId, BigInteger subjectId, LocalDate markDate) {
        final Optional<Teacher> teacherOpt = teacherRepository.findTeacherByEmail(teacherEmail);
        if(teacherOpt.isEmpty()) {
            throw new InvalidParameterException("Teacher with provided email doesn't exist");
        }

        final Teacher teacher = teacherOpt.get();
        final SchoolClass teacherClass = teacher.getSchoolClass();
        if(teacherClass == null) {
            throw new InvalidParameterException("Teacher is not a form teacher");
        }

        return teacherService.getMarksForStudentsOfGroupAndSubjectAndDate(teacherClass.getSchoolClassId(), classGroupId, subjectId, markDate);
    }
}
