package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "mark_book_date_topic")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MarkBookDateTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mark_book_date_topic_id")
    private BigInteger markBookDateTopicId;

    @Column(name = "topic_date")
    private LocalDate topicDate;

    @ManyToOne
    @JoinColumn(name = "mark_book_id")
    private MarkBook markBook;

    @OneToMany(mappedBy = "markBookDateTopic")
    private List<DateMarkRecord> dateMarkRecords;
}
