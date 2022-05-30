package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.classgroup.ClassGroupSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.ClassSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.models.Subject;
import ua.edu.ukma.school_simplifier.repositories.SubjectRepository;

import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Override
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Override
    public List<ClassSubjectDTO> getSubjectsOfClassByClassGroups(BigInteger schoolClassId) {
        List<Object[]> subjectRecords = subjectRepository.findSubjectsForClassByGroups(schoolClassId);
        return subjectRecords.stream().map(classSubjectRecord -> {
            ClassSubjectDTO resDTO = new ClassSubjectDTO();
            resDTO.setSubjectId((BigInteger) classSubjectRecord[0]);
            resDTO.setSubjectName(classSubjectRecord[1].toString());
            resDTO.setClassGroupNumber(classSubjectRecord[2] == null
                    ? null
                    : (Integer) classSubjectRecord[2]);
            resDTO.setTeacherLastName(classSubjectRecord[3].toString());
            resDTO.setTeacherFirstName(classSubjectRecord[4].toString());
            resDTO.setTeacherPatronymic(classSubjectRecord[5].toString());
            return resDTO;
        }).collect(Collectors.toList());
    }
}
