package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.MarkBookNamedTopic;

import java.math.BigInteger;

public interface MarkBookNamedTopicRepository extends JpaRepository<MarkBookNamedTopic, BigInteger> {
}