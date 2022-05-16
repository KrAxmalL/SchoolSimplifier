package ua.edu.ukma.school_simplifier.domain.security;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;

@Entity
@Table(name = "role")
@NoArgsConstructor
@AllArgsConstructor
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @Column(name = "role_name")
    private String roleName;

    @Override
    public String getAuthority() {
        return roleName;
    }

    public void setAuthority(String authority) { this.roleName = authority; }

    @Override
    public String toString() {
        return roleName;
    }
}
