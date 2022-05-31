package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.AddScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.ScheduleService;

import java.math.BigInteger;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping("")
    public ResponseEntity<Object> addMarkRecord(@RequestBody AddScheduleRecordDTO addScheduleRecordDTO) {
        try {
            scheduleService.addScheduleRecord(addScheduleRecordDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{scheduleRecordId}")
    public ResponseEntity<Object> deleteMarkRecord(@PathVariable(name = "scheduleRecordId") BigInteger scheduleRecordId) {
        try {
            scheduleService.deleteScheduleRecord(scheduleRecordId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
}
