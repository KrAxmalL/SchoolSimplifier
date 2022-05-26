package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.edu.ukma.school_simplifier.domain.models.Lesson;
import ua.edu.ukma.school_simplifier.services.LessonService;

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
}
