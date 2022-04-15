package ua.edu.ukma.school_simplifier.models.security;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import ua.edu.ukma.school_simplifier.models.AbstractModel;

import javax.persistence.*;

@Entity
@Table(name = "role")
@AttributeOverride(name = "id", column = @Column(name = "role_id"))
@NoArgsConstructor
@AllArgsConstructor
public class Role extends AbstractModel implements GrantedAuthority {

    @Column(name = "role_name")
    private String roleName;

    @Override
    public String getAuthority() {
        return roleName;
    }

    public void setAuthority(String authority) { this.roleName = authority; }
}
