package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.ClassGroup;

public interface ClassGroupRepository extends JpaRepository<ClassGroup, Long> {
}