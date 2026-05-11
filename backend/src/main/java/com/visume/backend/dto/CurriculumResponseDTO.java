package com.visume.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CurriculumResponseDTO {

    private PersonalInfo personalInfo;
    private List<Experience> experience;
    private List<Education> education;
    private List<String> skills;
    private List<Project> projects;
    private Style style;

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
        private String description;
    }

    @Data
    public static class Education {
        private String institution;
        private String degree;
        private String startDate;
        private String endDate;
    }

    @Data
    public static class Project {
        private String name;
        private String description;
        private List<String> technologies;
        private String url;
    }

    @Data
    public static class Style {
        private String primaryColor;
        private String secondaryColor;
        private String template;   // "minimal", "modern", "creative"
        private String font;
    }
}