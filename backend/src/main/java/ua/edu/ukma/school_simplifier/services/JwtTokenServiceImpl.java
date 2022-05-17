package ua.edu.ukma.school_simplifier.services;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.edu.ukma.school_simplifier.domain.security.TokenPair;
import ua.edu.ukma.school_simplifier.exceptions.InvalidTokenException;
import ua.edu.ukma.school_simplifier.exceptions.TokenNotFoundException;
import ua.edu.ukma.school_simplifier.domain.security.JwtToken;
import ua.edu.ukma.school_simplifier.domain.security.Principal;
import ua.edu.ukma.school_simplifier.repositories.JWTRepository;
import ua.edu.ukma.school_simplifier.security.jwt.JWTManager;
import ua.edu.ukma.school_simplifier.utils.Pair;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class JwtTokenServiceImpl implements JwtTokenService {

    private final JWTRepository jwtRepository;
    private final JWTManager jwtManager;

    private final PrincipalService principalService;

    @Override
    public TokenPair getNewTokens(Principal principal) {
        String accessToken = jwtManager.getAccessToken(principal);
        String refreshToken = jwtManager.getRefreshToken(principal);

        jwtRepository.save(new JwtToken(refreshToken, principal.getId()));

        return new TokenPair(accessToken, refreshToken);
    }

    @Override
    public TokenPair getRefreshedTokens(String refreshToken) {
        try {
            final Optional<JwtToken> prevRefreshToken = jwtRepository.findById(refreshToken);
            if (prevRefreshToken.isPresent()) {
                final String email = getEmail(refreshToken);
                final Principal principal = principalService.getPrincipal(email);
                return getNewTokens(principal);
            } else {
                throw new TokenNotFoundException("Provided refresh token doesn't exist");
            }
        } catch(TokenExpiredException ex) {
            throw ex;
        } catch(JWTVerificationException ex) {
            throw new InvalidTokenException(ex.getMessage());
        }
    }

    @Override
    public String getEmail(String token) {
        try {
            return jwtManager.verifyToken(token)
                    .getSubject();
        } catch(TokenExpiredException ex) {
            throw ex;
        } catch(JWTVerificationException ex) {
            throw new InvalidTokenException(ex.getMessage());
        }
    }

    @Override
    public List<String> getRoles(String accessToken) {
        try {
            return jwtManager.verifyToken(accessToken)
                    .getClaim(JWTManager.CLAIM_ROLES)
                    .asList(String.class);
        } catch(TokenExpiredException ex) {
            throw ex;
        } catch(JWTVerificationException ex) {
            throw new InvalidTokenException(ex.getMessage());
        }
    }

    @Override
    public boolean isValidToken(String token) {
        try {
            DecodedJWT decodedToken = jwtManager.verifyToken(token);
            return true;
        } catch(JWTVerificationException ex) {
            return false;
        }
    }

    @Override
    public boolean isTokenExpired(String token) {
        try {
            final Date now = new Date();
            return jwtManager.verifyToken(token)
                    .getExpiresAt()
                    .before(now);
        } catch(TokenExpiredException ex) {
            return false;
        } catch (JWTVerificationException ex) {
            throw new InvalidTokenException(ex.getMessage());
        }
    }
}
