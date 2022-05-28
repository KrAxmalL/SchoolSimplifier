package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.lesson.AddLessonDTO;
import ua.edu.ukma.school_simplifier.domain.models.Lesson;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.repositories.LessonRepository;
import ua.edu.ukma.school_simplifier.repositories.ScheduleRepository;

import java.math.BigInteger;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final ScheduleRepository scheduleRepository;
    private static final String LESSON_TIME_REGEXP = "^\\d{2}:\\d{2}$";

    @Override
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    @Override
    public void addLesson(final AddLessonDTO addLessonDTO) {
        final Integer lessonNumber = addLessonDTO.getLessonNumber();
        if(lessonNumber == null) {
            throw new InvalidParameterException("Lesson number must not be null");
        }
        if(lessonNumber <= 0) {
            throw new InvalidParameterException("Lesson number must be greater than 0");
        }

        final String lessonStartTime = validateLessonTime(addLessonDTO.getStartTime());
        final String lessonFinishTime = validateLessonTime(addLessonDTO.getFinishTime());

        boolean lessonWithSameParamsExists = lessonRepository.findAll().stream()
                                                             .anyMatch(lesson -> lesson.getLessonNumber().equals(lessonNumber)
                                                                     && lesson.getStartTime().equals(lessonStartTime)
                                                                     && lesson.getFinishTime().equals(lessonFinishTime));
        if(lessonWithSameParamsExists) {
            throw new InvalidParameterException("Lesson with provided parameters already exist");
        }

        Lesson lessonToAdd = new Lesson();
        lessonToAdd.setLessonNumber(lessonNumber);
        lessonToAdd.setStartTime(lessonStartTime);
        lessonToAdd.setFinishTime(lessonFinishTime);
        lessonRepository.save(lessonToAdd);
    }

    @Override
    public void deleteLesson(BigInteger lessonId) {
        if(!lessonRepository.existsById(lessonId)) {
            throw new InvalidParameterException("Lesson with provided id doesn't exist");
        }

        boolean existsScheduleRecordWithLesson = scheduleRepository.findAll()
                .stream()
                .anyMatch(scheduleRecord -> scheduleRecord.getLesson().getLessonId().equals(lessonId));
        if(existsScheduleRecordWithLesson) {
            throw new InvalidParameterException("Can't delete lesson if exists schedule record with provided lesson");
        }

        lessonRepository.deleteById(lessonId);
    }

    private String validateLessonTime(final String lessonTime) {
        if(lessonTime == null) {
            throw new InvalidParameterException("Lesson time must not be null");
        }
        final String lessonTimeRes = lessonTime.trim();
        if(lessonTimeRes.isBlank()) {
            throw new InvalidParameterException("Lesson time must not be empty");
        }
        if(!lessonTimeRes.matches(LESSON_TIME_REGEXP)) {
            throw new InvalidParameterException("Invalid lesson time format. Must be: dd:dd");
        }
        return lessonTimeRes;
    }
}
