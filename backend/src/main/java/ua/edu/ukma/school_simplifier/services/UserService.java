package ua.edu.ukma.school_simplifier.services;

import ua.edu.ukma.school_simplifier.models.security.Role;
import ua.edu.ukma.school_simplifier.models.security.User;

import java.util.List;

public interface UserService {

    User saveUser(User user);
    Role saveRole(Role role);
    void addRoleToUser(String email, String roleName);
    User getUser(String email);
    List<User> getUsers();
}
