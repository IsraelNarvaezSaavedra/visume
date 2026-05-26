package com.visume.backend.dto;

import lombok.Data;

@Data
public class StripeDTO {
    private String sessionId;
    private String url;
    private String publishableKey;
}