package ua.edu.ukma.school_simplifier.security.filter;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import ua.edu.ukma.school_simplifier.domain.dto.error.ErrorResponse;
import ua.edu.ukma.school_simplifier.exceptions.InvalidTokenException;
import ua.edu.ukma.school_simplifier.services.JwtTokenService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

@Slf4j
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private static final List<String> ignoredPaths = List.of("/api/authentication/login",
                                                             "/api/authentication/refresh");
    private static final String BEARER_STR = "Bearer ";
    private static final int BEARER_LENGTH = BEARER_STR.length();

    private final JwtTokenService jwtTokenService;

    @Autowired
    public JwtAuthorizationFilter(JwtTokenService jwtTokenService) {
        super();
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String path = request.getServletPath();
        if(ignoredPaths.contains(path)) {
            filterChain.doFilter(request, response);
        }
        else {
            String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if(authorizationHeader != null && authorizationHeader.startsWith(BEARER_STR)) {
                try {
                    String accessToken = authorizationHeader.substring(BEARER_LENGTH);
                    String email = jwtTokenService.getEmail(accessToken);
                    List<String> roles = jwtTokenService.getRoles(accessToken);
                    Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    roles.stream().forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    log.info("Current path: {}", request.getServletPath());
                    log.info("authorized!");
                    filterChain.doFilter(request, response);
                } catch(InvalidTokenException ex) {
                    log.error("Error logging in: {}", ex.getMessage());
                    int responseStatus = HttpStatus.FORBIDDEN.value();
                    response.setStatus(responseStatus);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    final ErrorResponse errorResponse = new ErrorResponse(responseStatus, ex.getMessage());
                    new ObjectMapper().writeValue(response.getWriter(), errorResponse);
                }
            }
            else {
                filterChain.doFilter(request, response);
            }
        }
    }
}
