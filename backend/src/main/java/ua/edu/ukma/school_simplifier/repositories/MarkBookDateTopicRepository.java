package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.MarkBookDateTopic;

import java.math.BigInteger;

public interface MarkBookDateTopicRepository extends JpaRepository<MarkBookDateTopic, BigInteger> {
}