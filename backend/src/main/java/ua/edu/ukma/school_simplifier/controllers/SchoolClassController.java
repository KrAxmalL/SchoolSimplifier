package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.AddSchoolClassDTO;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.SchoolClassService;

import java.math.BigInteger;

@RestController
@RequestMapping("/api/schoolClasses")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class SchoolClassController {

    private final SchoolClassService schoolClassService;

    @PostMapping("")
    public ResponseEntity<Object> addSchoolClass(@RequestBody AddSchoolClassDTO addSchoolClassDTO) {
        try {
            schoolClassService.addSchoolClass(addSchoolClassDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{schoolClassId}")
    public ResponseEntity<Object> deleteMarkRecord(@PathVariable(name = "schoolClassId") BigInteger schoolClassId) {
        try {
            schoolClassService.deleteSchoolClass(schoolClassId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
