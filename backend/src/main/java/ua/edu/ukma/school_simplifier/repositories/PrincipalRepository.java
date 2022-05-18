package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.security.Principal;

import java.util.Optional;

public interface PrincipalRepository extends JpaRepository<Principal, Long> {

    @Query(value = "FROM Principal u WHERE u.email = :email")
    Principal findPrincipalByEmail(@Param("email") String email);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "DELETE FROM principal_jwt WHERE principal_id = :target_principal_id",
            nativeQuery = true)
    void deleteTokenForPrincipal(@Param("target_principal_id") Long principalId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "INSERT INTO principal_jwt(principal_id, token) " +
                   "VALUES(:target_principal_id, :target_token)",
            nativeQuery = true)
    void addTokenForPrincipal(@Param("target_principal_id") Long principalId,
                                 @Param("target_token") String refreshToken);

    @Query(value = "SELECT token FROM principal_jwt " +
                   "WHERE token = :target_token",
            nativeQuery = true)
    Optional<String> getRefreshToken(@Param("target_token") String refreshToken);
}
