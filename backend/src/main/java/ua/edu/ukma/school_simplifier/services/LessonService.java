package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.dto.lesson.AddLessonDTO;
import ua.edu.ukma.school_simplifier.domain.models.Lesson;

import java.math.BigInteger;
import java.util.List;

public interface LessonService {

    List<Lesson> getAllLessons();

    void addLesson(AddLessonDTO addLessonDTO);

    void deleteLesson(BigInteger lessonId);
}
