package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.classgroup.AddClassGroupDTO;
import ua.edu.ukma.school_simplifier.domain.models.ClassGroup;
import ua.edu.ukma.school_simplifier.domain.models.SchoolClass;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.repositories.ClassGroupRepository;
import ua.edu.ukma.school_simplifier.repositories.SchoolClassRepository;

import java.math.BigInteger;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ClassGroupServiceImpl implements ClassGroupService {

    private final ClassGroupRepository classGroupRepository;
    private final SchoolClassRepository schoolClassRepository;

    @Override
    public void addClassGroup(AddClassGroupDTO addClassGroupDTO) {
        final BigInteger schoolClassId = addClassGroupDTO.getSchoolClassId();
        if(schoolClassId == null) {
            throw new InvalidParameterException("School class id can't be null");
        }

        final SchoolClass schoolClass = schoolClassRepository.findById(schoolClassId)
                .orElseThrow(() -> new InvalidParameterException("School class with provided id doesn't exist"));

        final Integer classGroupNumber = addClassGroupDTO.getClassGroupNumber();
        if(classGroupNumber == null) {
            throw new InvalidParameterException("Class group number can't be null");
        }
        if(classGroupNumber < 1) {
            throw new InvalidParameterException("Class group number must be positive");
        }
        final boolean groupWithNumberExists = schoolClass.getClassGroups().stream()
                .anyMatch(classGroup -> classGroup.getClassGroupNumber().equals(classGroupNumber));
        if(groupWithNumberExists) {
            throw new InvalidParameterException("Class group with provided number already exists");
        }

        final ClassGroup classGroupToAdd = new ClassGroup();
        classGroupToAdd.setClassGroupNumber(classGroupNumber);
        classGroupToAdd.setSchoolClass(schoolClass);
        classGroupRepository.save(classGroupToAdd);
    }
}
