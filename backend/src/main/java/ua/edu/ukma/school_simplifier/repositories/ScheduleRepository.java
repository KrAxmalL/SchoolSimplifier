package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.ScheduleRecord;

import java.math.BigInteger;

public interface ScheduleRepository extends JpaRepository<ScheduleRecord, BigInteger> {
}