package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.security.JwtToken;

public interface JWTRepository extends CrudRepository<JwtToken, String> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM JwtToken WHERE principalId = :principalId")
    void deleteTokenForUser(@Param("principalId") Long principalId);
}
