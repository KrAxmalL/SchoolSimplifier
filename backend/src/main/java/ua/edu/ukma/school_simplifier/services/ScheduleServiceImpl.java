package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.AddScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.models.*;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.repositories.*;

import java.math.BigInteger;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

    private static final List<String> DAYS = List.of(
            "Понеділок", "Вівторок", "Середа", "Четвер",
            "П'ятниця", "Субота", "Неділя"
    );

    private final ScheduleRepository scheduleRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final LessonRepository lessonRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public void addScheduleRecord(AddScheduleRecordDTO addScheduleRecordDTO) {
        final SchoolClass schoolClass = schoolClassRepository.findById(addScheduleRecordDTO.getSchoolClassId())
                                        .orElseThrow(() -> new InvalidParameterException("School class with provided id doesn't exist"));
        ClassGroup searchedClassGroup = null;
        if(addScheduleRecordDTO.getClassGroupNumber() != null) {
            searchedClassGroup = schoolClass.getClassGroups().stream()
                    .filter(classGroup -> classGroup.getClassGroupNumber().compareTo(addScheduleRecordDTO.getClassGroupNumber()) == 0)
                    .findFirst()
                    .orElseThrow(() -> new InvalidParameterException("School class doesn't have group with provided number"));
        }

        final Lesson lesson = lessonRepository.findById(addScheduleRecordDTO.getLessonId())
                              .orElseThrow(() -> new InvalidParameterException("Lesson with provided id doesn't exist"));

        final Subject subject = subjectRepository.findById(addScheduleRecordDTO.getSubjectId())
                                .orElseThrow(() -> new InvalidParameterException("Subject with provided id doesn't exist"));

        final Teacher teacher = teacherRepository.findById(addScheduleRecordDTO.getTeacherId())
                               .orElseThrow(() -> new InvalidParameterException("Teacher with provided id doesn't exist"));

        final String day = addScheduleRecordDTO.getDay();
        if(!DAYS.contains(day)) {
            throw new InvalidParameterException("Day name must be one of the valid day names");
        }

        final ScheduleRecord scheduleRecordToAdd = new ScheduleRecord();
        scheduleRecordToAdd.setDay(addScheduleRecordDTO.getDay());
        scheduleRecordToAdd.setSchoolClass(schoolClass);
        scheduleRecordToAdd.setClassGroup(searchedClassGroup);
        scheduleRecordToAdd.setLesson(lesson);
        scheduleRecordToAdd.setSubject(subject);
        scheduleRecordToAdd.setTeacher(teacher);
        scheduleRepository.save(scheduleRecordToAdd);
    }

    @Override
    public void deleteScheduleRecord(BigInteger scheduleRecordId) {
        if(!scheduleRepository.existsById(scheduleRecordId)) {
            throw new InvalidParameterException("Schedule record with provided id doesn't exist");
        }
        scheduleRepository.deleteById(scheduleRecordId);
    }
}
