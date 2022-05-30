package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.edu.ukma.school_simplifier.domain.models.DateMarkRecord;

import java.math.BigInteger;

public interface DateMarkRecordRepository extends JpaRepository<DateMarkRecord, BigInteger> {
}