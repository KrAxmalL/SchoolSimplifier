package ua.edu.ukma.school_simplifier.controllers;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.edu.ukma.school_simplifier.domain.dto.principal.LoginPrincipalDTO;
import ua.edu.ukma.school_simplifier.domain.security.Principal;
import ua.edu.ukma.school_simplifier.domain.security.TokenPair;
import ua.edu.ukma.school_simplifier.exceptions.InvalidTokenException;
import ua.edu.ukma.school_simplifier.exceptions.TokenNotFoundException;
import ua.edu.ukma.school_simplifier.services.JwtTokenService;
import ua.edu.ukma.school_simplifier.utils.Pair;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/authentication")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;

    @PostMapping("/login")
    public ResponseEntity<TokenPair> login(@RequestBody LoginPrincipalDTO principalToLogin) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(principalToLogin.getEmail(), principalToLogin.getPassword());
            Principal principal = (Principal) authenticationManager.authenticate(authenticationToken).getPrincipal();

            TokenPair tokens = jwtTokenService.getNewTokens(principal);
            return ResponseEntity.ok(tokens);
        } catch(AuthenticationException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshTokens(@RequestBody String refreshTokenJson) {
        try {
            String refreshToken = new ObjectMapper().readValue(refreshTokenJson, ObjectNode.class)
                    .get("refreshToken").asText();
            log.info("refreshToken: {}", refreshToken);
            final TokenPair tokens = jwtTokenService.getRefreshedTokens(refreshToken);
            return ResponseEntity.ok(new ObjectMapper().writeValueAsString(tokens));
        } catch (TokenNotFoundException | InvalidTokenException ex) {
            log.error("Error logging in: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (TokenExpiredException ex) {
            log.error("Error logging in: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        } catch (Exception ex) {
            log.error("Error logging in: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}
