package ua.edu.ukma.school_simplifier.domain.dto.principal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LoginPrincipalDTO {

    private String email;
    private String password;
}
