package ua.edu.ukma.school_simplifier.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.context.annotation.Scope;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import ua.edu.ukma.school_simplifier.models.security.User;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JWTManager {

    private static final long ACCESS_TOKEN_EXPIRATION_TIME_MILLIS = 10 * 60 * 1000;
    private static final long REFRESH_TOKEN_EXPIRATION_TIME_MILLIS = 30 * 60 * 1000;

    private final Algorithm algorithm;
    private final JWTVerifier verifier;

    public JWTManager() {
        //todo: move secret to properties
        this.algorithm = Algorithm.HMAC256("secret".getBytes(StandardCharsets.UTF_8));
        this.verifier = JWT.require(algorithm).build();
    }

    public String getAccessToken(User user, String issuer) {
        return JWT.create()
                  .withSubject(user.getUsername())
                  .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_TIME_MILLIS))
                  .withIssuer(issuer)
                  .withClaim("roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                  .sign(algorithm);
    }

    public String getRefreshToken(User user, String issuer) {
        return JWT.create()
                  .withSubject(user.getUsername())
                  .withExpiresAt(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME_MILLIS))
                  .withIssuer(issuer)
                  .sign(algorithm);
    }

    public DecodedJWT verifyToken(String token) {
        return verifier.verify(token);
    }
}
