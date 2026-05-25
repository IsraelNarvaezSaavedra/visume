package com.visume.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CurriculumResponseDTO {

    private Integer id;
    private PersonalInfo personalInfo;
    private List<Experience> experience;
    private List<Education> education;
    private Skills skills;
    private List<Project> projects;
    private List<Certification> certifications;
    private List<Language> languages;
    private List<String> interests;
    private Style style;
    private String fotoPrincipal;
    private List<String> fotosGaleria;

    @Data
    public static class PersonalInfo {
        private String name;
        private String title;
        private String bio;
        private String email;
        private String phone;
        private String location;
        private String linkedin;
        private String github;
        private String website;
    }

    @Data
    public static class Experience {
        private String company;
        private String position;
        private String startDate;
        private String endDate;
        private String location;
        private String description;
        private List<String> achievements;
    }

    @Data
    public static class Education {
        private String institution;
        private String degree;
        private String field;
        private String startDate;
        private String endDate;
        private String location;
        private String description;
    }

    @Data
    public static class Skills {
        private List<String> technical;
        private List<String> soft;
        private List<String> languages;
        private List<String> tools;
    }

    @Data
    public static class Project {
        private String name;
        private String description;
        private List<String> technologies;
        private String url;
        private String startDate;
        private String endDate;
    }

    @Data
    public static class Certification {
        private String name;
        private String issuer;
        private String date;
        private String url;
    }

    @Data
    public static class Language {
        private String language;
        private String level;
    }

    @Data
    public static class Style {
        private String primaryColor;
        private String secondaryColor;
        private String template;
        private String font;
    }
}