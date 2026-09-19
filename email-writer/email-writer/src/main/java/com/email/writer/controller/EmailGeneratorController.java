package com.email.writer.controller;

import com.email.writer.service.EmailGeneratorService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/email")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    public EmailGeneratorController(EmailGeneratorService emailGeneratorService) {
        this.emailGeneratorService = emailGeneratorService;
    }

    @PostMapping("/generate")
    public String generateEmail(@RequestBody EmailRequest request) {
        return emailGeneratorService.generateEmailReply(
                request.getEmailContent(), request.getTone(), request.getLanguage());
    }

    @PostMapping("/summarize")
    public String summarizeEmail(@RequestBody EmailRequest request) {
        return emailGeneratorService.summarizeEmail(
                request.getEmailContent(), request.getLanguage());
    }
}