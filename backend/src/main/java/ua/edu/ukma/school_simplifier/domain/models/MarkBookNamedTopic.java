package ua.edu.ukma.school_simplifier.domain.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigInteger;
import java.util.List;

@Entity
@Table(name = "mark_book_named_topic")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MarkBookNamedTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mark_book_named_topic_id")
    private BigInteger markBookNamedTopicId;

    @Column(name = "topic_name")
    private String topicName;

    @ManyToOne
    @JoinColumn(name = "mark_book_id")
    private MarkBook markBook;

    @OneToMany(mappedBy = "markBookNamedTopic")
    private List<TopicMarkRecord> topicMarkRecords;
}
