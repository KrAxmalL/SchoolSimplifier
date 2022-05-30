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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ua.edu.ukma.school_simplifier.domain.dto.classgroup.ClassGroupSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.mark.StudentMarksDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.TeacherScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.SchoolClassStudentsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.SchoolClassSubjectsDTO;
import ua.edu.ukma.school_simplifier.domain.dto.schoolclass.TeacherSchoolClassDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.TeacherSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.dto.teacher.TeacherSummaryDTO;
import ua.edu.ukma.school_simplifier.domain.models.Teacher;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.TeacherService;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping("")
    public List<TeacherSummaryDTO> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    @GetMapping("/schedule")
    public ResponseEntity<Object> getScheduleForTeacher() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object teacherEmailObj = authentication.getPrincipal();
        if(teacherEmailObj != null) {
            try {
                final List<TeacherScheduleRecordDTO> teacherSchedule = teacherService.getScheduleForTeacher(teacherEmailObj.toString());
                return ResponseEntity.ok().body(teacherSchedule);
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

    @GetMapping("/subjects")
    public ResponseEntity<Object> getSubjectsForTeacher() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object teacherEmailObj = authentication.getPrincipal();
        if(teacherEmailObj != null) {
            try {
                final List<TeacherSubjectDTO> teacherSubjects = teacherService.getSubjectsForTeacher(teacherEmailObj.toString());
                return ResponseEntity.ok().body(teacherSubjects);
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

    @GetMapping("/classes")
    public ResponseEntity<Object> getClassesAndSubjectsForTeacher() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final Object teacherEmailObj = authentication.getPrincipal();
        if(teacherEmailObj != null) {
            try {
                List<SchoolClassSubjectsDTO> teacherClassesWithSubjects = teacherService.getSchoolClassesAndSubjects(teacherEmailObj.toString());
                return ResponseEntity.ok().body(teacherClassesWithSubjects);
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
    public ResponseEntity<Object> getStudentsOfClass(@RequestParam(name = "schoolClassId") BigInteger schoolClassId) {
        try {
            SchoolClassStudentsDTO schoolClassStudentsDTO = teacherService.getStudentsOfClass(schoolClassId);
            return ResponseEntity.ok().body(schoolClassStudentsDTO);
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
