package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.DateMarkRecord;

import java.math.BigInteger;
import java.util.List;

public interface DateMarkRecordRepository extends JpaRepository<DateMarkRecord, BigInteger> {

    @Query(value = "from DateMarkRecord dmr where dmr.student.studentId = :target_student_id")
    List<DateMarkRecord> findDateMarkRecordsForStudent(@Param("target_student_id") BigInteger studentId);
}