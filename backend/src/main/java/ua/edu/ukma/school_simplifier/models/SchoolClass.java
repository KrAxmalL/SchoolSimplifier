package ua.edu.ukma.school_simplifier.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "school_class")
@AttributeOverride(name = "id", column = @Column(name = "school_class_id"))
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SchoolClass extends AbstractModel {

    @OneToOne(mappedBy = "schoolClass")
    private Teacher formTeacher;

    @OneToMany(mappedBy = "schoolClass")
    private List<Student> students;

    @Column(name = "school_class_name")
    private String schoolClassName;
}
