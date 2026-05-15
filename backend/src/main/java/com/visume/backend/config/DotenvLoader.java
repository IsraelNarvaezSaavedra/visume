package com.visume.backend.config;

import java.nio.file.Files;
import java.nio.file.Path;

import io.github.cdimascio.dotenv.Dotenv;

/**
 * Loads {@code .env} into system properties before Spring starts (only when the
 * key is not already set in the environment or JVM). Compatible with Spring Boot 4.
 */
public final class DotenvLoader {

    private DotenvLoader() {
    }

    public static void loadIfPresent() {
        Path envFile = resolveEnvFile();
        if (envFile == null || !Files.isRegularFile(envFile)) {
            return;
        }
        Dotenv dotenv = Dotenv.configure()
                .directory(envFile.getParent().toString())
                .filename(envFile.getFileName().toString())
                .ignoreIfMalformed()
                .load();
        dotenv.entries().forEach(e -> {
            String key = e.getKey();
            if (System.getenv(key) != null) {
                return;
            }
            if (System.getProperty(key) == null) {
                System.setProperty(key, e.getValue());
            }
        });
    }

    private static Path resolveEnvFile() {
        String userDir = System.getProperty("user.dir", ".");
        Path inCwd = Path.of(userDir, ".env");
        if (Files.isRegularFile(inCwd)) {
            return inCwd;
        }
        Path backendChild = Path.of(userDir, "backend", ".env");
        if (Files.isRegularFile(backendChild)) {
            return backendChild;
        }
        return null;
    }
}
