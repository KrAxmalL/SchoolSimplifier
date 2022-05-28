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
import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentSubjectMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.StudentSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.ClassSubjectDTO;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.StudentService;

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
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Student's email not foundS!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/subjects")
    public ResponseEntity<Object> getSubjectsForStudent() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object studentEmailObj = authentication.getPrincipal();
        if (studentEmailObj != null) {
            try {
                final List<ClassSubjectDTO> studentSchedule = studentService.getSubjectsForStudent(studentEmailObj.toString());
                return ResponseEntity.ok().body(studentSchedule);
            } catch (InvalidParameterException ex) {
                final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
        } else {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Student's email not foundS!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/class")
    public ResponseEntity<Object> getClassDataForStudent() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object studentEmailObj = authentication.getPrincipal();
        if (studentEmailObj != null) {
            try {
                final StudentSchoolClassDTO studentClassData = studentService.getClassInfoForStudent(studentEmailObj.toString());
                return ResponseEntity.ok().body(studentClassData);
            } catch (InvalidParameterException ex) {
                final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
        } else {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Student's email not foundS!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/marks")
    public ResponseEntity<Object> getMarksForStudent() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object studentEmailObj = authentication.getPrincipal();
        if (studentEmailObj != null) {
            try {
                final List<StudentSubjectMarksDTO> studentMarks = studentService.getMarksForStudent(studentEmailObj.toString());
                return ResponseEntity.ok().body(studentMarks);
            } catch (InvalidParameterException ex) {
                final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
        } else {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Student's email not foundS!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}
