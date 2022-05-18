package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.SchoolClass;

import java.math.BigInteger;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, BigInteger> {
}