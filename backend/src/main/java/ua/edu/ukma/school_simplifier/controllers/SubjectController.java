package ua.edu.ukma.school_simplifier.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.edu.ukma.school_simplifier.domain.models.Subject;
import ua.edu.ukma.school_simplifier.services.SubjectService;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping("")
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

}
