package ua.edu.ukma.school_simplifier.controllers;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.edu.ukma.school_simplifier.exceptions.InvalidTokenException;
import ua.edu.ukma.school_simplifier.exceptions.TokenNotFoundException;
import ua.edu.ukma.school_simplifier.services.JwtTokenService;
import ua.edu.ukma.school_simplifier.utils.Pair;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class JwtTokenController {

    private final JwtTokenService jwtTokenService;

    @PostMapping("/token/refresh")
    public ResponseEntity<String> refreshToken(@RequestBody String refreshTokenJson) throws IOException {
        try {
            String refreshToken = new ObjectMapper().readValue(refreshTokenJson, ObjectNode.class)
                    .get("refreshToken").asText();
            log.info("refreshToken: {}", refreshToken);
            final Pair<String,String> tokens = jwtTokenService.getRefreshedTokens(refreshToken);
            Map<String, String> tokensMap = new HashMap<>();
            tokensMap.put("accessToken", tokens.getFirst());
            tokensMap.put("refreshToken", tokens.getSecond());
            String responseBody = new ObjectMapper().writeValueAsString(tokensMap);
            log.info("Response: {}", responseBody);
            return ResponseEntity.ok().body(responseBody);
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
