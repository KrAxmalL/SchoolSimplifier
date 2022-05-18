package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.dto.schedule.StudentScheduleRecordDTO;
import ua.edu.ukma.school_simplifier.domain.dto.subject.StudentSubjectDTO;
import ua.edu.ukma.school_simplifier.domain.models.Student;
import ua.edu.ukma.school_simplifier.exceptions.InvalidParameterException;
import ua.edu.ukma.school_simplifier.repositories.StudentRepository;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public List<StudentScheduleRecordDTO> getScheduleForStudent(String studentEmail) {
        final Optional<Student> studentOpt = studentRepository.findStudentByEmail(studentEmail);
        if(studentOpt.isEmpty()) {
            throw new InvalidParameterException("Student with provided email doesn't exist");
        }

        List<Object[]> scheduleRecords = studentRepository.findScheduleRecordsForStudent(studentOpt.get().getStudentId());
        return scheduleRecords.stream().map(studentObj -> {
            StudentScheduleRecordDTO resDTO = new StudentScheduleRecordDTO();
            resDTO.setScheduleRecordId((BigInteger) studentObj[0]);
            resDTO.setDay(studentObj[1].toString());
            resDTO.setSubjectName(studentObj[2].toString());
            resDTO.setLessonNumber((Integer) studentObj[3]);
            resDTO.setLessonStartTime(studentObj[4].toString());
            resDTO.setLessonFinishTime(studentObj[5].toString());
            resDTO.setTeacherLastName(studentObj[6].toString());
            resDTO.setTeacherFirstName(studentObj[7].toString());
            resDTO.setTeacherPatronymic(studentObj[8].toString());
            return resDTO;
        }).collect(Collectors.toList());
    }

    @Override
    public List<StudentSubjectDTO> getSubjectsForStudent(String studentEmail) {
        final Optional<Student> studentOpt = studentRepository.findStudentByEmail(studentEmail);
        if(studentOpt.isEmpty()) {
            throw new InvalidParameterException("Student with provided email doesn't exist");
        }

        List<Object[]> subjectRecords = studentRepository.findSubjectsForStudent(studentOpt.get().getStudentId());
        return subjectRecords.stream().map(studentObj -> {
            StudentSubjectDTO resDTO = new StudentSubjectDTO();
            resDTO.setSubjectName(studentObj[0].toString());
            resDTO.setClassGroupNumber(studentObj[1] == null
                                            ? null
                                            : (Integer) studentObj[1]);
            resDTO.setTeacherLastName(studentObj[2].toString());
            resDTO.setTeacherFirstName(studentObj[3].toString());
            resDTO.setTeacherPatronymic(studentObj[4].toString());
            return resDTO;
        }).collect(Collectors.toList());
    }
}
