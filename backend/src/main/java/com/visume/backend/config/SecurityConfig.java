package com.visume.backend.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Desactivamos CSRF (obligatorio para que React pueda hacer POST)
            .csrf(csrf -> csrf.disable())
            
            // 2. Activamos CORS con la configuración que definimos abajo
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 3. Permitimos el acceso a todas las rutas sin autenticación
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            
            // 4. Desactivamos el formulario de login y el popup de autenticación básica
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permitimos el origen de tu servidor de Azure y localhost por si pruebas en local
        configuration.setAllowedOrigins(Arrays.asList(
            "http://isra.francecentral.cloudapp.azure.com",
            "http://localhost:5173", // Puerto común de Vite
            "http://localhost:3000"  // Puerto común de Create React App
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}