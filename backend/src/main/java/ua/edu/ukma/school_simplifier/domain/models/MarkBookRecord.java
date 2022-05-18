package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigInteger;
import java.time.LocalDate;

@Entity
@Table(name = "mark_book")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MarkBookRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "mark_book_record_id")
    private BigInteger markBookRecordId;

    @Column(name = "record_date")
    private LocalDate recordDate;

    @Column(name = "student_present")
    private boolean studentPresent;

    @Column(name = "mark")
    private Integer mark;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
}
