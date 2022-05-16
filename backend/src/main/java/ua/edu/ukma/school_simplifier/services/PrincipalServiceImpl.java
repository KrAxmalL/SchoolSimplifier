package ua.edu.ukma.school_simplifier.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.security.Principal;
import ua.edu.ukma.school_simplifier.domain.security.Role;
import ua.edu.ukma.school_simplifier.repositories.RoleRepository;
import ua.edu.ukma.school_simplifier.repositories.PrincipalRepository;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class PrincipalServiceImpl implements PrincipalService, UserDetailsService {

    private final PrincipalRepository principalRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public Principal savePrincipal(Principal principal) {
        principal.setPassword(passwordEncoder.encode(principal.getPassword()));
        log.info("Saving rincipal {} to database", principal);
        return principalRepository.save(principal);
    }

    @Override
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public void addRoleToPrincipal(String email, String roleName) {
        Principal principal = principalRepository.findPrincipalByEmail(email);
        Role role = roleRepository.findRoleByName(roleName);

        principal.getAuthorities().add(role);
    }

    @Override
    public Principal getPrincipal(String email) {
        return principalRepository.findPrincipalByEmail(email);
    }

    @Override
    public List<Principal> getPrincipals() {
        return principalRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails principal = principalRepository.findPrincipalByEmail(email);
        if(principal == null) {
            throw new UsernameNotFoundException("Principal not found in the database");
        }
        log.info("Loading rincipal by rincipalname: {} {}", principal.getUsername(), principal.getPassword());

        return principal;
    }
}
