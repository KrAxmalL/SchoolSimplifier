package ua.edu.ukma.school_simplifier.security.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import ua.edu.ukma.school_simplifier.models.security.User;
import ua.edu.ukma.school_simplifier.security.jwt.JWTManager;
import ua.edu.ukma.school_simplifier.services.JwtTokenService;
import ua.edu.ukma.school_simplifier.utils.Pair;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;

    private final ObjectMapper mapper;

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager, JwtTokenService jwtTokenService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;

        mapper = new ObjectMapper();
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
       try {
           final ObjectNode body = mapper.readValue(request.getReader(), ObjectNode.class);
           final String email = body.get("email").asText();
           final String password = body.get("password").asText();

           log.info("Email is: {}", email);
           log.info("Password is: {}", password);

           UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
           return authenticationManager.authenticate(authenticationToken);

       } catch (IOException e) {
           e.printStackTrace();
           return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken("", ""));
       }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException {
        User user = (User) authResult.getPrincipal();
        String issuer = request.getRequestURL().toString();
        log.info("Password in successfull auth: {}", user.getPassword());
        user.getAuthorities().forEach(role -> log.info("Roles: {}", role.toString()));

        Pair<String ,String> tokensString = jwtTokenService.getNewTokens(user, issuer);

        Map<String, String> tokensMap = new HashMap<>();
        tokensMap.put("accessToken", tokensString.getFirst());
        tokensMap.put("refreshToken", tokensString.getSecond());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getWriter(), tokensMap);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        log.info("Authentication failed!!!");
        log.info(failed.getMessage());
        super.unsuccessfulAuthentication(request, response, failed);
    }
}
