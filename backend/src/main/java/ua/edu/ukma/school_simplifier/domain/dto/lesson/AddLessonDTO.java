package ua.edu.ukma.school_simplifier.domain.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AddLessonDTO {

    private Integer lessonNumber;
    private String startTime;
    private String finishTime;
}
