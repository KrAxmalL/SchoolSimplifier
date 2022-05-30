package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigInteger;

@Entity
@Table(name = "date_mark_record")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DateMarkRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "date_mark_record_id")
    private BigInteger dateMarkRecordId;

    @Column(name = "student_present")
    private Boolean studentPresent;

    @Column(name = "mark")
    private Integer mark;

    @ManyToOne
    @JoinColumn(name = "mark_book_date_topic_id")
    private MarkBookDateTopic markBookDateTopic;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
