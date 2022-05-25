package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.MarkBookRecord;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

public interface MarkBookRepository extends JpaRepository<MarkBookRecord, BigInteger> {

    @Query(value = "from MarkBookRecord m where m.subject.subjectId = :target_subject_id " +
            "and m.recordDate = :target_date and m.student.studentId = :target_student_id")
    List<MarkBookRecord> findMarksForStudentOfSubjectAndDate(@Param("target_student_id") BigInteger studentId,
                                                             @Param("target_subject_id") BigInteger subjectId,
                                                             @Param("target_date") LocalDate markDate);
}