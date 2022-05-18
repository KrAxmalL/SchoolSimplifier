package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.Teacher;

import java.math.BigInteger;

public interface TeacherRepository extends JpaRepository<Teacher, BigInteger> {
}