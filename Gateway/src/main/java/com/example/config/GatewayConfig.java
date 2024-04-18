package com.example.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;

@Configuration
@EnableWebFluxSecurity
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("authentication", r -> r.path("/auth/**")
                        .uri("http://localhost:8081"))
                .route("user-management", r -> r.path("/user-management/**")
                        .uri("http://localhost:8082"))
                .build();
    }

    @Bean
    public CorsWebFilter corsFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.addAllowedOrigin("*"); // Allow all origins
        corsConfig.addAllowedMethod("*"); // Allow all HTTP methods
        corsConfig.addAllowedHeader("*"); // Allow all headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(csrf -> csrf.disable());
        return http.build();
    }
}
