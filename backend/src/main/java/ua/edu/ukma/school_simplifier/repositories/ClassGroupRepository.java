package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.models.ClassGroup;

import java.math.BigInteger;
import java.util.List;

public interface ClassGroupRepository extends JpaRepository<ClassGroup, BigInteger> {

    @Query(value = "SElECT DISTINCT class_group_id FROM schedule " +
            "WHERE teacher_id = :target_teacher_id AND school_class_id = :target_school_class_id",
            nativeQuery = true)
    List<BigInteger> findGroupsOfTeacherAndClass(@Param("target_teacher_id") BigInteger teacherId,
                                                 @Param("target_school_class_id") BigInteger schoolClassId);
}