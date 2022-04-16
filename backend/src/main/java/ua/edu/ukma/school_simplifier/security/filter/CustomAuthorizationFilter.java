package ua.edu.ukma.school_simplifier.security.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import ua.edu.ukma.school_simplifier.security.jwt.JWTManager;
import ua.edu.ukma.school_simplifier.services.JwtTokenService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static java.util.Arrays.stream;

@Slf4j
public class CustomAuthorizationFilter extends OncePerRequestFilter {

    private final JwtTokenService jwtTokenService;

    private final List<String> ignoredPaths;

    @Autowired
    public CustomAuthorizationFilter(JwtTokenService jwtTokenService) {
        super();
        this.jwtTokenService = jwtTokenService;

        this.ignoredPaths = List.of("/api/login", "/api/token/refresh");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String path = request.getServletPath();
        if(ignoredPaths.contains(path)) {
            filterChain.doFilter(request, response);
        }
        else {
            String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                try {
                    String token = authorizationHeader.substring("Bearer ".length());
                    DecodedJWT decodedJWT = jwtTokenService.verifyToken(token);
                    String username = decodedJWT.getSubject();
                    String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
                    Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    stream(roles).forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    log.info("Current path: {}", request.getServletPath());
                    log.info("authenticated!");
                    filterChain.doFilter(request, response);
                } catch(Exception ex) {
                    log.error("Error logging in: {}", ex.getMessage());
                    response.setHeader("error", ex.getMessage());
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    //response.sendError(HttpStatus.FORBIDDEN.value());
                    Map<String, String> error = new HashMap<>();
                    error.put("error_message", ex.getMessage());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    new ObjectMapper().writeValue(response.getWriter(), error);
                }
            }
            else {
                filterChain.doFilter(request, response);
            }
        }
    }
}
