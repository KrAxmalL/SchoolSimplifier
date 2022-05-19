package ua.edu.ukma.school_simplifier.domain.dto.mark;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MarkSummary {

    private LocalDate recordDate;
    private Integer mark;
    private String description;
}
