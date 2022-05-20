package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.Student;
import ua.edu.ukma.school_simplifier.domain.models.Teacher;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, BigInteger> {

    @Query(value = "from Teacher t where t.teacherId = (select p.id from Principal p where p.email = :target_email)")
    Optional<Teacher> findTeacherByEmail(@Param("target_email") String teacherEmail);

    @Query(value = "SELECT DISTINCT subject.subject_name, school_class.school_class_name, " +
                                    "class_group.class_group_number " +
            "FROM schedule INNER JOIN subject ON schedule.subject_id = subject.subject_id " +
            "INNER JOIN school_class ON schedule.school_class_id = school_class.school_class_id " +
            "LEFT OUTER JOIN class_group ON schedule.class_group_id = class_group.class_group_id " +
            "WHERE schedule.teacher_id = :target_teacher_id",
            nativeQuery = true)
    List<Object[]> findSubjectsForTeacher(@Param("target_teacher_id") BigInteger teacherId);
}