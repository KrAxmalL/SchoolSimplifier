package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.SchoolClass;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

public interface SchoolClassRepository extends JpaRepository<SchoolClass, BigInteger> {

    @Query(value = "select s.schoolClass from Student s where s.studentId = :target_student_id")
    Optional<SchoolClass> findClassOfStudent(@Param("target_student_id") BigInteger studentId);

    @Query(value = "from SchoolClass sc where sc.schoolClassName = :target_school_class_name")
    Optional<SchoolClass> findClassByName(@Param("target_school_class_name") String schoolClassName);

    @Query(value = "select distinct sr.schoolClass from ScheduleRecord sr where sr.teacher.teacherId = :target_teacher_id")
    List<SchoolClass> findClassesOfTeacher(@Param("target_teacher_id") BigInteger teacherId);
}