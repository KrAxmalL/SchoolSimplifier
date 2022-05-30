package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigInteger;

@Entity
@Table(name = "topic_mark_record")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TopicMarkRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topic_mark_record_id")
    private BigInteger topicMarkRecordId;

    @Column(name = "mark")
    private Integer mark;

    @ManyToOne
    @JoinColumn(name = "mark_book_named_topic_id")
    private MarkBookNamedTopic markBookNamedTopic;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
