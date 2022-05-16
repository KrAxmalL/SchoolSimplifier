package ua.edu.ukma.school_simplifier.domain.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "jwt_token")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class JwtToken {

    @Id
    @Column(name = "token")
    private String value;

    @Column(name = "principal_id")
    private Long principalId;
}
