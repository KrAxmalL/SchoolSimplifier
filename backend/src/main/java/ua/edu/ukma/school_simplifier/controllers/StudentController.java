package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.StudentService;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/schedule")
    public ResponseEntity<Object> getScheduleForStudent() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object studentEmailObj = authentication.getPrincipal();
        if(studentEmailObj != null) {
            try {
                final List<StudentScheduleRecordDTO> studentSchedule = studentService.getScheduleForStudent(studentEmailObj.toString());
                return ResponseEntity.ok().body(studentSchedule);
            } catch(InvalidParameterException ex) {
                final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
        }
        else {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "tudent's email not foundS!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}
