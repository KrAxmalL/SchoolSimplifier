package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.DateMarkRecord;
import ua.edu.ukma.school_simplifier.domain.models.TopicMarkRecord;

import java.math.BigInteger;
import java.util.List;

public interface TopicMarkRecordRepository extends JpaRepository<TopicMarkRecord, BigInteger> {

    @Query(value = "from TopicMarkRecord tmr where tmr.student.studentId = :target_student_id")
    List<TopicMarkRecord> findTopicMarkRecordsForStudent(@Param("target_student_id") BigInteger studentId);
}