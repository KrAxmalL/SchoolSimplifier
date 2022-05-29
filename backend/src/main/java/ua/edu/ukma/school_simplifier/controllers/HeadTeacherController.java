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
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.student.HeadTeacherStudentSummaryDTO;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.HeadTeacherService;

import java.util.List;

@RestController
@RequestMapping("/api/headteachers")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class HeadTeacherController {

    private final HeadTeacherService headTeacherService;

    @GetMapping("/classes")
    public ResponseEntity<Object> getClassInfoForTeacher() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object teacherEmailObj = authentication.getPrincipal();
        if(teacherEmailObj != null) {
            try {
                List<TeacherSchoolClassDTO> classesInfo = headTeacherService.getAllClassesInfo();
                return ResponseEntity.ok().body(classesInfo);
            } catch(InvalidParameterException ex) {
                final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
        }
        else {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Teacher's email not foundS!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/students")
    public List<HeadTeacherStudentSummaryDTO> getAllStudents() {
        return headTeacherService.getAllStudents();
    }
}
