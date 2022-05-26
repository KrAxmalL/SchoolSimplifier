package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.schedule.AddScheduleRecordDTO;

import java.math.BigInteger;

public interface ScheduleService {

    void addScheduleRecord(AddScheduleRecordDTO addScheduleRecordDTO);

    void deleteScheduleRecord(BigInteger scheduleRecordId);
}
