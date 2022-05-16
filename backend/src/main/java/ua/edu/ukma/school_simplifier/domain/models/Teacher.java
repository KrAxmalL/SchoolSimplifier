package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ua.edu.ukma.school_simplifier.domain.security.User;

import javax.persistence.*;

@Entity
@Table(name = "teacher")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Teacher extends User {

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "patronymic")
    private String patronymic;

    @OneToOne
    @JoinColumn(name = "school_class_id", referencedColumnName = "school_class_id")
    private SchoolClass schoolClass;
}
