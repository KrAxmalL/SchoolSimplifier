package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.mark.AddMarkRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.StudentService;
import ua.edu.ukma.school_simplifier.services.TeacherService;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class MarkBookController {

    private final TeacherService teacherService;

    @GetMapping("")
    public ResponseEntity<Object> getMarksForStudentsOfGroupAndSubject(@RequestParam(name = "schoolClassId") BigInteger schoolClassId,
                                                                       @RequestParam(name = "classGroupId", required = false) BigInteger classGroupId,
                                                                       @RequestParam(name = "subjectId") BigInteger subjectId,
                                                                       @RequestParam(name = "markDate") String markDate) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object teacherEmailObj = authentication.getPrincipal();
        if(teacherEmailObj != null) {
            try {
                List<StudentMarksDTO> studentsMarks =
                        teacherService.getMarksForStudentsOfGroupAndSubjectAndDate(schoolClassId, classGroupId, subjectId, LocalDate.parse(markDate));
                return ResponseEntity.ok().body(studentsMarks);
            } catch(InvalidParameterException ex) {
                final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
        }
        else {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Teacher's email not foundS!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("")
    public ResponseEntity<Object> addMarkForStudent(@RequestBody AddMarkRecordDTO addMarkRecordDTO) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object teacherEmailObj = authentication.getPrincipal();
        if(teacherEmailObj != null) {
            try {
                teacherService.addMarkRecordForStudent(teacherEmailObj.toString(), addMarkRecordDTO);
                return ResponseEntity.status(HttpStatus.CREATED).build();
            } catch(InvalidParameterException ex) {
                final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
        }
        else {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Teacher's email not foundS!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}
