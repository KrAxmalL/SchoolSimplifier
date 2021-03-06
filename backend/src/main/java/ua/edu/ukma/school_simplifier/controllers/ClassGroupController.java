package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.edu.ukma.school_simplifier.domain.dto.classgroup.AddClassGroupDTO;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.AddSchoolClassDTO;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.ClassGroupService;

import java.math.BigInteger;

@RestController
@RequestMapping("/api/classGroups")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ClassGroupController {

    private final ClassGroupService classGroupService;

    @PostMapping("")
    public ResponseEntity<Object> addSchoolClass(@RequestBody AddClassGroupDTO addClassGroupDTO) {
        try {
            classGroupService.addClassGroup(addClassGroupDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{schoolClassId}/{classGroupNumber}")
    public ResponseEntity<Object> deleteMarkRecord(@PathVariable(name = "schoolClassId") BigInteger schoolClassId,
                                                   @PathVariable(name = "classGroupNumber") Integer classGroupNumber) {
        try {
            classGroupService.deleteClassGroup(classGroupNumber, schoolClassId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
