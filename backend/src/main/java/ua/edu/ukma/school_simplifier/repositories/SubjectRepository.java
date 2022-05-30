package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.Subject;

import java.math.BigInteger;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, BigInteger> {

    @Query(value = "select sr.subject from ScheduleRecord sr " +
            "where sr.schoolClass.schoolClassId = :target_school_class_id")
    List<Subject> findSubjectsForClass(@Param("target_school_class_id") BigInteger schoolClassId);

    @Query(value = "select distinct sr.subject from ScheduleRecord sr " +
            "where sr.teacher.teacherId = :target_teacher_id and sr.schoolClass.schoolClassId = :target_school_class_id " +
            "and ((:target_class_group_id is null and sr.classGroup.classGroupId is null) or sr.classGroup.classGroupId = :target_class_group_id)")
    List<Subject> findSubjectsOfTeacherAndClassAndGroup(@Param("target_teacher_id") BigInteger teacherId,
                                                        @Param("target_school_class_id") BigInteger schoolClassId,
                                                        @Param("target_class_group_id") BigInteger classGroupId);

    @Query(value = "select distinct sr.subject from ScheduleRecord sr " +
            "where sr.schoolClass.schoolClassId = :target_school_class_id ")
    List<Subject> findSubjectsOfClass(@Param("target_school_class_id") BigInteger schoolClassId);

    @Query(value = "select distinct sr.subject from ScheduleRecord sr " +
            "where ((:target_class_group_id is null and sr.classGroup.classGroupId is null) " +
            "or sr.classGroup.classGroupId = :target_class_group_id)")
    List<Subject> findSubjectsOfClassGroup(@Param("target_class_group_id") BigInteger classGroupId);

    @Query(value = "SELECT DISTINCT subject.subject_name, school_class.school_class_name, " +
            "class_group.class_group_number " +
            "FROM schedule INNER JOIN subject ON schedule.subject_id = subject.subject_id " +
            "INNER JOIN school_class ON schedule.school_class_id = school_class.school_class_id " +
            "LEFT OUTER JOIN class_group ON schedule.class_group_id = class_group.class_group_id " +
            "WHERE schedule.teacher_id = :target_teacher_id",
            nativeQuery = true)
    List<Object[]> findSubjectsForTeacher(@Param("target_teacher_id") BigInteger teacherId);

    @Query(value = "SELECT DISTINCT subject.subject_id, subject.subject_name, class_group.class_group_number, " +
            "teacher.last_name, teacher.first_name, teacher.patronymic " +
            "FROM schedule INNER JOIN subject ON schedule.subject_id = subject.subject_id " +
            "INNER JOIN teacher ON schedule.teacher_id = teacher.teacher_id " +
            "LEFT OUTER JOIN class_group ON schedule.class_group_id = class_group.class_group_id " +
            "WHERE schedule.school_class_id = :target_school_class_id",
            nativeQuery = true)
    List<Object[]> findSubjectsForClassByGroups(@Param("target_school_class_id") BigInteger schoolClassId);
}