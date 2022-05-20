package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.Student;
import ua.edu.ukma.school_simplifier.domain.models.Teacher;

import java.math.BigInteger;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, BigInteger> {

    @Query(value = "from Teacher t where t.teacherId = (select p.id from Principal p where p.email = :target_email)")
    Optional<Teacher> findTeacherByEmail(@Param("target_email") String teacherEmail);
}