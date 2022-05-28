package ua.edu.ukma.school_simplifier.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import ua.edu.ukma.school_simplifier.security.filter.JwtAuthorizationFilter;
import ua.edu.ukma.school_simplifier.services.JwtTokenService;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;
    private final JwtTokenService jwtTokenService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        JwtAuthorizationFilter authorizationFilter = new JwtAuthorizationFilter(jwtTokenService);

        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        corsConfiguration.setAllowedOriginPatterns(List.of("*"));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setExposedHeaders(List.of("Authorization"));

        http.csrf().disable();
        http.cors().configurationSource(request -> corsConfiguration);
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/students/*").hasAuthority("STUDENT");
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/teachers").hasAuthority("HEAD_TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/teachers/*").hasAuthority("TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/formteachers/*").hasAuthority("FORM_TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/headteachers/*").hasAuthority("HEAD_TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/marks*").hasAuthority("TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/schedule*").hasAuthority("HEAD_TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/lessons*").hasAuthority("HEAD_TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/schoolClasses*").hasAuthority("HEAD_TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/classGroups*").hasAuthority("HEAD_TEACHER");
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/authentication/login",
                                                                         "/api/authentication/refresh"
                                            ).permitAll();
        http.authorizeRequests().anyRequest().permitAll();
        http.addFilterBefore(authorizationFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
