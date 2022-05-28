package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.subject.ClassSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.models.Subject;

import java.math.BigInteger;
import java.util.List;

public interface SubjectService {

    List<Subject> getAllSubjects();

    List<ClassSubjectDTO> getSubjectsOfClassByClassGroups(BigInteger schoolClassId);
}
