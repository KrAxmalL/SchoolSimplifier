package ua.edu.ukma.school_simplifier.controllers;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.domain.dto.principal.LoginPrincipalDTO;
import ua.edu.ukma.school_simplifier.domain.security.Principal;
import ua.edu.ukma.school_simplifier.domain.security.TokenPair;
import ua.edu.ukma.school_simplifier.exceptions.InvalidTokenException;
import ua.edu.ukma.school_simplifier.exceptions.TokenNotFoundException;
import ua.edu.ukma.school_simplifier.security.filter.JwtAuthorizationFilter;
import ua.edu.ukma.school_simplifier.services.JwtTokenService;
import ua.edu.ukma.school_simplifier.utils.Pair;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/authentication")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginPrincipalDTO principalToLogin) {
        try {
            final UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(principalToLogin.getEmail(), principalToLogin.getPassword());
            final Principal principal = (Principal) authenticationManager.authenticate(authenticationToken).getPrincipal();

            final TokenPair tokens = jwtTokenService.getNewTokens(principal);
            return ResponseEntity.ok().body(tokens);
        } catch(AuthenticationException ex) {
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/refresh")
    public ResponseEntity<Object> refreshTokens(@RequestHeader HttpHeaders headers) {
        try {
            final List<String> authorizationHeaderValues = headers.get(HttpHeaders.AUTHORIZATION);
            if(authorizationHeaderValues == null) {
                throw new TokenNotFoundException("No Authorization header present");
            }
            if(authorizationHeaderValues.size() == 0) {
                throw new TokenNotFoundException("No token present in Authorization header");
            }

            final String authHeaderValueStr = authorizationHeaderValues.get(0);
            if(authHeaderValueStr.length() < JwtAuthorizationFilter.BEARER_LENGTH) {
                throw new TokenNotFoundException("No token present in Authorization header");
            }

            final String refreshToken = authHeaderValueStr.substring(JwtAuthorizationFilter.BEARER_LENGTH);
            final TokenPair tokens = jwtTokenService.getRefreshedTokens(refreshToken);
            return ResponseEntity.ok().body(tokens);
        } catch (TokenExpiredException ex) {
            log.error("Error logging in: {}", ex.getMessage());
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (TokenNotFoundException | InvalidTokenException ex) {
            log.error("Error logging in: {}", ex.getMessage());
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.FORBIDDEN.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        } catch (Exception ex) {
            log.error("Error logging in: {}", ex.getMessage());
            final ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
