package ua.edu.ukma.school_simplifier.services;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.exceptions.InvalidTokenException;
import ua.edu.ukma.school_simplifier.exceptions.TokenNotFoundException;
import ua.edu.ukma.school_simplifier.models.JwtToken;
import ua.edu.ukma.school_simplifier.models.security.User;
import ua.edu.ukma.school_simplifier.repositories.JWTRepository;
import ua.edu.ukma.school_simplifier.security.jwt.JWTManager;
import ua.edu.ukma.school_simplifier.utils.Pair;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Optional;

import static java.util.Arrays.stream;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class JwtTokenServiceImpl implements JwtTokenService {

    private final JWTRepository jwtRepository;
    private final JWTManager jwtManager;

    private final UserService userService;

    @Override
    public Pair<String, String> getNewTokens(User user, String issuer) {
        String accessToken = jwtManager.getAccessToken(user, issuer);
        String refreshToken = jwtManager.getRefreshToken(user, issuer);

        final JwtToken storedRefreshToken = new JwtToken(refreshToken, user.getId());
        jwtRepository.deleteTokenForUser(user.getId());
        jwtRepository.save(storedRefreshToken);

        return new Pair<>(accessToken, refreshToken);
    }

    @Override
    public Pair<String, String> getRefreshedTokens(String refreshToken) {
        DecodedJWT decodedToken;
        try {
            decodedToken = verifyToken(refreshToken);
        } catch(TokenExpiredException ex) {
            throw ex;
        } catch(Exception ex) {
            throw new InvalidTokenException(ex.getMessage());
        }

        final String username = decodedToken.getSubject();
        final User user = userService.getUser(username);
        final String issuer = decodedToken.getIssuer();

        final Optional<JwtToken> prevRefreshToken = jwtRepository.findById(refreshToken);
        if (prevRefreshToken.isPresent()) {
            return getNewTokens(user, issuer);
        } else {
            throw new TokenNotFoundException("Provided refresh token doesn't exist!");
        }
    }

    @Override
    public DecodedJWT verifyToken(String token) {
        return jwtManager.verifyToken(token);
    }

    @Override
    public boolean tokenExpired(String token) {
        DecodedJWT decodedToken = verifyToken(token);
        return tokenExpired(decodedToken);
    }

    @Override
    public boolean tokenExpired(DecodedJWT token) {
        return token.getExpiresAt().before(new Date());
    }


}
