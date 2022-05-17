package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "school_class")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "school_class_id")
    private Long schoolClassId;

    @Column(name = "school_class_name")
    private String schoolClassName;

    @OneToOne(mappedBy = "schoolClass")
    private Teacher formTeacher;

    @OneToMany(mappedBy = "schoolClass")
    private List<Student> students;

    @OneToMany(mappedBy = "schoolClass")
    private List<ScheduleRecord> scheduleRecords;
}
