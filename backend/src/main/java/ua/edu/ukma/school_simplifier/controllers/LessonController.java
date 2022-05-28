package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.lesson.AddLessonDTO;
import ua.edu.ukma.school_simplifier.domain.models.Lesson;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.services.LessonService;

import java.math.BigInteger;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("")
    public List<Lesson> getAllLessons() {
        return lessonService.getAllLessons();
    }

    @PostMapping("")
    public ResponseEntity<Object> addNewLesson(@RequestBody final AddLessonDTO addLessonDTO) {
        try {
            lessonService.addLesson(addLessonDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Object> deleteMarkRecord(@PathVariable(name = "lessonId") BigInteger lessonId) {
        try {
            lessonService.deleteLesson(lessonId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch(InvalidParameterException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
