package ua.edu.ukma.school_simplifier.services;

import com.auth0.jwt.interfaces.DecodedJWT;
import ua.edu.ukma.school_simplifier.models.JwtToken;
import ua.edu.ukma.school_simplifier.models.security.User;
import ua.edu.ukma.school_simplifier.utils.Pair;

public interface JwtTokenService {

    Pair<String, String> getNewTokens(User user, String issuer);

    Pair<String, String> getRefreshedTokens(String refreshToken);

    DecodedJWT verifyToken(String token);
}
