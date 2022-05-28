package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigInteger;

@Entity
@Table(name = "lesson")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lesson_id")
    private BigInteger lessonId;

    @Column(name = "lesson_number")
    private Integer lessonNumber;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "finish_time")
    private String finishTime;
}
