package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigInteger;
import java.util.List;

@Entity
@Table(name = "school_class")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "school_class_id")
    private BigInteger schoolClassId;

    @Column(name = "school_class_name")
    private String schoolClassName;

    @OneToOne
    @JoinColumn(name = "form_teacher_id")
    private Teacher formTeacher;

    @OneToMany(mappedBy = "schoolClass")
    private List<Student> students;

    @OneToMany(mappedBy = "schoolClass")
    private List<ClassGroup> classGroups;

    @OneToMany(mappedBy = "schoolClass")
    private List<ScheduleRecord> scheduleRecords;

    @OneToMany(mappedBy = "schoolClass")
    private List<MarkBook> markBooks;
}
