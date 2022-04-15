package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.models.security.User;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "FROM User u WHERE u.email = :email")
    User findUserByEmail(@Param("email") String email);

}
