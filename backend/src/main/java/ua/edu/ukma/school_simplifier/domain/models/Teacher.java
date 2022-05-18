package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ua.edu.ukma.school_simplifier.domain.security.Principal;

import javax.persistence.*;
import java.math.BigInteger;
import java.util.List;

@Entity
@Table(name = "teacher")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Teacher {

    @Id
    @Column(name = "teacher_id")
    private BigInteger teacherId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "patronymic")
    private String patronymic;

    @OneToOne(mappedBy = "formTeacher")
    private SchoolClass schoolClass;

    @OneToMany(mappedBy = "teacher")
    private List<ScheduleRecord> scheduleRecords;
}
