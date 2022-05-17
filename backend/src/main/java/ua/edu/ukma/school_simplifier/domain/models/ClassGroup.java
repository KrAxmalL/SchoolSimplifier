package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "class_group")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ClassGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "class_group_id")
    private Long classGroupId;

    @Column(name = "class_group_number")
    private Integer classGroupNumber;

    @OneToMany(mappedBy = "classGroup")
    private List<Student> students;
}
