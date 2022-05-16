package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.security.Principal;

public interface PrincipalRepository extends JpaRepository<Principal, Long> {

    @Query(value = "FROM Principal u WHERE u.email = :email")
    Principal findPrincipalByEmail(@Param("email") String email);

}
