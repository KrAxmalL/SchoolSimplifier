package ua.edu.ukma.school_simplifier.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.edu.ukma.school_simplifier.domain.security.Role;

import java.math.BigInteger;

public interface RoleRepository extends JpaRepository<Role, BigInteger> {

    @Query(value = "FROM Role WHERE roleName = :roleName")
    Role findRoleByName(@Param("roleName") String roleName);
}
