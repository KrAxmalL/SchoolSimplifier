package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.domain.security.Principal;
import ua.edu.ukma.school_simplifier.domain.security.Role;

import java.util.List;

public interface PrincipalService {

    Principal savePrincipal(Principal principal);

    Role saveRole(Role role);
    void addRoleToPrincipal(String email, String roleName);

    Principal getPrincipal(String email);

    List<Principal> getPrincipals();
}
