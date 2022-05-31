package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.mark.AddMarkBookDateMarkRecordDTO;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.TeacherService;

import java.math.BigInteger;

@RestController
@RequestMapping("/api/dateMarkRecords")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class MarkBookDateMarkRecordController {

    private final TeacherService teacherService;

    @PostMapping("")
    public ResponseEntity<Object> addMarkBookDateTopicRecord(@RequestBody AddMarkBookDateMarkRecordDTO addMarkBookDateMarkRecordDTO) {
        try {
            teacherService.addMarkBookDateMarkRecord(addMarkBookDateMarkRecordDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{markBookDateTopicRecordId}")
    public ResponseEntity<Object> deleteMarkBookDateTopicRecord
            (@PathVariable(name = "markBookDateTopicRecordId") BigInteger markBookDateTopicRecordId) {
        try {
            teacherService.deleteMarkBookDateTopicRecord(markBookDateTopicRecordId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
