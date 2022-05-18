package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.Lesson;

import java.math.BigInteger;

public interface LessonRepository extends JpaRepository<Lesson, BigInteger> {
}