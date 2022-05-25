package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.ClassGroup;
import ua.edu.ukma.school_simplifier.domain.models.SchoolClass;
import ua.edu.ukma.school_simplifier.domain.models.Student;
import ua.edu.ukma.school_simplifier.domain.models.Teacher;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, BigInteger> {

    @Query(value = "from Student s where s.studentId = (select p.id from Principal p where p.email = :target_email)")
    Optional<Student> findStudentByEmail(@Param("target_email") String studentEmail);

    @Query(value = "select sc.schoolClass.students from ScheduleRecord sc " +
            "where sc.teacher.teacherId = :target_teacher_id " +
            "and sc.subject.subjectId = :target_subject_id")
    List<Student> findStudentsOfTeacherOnSubject(@Param("target_teacher_id") BigInteger teacherId,
                                                 @Param("target_subject_id") BigInteger subjectId);
}