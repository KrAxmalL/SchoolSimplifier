package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.TopicMarkRecord;

import java.math.BigInteger;

public interface TopicMarkRecordRepository extends JpaRepository<TopicMarkRecord, BigInteger> {
}