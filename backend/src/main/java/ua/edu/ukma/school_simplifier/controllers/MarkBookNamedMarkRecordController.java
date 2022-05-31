package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.mark.AddMarkBookNamedMarkRecordDTO;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.TeacherService;

import java.math.BigInteger;

@RestController
@RequestMapping("/api/namedMarkRecords")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class MarkBookNamedMarkRecordController {

    private final TeacherService teacherService;

    @PostMapping("")
    public ResponseEntity<Object> addMarkBookNamedTopicRecord(@RequestBody AddMarkBookNamedMarkRecordDTO addMarkBookNamedMarkRecordDTO) {
        try {
            teacherService.addMarkBookNamedMarkRecord(addMarkBookNamedMarkRecordDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{markBookNamedTopicRecordId}")
    public ResponseEntity<Object> deleteMarkBookNamedTopicRecord
            (@PathVariable(name = "markBookNamedTopicRecordId") BigInteger markBookNamedTopicRecordId) {
        try {
            teacherService.deleteMarkBookNamedTopicRecord(markBookNamedTopicRecordId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
