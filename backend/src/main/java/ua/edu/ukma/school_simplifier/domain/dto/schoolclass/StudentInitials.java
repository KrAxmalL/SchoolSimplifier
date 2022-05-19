package ua.edu.ukma.school_simplifier.domain.dto.schoolclass;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudentInitials {

    private String studentLastName;
    private String studentFirstName;
    private String studentPatronymic;
}
