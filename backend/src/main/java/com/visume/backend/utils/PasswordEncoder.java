package com.visume.backend.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordEncoder {
    
    private static final String ALGORITHM = "SHA-256";
    private static final int SALT_LENGTH = 16;
    
    /**
     * Encripta una contraseña con salt
     * @param password Contraseña sin encriptar
     * @return Contraseña encriptada con salt
     */
    public static String encodePassword(String password) {
        try {
            // Generar un salt aleatorio
            byte[] salt = new byte[SALT_LENGTH];
            SecureRandom random = new SecureRandom();
            random.nextBytes(salt);
            
            // Crear MessageDigest con SHA-256
            MessageDigest md = MessageDigest.getInstance(ALGORITHM);
            md.update(salt);
            
            // Encriptar la contraseña
            byte[] hashedPassword = md.digest(password.getBytes());
            
            // Combinar salt + contraseña encriptada
            byte[] saltAndPassword = new byte[salt.length + hashedPassword.length];
            System.arraycopy(salt, 0, saltAndPassword, 0, salt.length);
            System.arraycopy(hashedPassword, 0, saltAndPassword, salt.length, hashedPassword.length);
            
            // Codificar en Base64
            return Base64.getEncoder().encodeToString(saltAndPassword);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al encriptar la contraseña", e);
        }
    }
    
    /**
     * Verifica si una contraseña coincide con su versión encriptada
     * @param password Contraseña sin encriptar
     * @param encodedPassword Contraseña encriptada almacenada
     * @return true si coinciden, false en caso contrario
     */
    public static boolean matchesPassword(String password, String encodedPassword) {
        try {
            // Decodificar de Base64
            byte[] saltAndPassword = Base64.getDecoder().decode(encodedPassword);
            
            // Extraer el salt (primeros 16 bytes)
            byte[] salt = new byte[SALT_LENGTH];
            System.arraycopy(saltAndPassword, 0, salt, 0, SALT_LENGTH);
            
            // Encriptar la contraseña ingresada con el mismo salt
            MessageDigest md = MessageDigest.getInstance(ALGORITHM);
            md.update(salt);
            byte[] hashedPassword = md.digest(password.getBytes());
            
            // Comparar los hashes
            byte[] storedHash = new byte[saltAndPassword.length - SALT_LENGTH];
            System.arraycopy(saltAndPassword, SALT_LENGTH, storedHash, 0, storedHash.length);
            
            return MessageDigest.isEqual(hashedPassword, storedHash);
        } catch (IllegalArgumentException | NoSuchAlgorithmException e) {
            return false;
        }
    }
}
