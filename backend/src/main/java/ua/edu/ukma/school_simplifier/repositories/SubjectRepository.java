package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.Subject;

import java.math.BigInteger;

public interface SubjectRepository extends JpaRepository<Subject, BigInteger> {
}