package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.MarkBook;

import java.math.BigInteger;

public interface MarkBookRepository extends JpaRepository<MarkBook, BigInteger> {
}