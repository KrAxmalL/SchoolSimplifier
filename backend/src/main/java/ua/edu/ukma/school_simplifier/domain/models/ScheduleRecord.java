package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigInteger;

@Entity
@Table(name = "schedule")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ScheduleRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "schedule_record_id")
    private BigInteger scheduleRecordId;

    @Column(name = "record_day")
    private String day;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "school_class_id")
    private SchoolClass schoolClass;

    @ManyToOne
    @JoinColumn(name = "class_group_id")
    private ClassGroup classGroup;
}
