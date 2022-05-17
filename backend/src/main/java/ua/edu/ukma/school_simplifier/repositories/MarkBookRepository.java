package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.MarkBookRecord;

public interface MarkBookRepository extends JpaRepository<MarkBookRecord, Long> {
}