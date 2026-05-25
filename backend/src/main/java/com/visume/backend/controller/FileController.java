package com.visume.backend.controller;

import com.visume.backend.entities.CurriculumFotos;
import com.visume.backend.entities.Curriculums;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.CurriculumFotosRepository;
import com.visume.backend.repositories.CurriculumsRepository;
import com.visume.backend.repositories.UsuariosRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    @Value("${file.upload.dir}")
    private String uploadDir;
    private final CurriculumsRepository curriculumsRepo;
    private final CurriculumFotosRepository fotosRepo;
    private final UsuariosRepository usuariosRepo;

    public FileController(UsuariosRepository usuariosRepo,
            CurriculumsRepository curriculumsRepo,
            CurriculumFotosRepository fotosRepo) {
        this.usuariosRepo = usuariosRepo;
        this.curriculumsRepo = curriculumsRepo;
        this.fotosRepo = fotosRepo;
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> subirAvatar(@RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal String username) {
        try {
            String url = guardarArchivo(file, "avatars");
            Usuarios usuario = usuariosRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            usuario.setFotoUrl(url);
            usuario.setFotoActualizada(java.time.LocalDateTime.now());
            usuariosRepo.save(usuario);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/proyecto")
    public ResponseEntity<?> subirFotoProyecto(@RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal String username) {
        try {
            // Solo usuarios premium pueden subir fotos de proyectos
            Usuarios usuario = usuariosRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            if (!usuario.isEstaPagando()) {
                return ResponseEntity.status(403).body("Solo disponible en plan Premium");
            }
            String url = guardarArchivo(file, "proyectos");
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{carpeta}/{filename}")
    public ResponseEntity<Resource> servirArchivo(@PathVariable String carpeta,
            @PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(carpeta).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists())
                return ResponseEntity.notFound().build();

            String contentType = Files.probeContentType(filePath);
            if (contentType == null)
                contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/curriculum/{idCurriculum}/foto")
    public ResponseEntity<?> subirFotoCurriculum(
            @PathVariable Integer idCurriculum,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "esPrincipal", defaultValue = "false") boolean esPrincipal,
            @AuthenticationPrincipal String username) {
        try {
            Usuarios usuario = usuariosRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Curriculums curriculum = curriculumsRepo.findById(idCurriculum)
                    .orElseThrow(() -> new RuntimeException("Currículum no encontrado"));

            // Verificar que el curriculum pertenece al usuario
            if (!curriculum.getUsuario().getUsername().equals(username)) {
                return ResponseEntity.status(403).body("No tienes permiso sobre este currículum");
            }

            // Verificar límite de fotos según plan
            int maxFotosGaleria = usuario.getPlan() != null
                    ? usuario.getPlan().getMaxFotosCv()
                    : (usuario.isEstaPagando() ? 6 : 0);
            int fotosGaleriaActuales = fotosRepo.countByCurriculumIdCurriculumAndEsPrincipalFalse(idCurriculum);
            int fotosPrincipalesActuales = fotosRepo.countByCurriculumIdCurriculumAndEsPrincipalTrue(idCurriculum);

            if (esPrincipal) {
                // Foto de perfil: solo puede haber 1, siempre permitida (reemplaza la anterior si existe)
                if (fotosPrincipalesActuales > 0) {
                    // Eliminar la anterior antes de guardar la nueva
                    fotosRepo.findByCurriculumIdCurriculumAndEsPrincipalTrue(idCurriculum)
                            .ifPresent(fotoAnterior -> {
                                try {
                                    Path p = Paths.get(uploadDir)
                                            .resolve(fotoAnterior.getUrl().replace("/api/files/", ""));
                                    Files.deleteIfExists(p);
                                } catch (IOException ignored) {
                                }
                                fotosRepo.delete(fotoAnterior);
                            });
                }
            } else {
                // Foto de galería: verificar límite del plan
                if (maxFotosGaleria <= 0) {
                    return ResponseEntity.status(403).body(
                            Map.of("error", "Las fotos de galería son exclusivas del plan Premium"));
                }
                if (fotosGaleriaActuales >= maxFotosGaleria) {
                    return ResponseEntity.status(403).body(
                            Map.of("error", "Límite de fotos de galería alcanzado",
                                    "limite", maxFotosGaleria,
                                    "plan", usuario.getPlan().getNombre()));
                }
            }

            // Quitar el "la primera es siempre principal" — ahora esPrincipal viene
            // explícito
            String url = guardarArchivo(file, "curriculum-fotos");

            CurriculumFotos foto = new CurriculumFotos();
            foto.setCurriculum(curriculum);
            foto.setUrl(url);
            foto.setEsPrincipal(esPrincipal);
            foto.setOrden(esPrincipal ? 0 : fotosGaleriaActuales);
            fotosRepo.save(foto);

            return ResponseEntity.ok(Map.of(
                    "id", foto.getIdFoto(),
                    "url", url,
                    "esPrincipal", foto.isEsPrincipal(),
                    "orden", foto.getOrden()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/curriculum/{idCurriculum}/fotos")
    public ResponseEntity<?> listarFotos(@PathVariable Integer idCurriculum,
            @AuthenticationPrincipal String username) {
        // Verificar pertenencia
        Curriculums curriculum = curriculumsRepo.findById(idCurriculum)
                .orElseThrow(() -> new RuntimeException("Currículum no encontrado"));
        if (!curriculum.getUsuario().getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }

        List<CurriculumFotos> fotos = fotosRepo
                .findByCurriculumIdCurriculumOrderByOrdenAsc(idCurriculum);

        List<Map<String, Object>> resultado = fotos.stream().map(f -> Map.<String, Object>of(
                "id", f.getIdFoto(),
                "url", f.getUrl(),
                "esPrincipal", f.isEsPrincipal(),
                "orden", f.getOrden())).toList();

        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/curriculum/foto/{idFoto}")
    public ResponseEntity<?> eliminarFoto(@PathVariable Integer idFoto,
            @AuthenticationPrincipal String username) {
        CurriculumFotos foto = fotosRepo.findById(idFoto)
                .orElseThrow(() -> new RuntimeException("Foto no encontrada"));

        if (!foto.getCurriculum().getUsuario().getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }

        // Borrar fichero del disco
        try {
            Path filePath = Paths.get(uploadDir)
                    .resolve(foto.getUrl().replace("/api/files/", ""));
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
        }

        fotosRepo.delete(foto);
        return ResponseEntity.ok(Map.of("eliminado", true));
    }

    private String guardarArchivo(MultipartFile file, String subcarpeta) throws IOException {
        // Validar que es imagen
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Solo se permiten imágenes");
        }

        // Crear directorio si no existe
        Path uploadPath = Paths.get(uploadDir).resolve(subcarpeta);
        Files.createDirectories(uploadPath);

        // Nombre único
        String extension = file.getOriginalFilename() != null
                ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'))
                : ".jpg";
        String filename = UUID.randomUUID().toString() + extension;

        // Guardar
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/api/files/" + subcarpeta + "/" + filename;
    }
}