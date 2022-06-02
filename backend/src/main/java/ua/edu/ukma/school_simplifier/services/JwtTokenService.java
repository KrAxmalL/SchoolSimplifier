package ua.edu.ukma.school_simplifier.services;

import com.auth0.jwt.interfaces.DecodedJWT;
import ua.edu.ukma.school_simplifier.domain.security.Principal;
import ua.edu.ukma.school_simplifier.domain.security.TokenPair;

import java.util.List;

public interface JwtTokenService {

    TokenPair getNewTokens(Principal principal);

    TokenPair getRefreshedTokens(String refreshToken);

    public String getEmail(String token);

    List<String> getRoles(String accessToken);

    boolean isValidToken(String token);

    boolean isTokenExpired(String token);
}
