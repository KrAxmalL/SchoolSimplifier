package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.classgroup.AddClassGroupDTO;

import java.math.BigInteger;

public interface ClassGroupService {

    void addClassGroup(AddClassGroupDTO addClassGroupDTO);

    void deleteClassGroup(Integer classGroupNumber, BigInteger schoolClassId);
}
