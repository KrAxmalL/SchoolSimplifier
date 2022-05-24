package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.*;

import java.math.BigInteger;
import java.time.LocalDate;
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

    @Query(value = "select sr.subject from ScheduleRecord sr " +
                   "where sr.schoolClass.schoolClassId = :target_school_class_id")
    List<Subject> findSubjectsForClass(@Param("target_school_class_id") BigInteger schoolClassId);

    @Query(value = "select sc.schoolClass.students from ScheduleRecord sc " +
                   "where sc.teacher.teacherId = :target_teacher_id " +
                   "and sc.subject.subjectId = :target_subject_id")
    List<Student> findStudentsOfTeacherOnSubject(@Param("target_teacher_id") BigInteger teacherId,
                                                 @Param("target_subject_id") BigInteger subjectId);

    @Query(value = "select distinct sr.schoolClass from ScheduleRecord sr where sr.teacher.teacherId = :target_teacher_id")
    List<SchoolClass> findClassesOfTeacher(@Param("target_teacher_id") BigInteger teacherId);

    @Query(value = "SElECT DISTINCT class_group_id FROM schedule " +
                   "WHERE teacher_id = :target_teacher_id AND school_class_id = :target_school_class_id",
    nativeQuery = true)
    List<BigInteger> findGroupsOfTeacherAndClass(@Param("target_teacher_id") BigInteger teacherId,
                                                 @Param("target_school_class_id") BigInteger schoolClassId);

    @Query(value = "select distinct sr.subject from ScheduleRecord sr " +
            "where sr.teacher.teacherId = :target_teacher_id and sr.schoolClass.schoolClassId = :target_school_class_id " +
            "and ((:target_class_group_id is null and sr.classGroup.classGroupId is null) or sr.classGroup.classGroupId = :target_class_group_id)")
    List<Subject> findSubjectsOfTeacherAndClassAndGroup(@Param("target_teacher_id") BigInteger teacherId,
                                                        @Param("target_school_class_id") BigInteger schoolClassId,
                                                        @Param("target_class_group_id") BigInteger classGroupId);

    @Query(value = "from MarkBookRecord m where m.subject.subjectId = :target_subject_id " +
                   "and m.recordDate = :target_date and m.student.studentId = :target_student_id")
    List<MarkBookRecord> findMarksForStudentOfSubjectAndDate(@Param("target_student_id") BigInteger studentId,
                                                              @Param("target_subject_id") BigInteger subjectId,
                                                              @Param("target_date") LocalDate markDate);
}