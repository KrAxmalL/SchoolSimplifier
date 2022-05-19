package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.ClassGroup;
import ua.edu.ukma.school_simplifier.domain.models.SchoolClass;
import ua.edu.ukma.school_simplifier.domain.models.Student;
import ua.edu.ukma.school_simplifier.domain.models.Teacher;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query(value = "SELECT schedule.schedule_record_id, schedule.record_day, subject.subject_name, " +
                          "lesson.lesson_number, lesson.start_time, lesson.finish_time, " +
                          "teacher.last_name, teacher.first_name, teacher.patronymic " +
                   "FROM schedule INNER JOIN subject ON schedule.subject_id = subject.subject_id " +
                         "INNER JOIN lesson ON schedule.lesson_id = lesson.lesson_id " +
                         "INNER JOIN teacher ON schedule.teacher_id = teacher.teacher_id " +
                   "WHERE schedule.school_class_id = (SELECT school_class_id FROM student WHERE student_id = :target_student_id) " +
                         "AND " +
                         "(schedule.class_group_id IS NULL OR schedule.class_group_id = (SELECT class_group_id FROM student WHERE student_id = :target_student_id))",
            nativeQuery = true)
    List<Object[]> findScheduleRecordsForStudent(@Param("target_student_id") BigInteger studentId);

    @Query(value = "SELECT DISTINCT subject.subject_name, class_group.class_group_number, " +
                                   "teacher.last_name, teacher.first_name, teacher.patronymic " +
            "FROM schedule INNER JOIN subject ON schedule.subject_id = subject.subject_id " +
            "INNER JOIN teacher ON schedule.teacher_id = teacher.teacher_id " +
            "LEFT OUTER JOIN class_group ON schedule.class_group_id = class_group.class_group_id " +
            "WHERE schedule.school_class_id = (SELECT school_class_id FROM student WHERE student_id = :target_student_id)",
            nativeQuery = true)
    List<Object[]> findSubjectsForStudent(@Param("target_student_id") BigInteger studentId);

    @Query(value = "select s.schoolClass from Student s where s.studentId = :target_student_id")
    Optional<SchoolClass> findClassOfStudent(@Param("target_student_id") BigInteger studentId);

    @Query(value = "from Student s where s.studentId = (select p.id from Principal p where p.email = :target_email)")
    Optional<Student> findStudentByEmail(@Param("target_email") String studentEmail);
}