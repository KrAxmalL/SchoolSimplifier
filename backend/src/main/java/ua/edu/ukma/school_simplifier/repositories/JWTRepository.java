package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.models.JwtToken;
import ua.edu.ukma.school_simplifier.models.security.User;

public interface JWTRepository extends CrudRepository<JwtToken, String> {

    @Modifying
    @Query("DELETE FROM JwtToken WHERE userId = :userId")
    void deleteTokenForUser(@Param("userId") Long userId);
}
