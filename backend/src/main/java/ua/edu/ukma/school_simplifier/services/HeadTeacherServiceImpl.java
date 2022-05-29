package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.mappers.StudentMapper;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.student.HeadTeacherStudentSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.models.ClassGroup;
import ua.edu.ukma.school_simplifier.domain.models.SchoolClass;
import ua.edu.ukma.school_simplifier.repositories.SchoolClassRepository;
import ua.edu.ukma.school_simplifier.repositories.StudentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class HeadTeacherServiceImpl implements HeadTeacherService {

    private final SchoolClassRepository schoolClassRepository;
    private final SchoolClassService schoolClassService;
    private final StudentRepository studentRepository;

    @Override
    public List<TeacherSchoolClassDTO> getAllClassesInfo() {
        List<SchoolClass> schoolClasses = schoolClassRepository.findAll();
        return schoolClasses.stream().map(schoolClassService::getClassInfo).collect(Collectors.toList());
    }

    @Override
    public List<HeadTeacherStudentSummaryDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(student -> {
                    HeadTeacherStudentSummaryDTO resDTO = new HeadTeacherStudentSummaryDTO();
                    resDTO.setStudent(StudentMapper.toStudentSummary(student));
                    final SchoolClass schoolClass = student.getSchoolClass();
                    resDTO.setSchoolClassId(schoolClass == null ? null : schoolClass.getSchoolClassId());
                    final ClassGroup classGroup = student.getClassGroup();
                    resDTO.setClassGroupNumber(classGroup == null ? null : classGroup.getClassGroupNumber());
                    return resDTO;
                }).collect(Collectors.toList());
    }
}
