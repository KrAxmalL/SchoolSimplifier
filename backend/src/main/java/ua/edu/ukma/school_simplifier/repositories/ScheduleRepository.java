package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.ScheduleRecord;

import java.math.BigInteger;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<ScheduleRecord, BigInteger> {

    @Query(value = "SELECT schedule.schedule_record_id, schedule.record_day, subject.subject_name, " +
            "lesson.lesson_number, lesson.start_time, lesson.finish_time, class_group.class_group_number, " +
            "teacher.last_name, teacher.first_name, teacher.patronymic " +
            "FROM schedule INNER JOIN subject ON schedule.subject_id = subject.subject_id " +
            "INNER JOIN lesson ON schedule.lesson_id = lesson.lesson_id " +
            "INNER JOIN teacher ON schedule.teacher_id = teacher.teacher_id " +
            "LEFT OUTER JOIN class_group ON schedule.class_group_id = class_group.class_group_id " +
            "WHERE schedule.school_class_id = :target_school_class_id ",
            nativeQuery = true)
    List<Object[]> findScheduleRecordsForClass(@Param("target_school_class_id") BigInteger schoolClassId);

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
}