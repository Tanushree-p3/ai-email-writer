package com.email.writer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailGeneratorService {

    private static final String MODEL = "gemma3:4b";
    private final WebClient webClient = WebClient.builder()
            .baseUrl("http://localhost:11434")
            .build();

    public String generateEmailReply(String emailContent, String tone, String language) {
        if (language == null || language.isBlank()) language = "English";

        // Step 1: Draft clean English reply first
        String englishReply = callOllama(buildEnglishReplyPrompt(emailContent, tone));

        // Step 2: If target language is English, return directly; otherwise translate
        String finalReply;
        if ("English".equalsIgnoreCase(language)) {
            finalReply = englishReply;
        } else {
            finalReply = callOllama(buildTranslationPrompt(englishReply, language));
        }

        return addAttachmentWarningIfNeeded(finalReply);
    }

    public String summarizeEmail(String emailContent, String language) {
        if (language == null || language.isBlank()) language = "English";

        String summary = callOllama(buildEnglishSummaryPrompt(emailContent));
        if (!"English".equalsIgnoreCase(language)) {
            summary = callOllama(buildTranslationPrompt(summary, language));
        }
        return summary;
    }

    private String callOllama(String prompt) {
        String requestBody = "{"
                + "\"model\": \"" + MODEL + "\","
                + "\"prompt\": \"" + escapeJson(prompt) + "\","
                + "\"stream\": false,"
                + "\"options\": {"
                + "  \"temperature\": 0.2,"
                + "  \"repeat_penalty\": 1.2"
                + "}"
                + "}";

        OllamaResponse response = webClient.post()
                .uri("/api/generate")
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(OllamaResponse.class)
                .block();

        return response != null ? response.getResponse() : "No response generated";
    }

    private String buildEnglishReplyPrompt(String emailContent, String tone) {
        if (tone == null || tone.isBlank()) tone = "formal";
        return """
            You are an email assistant. Write a short, clear email reply in English to the message below.
            
            Strict Guidelines:
            1. Tone: %1$s.
            2. Do NOT claim to attach files or send attachments. You have no files. If a file or syllabus is requested, state that it will be provided shortly and insert '[ATTACH FILE HERE]'.
            3. Output ONLY the response text.
            
            Email:
            %2$s
            """.formatted(tone, emailContent);
    }

    private String buildEnglishSummaryPrompt(String emailContent) {
        return """
            Summarize the email below in 2 short, clear sentences in English.
            Output ONLY the summary text.
            
            Email:
            %1$s
            """.formatted(emailContent);
    }

    private String buildTranslationPrompt(String text, String targetLanguage) {
        return """
            Translate the following text accurately into %1$s.
            
            Rules:
            1. Use ONLY native %1$s script (e.g., Kannada script for Kannada, Devanagari script for Hindi).
            2. Preserve formatting, tone, and placeholders like [ATTACH FILE HERE].
            3. Do not add explanations, notes, or repeated words. Output ONLY the translated text.
            
            Text:
            %2$s
            """.formatted(targetLanguage, text);
    }

    private String addAttachmentWarningIfNeeded(String reply) {
        if (reply == null) return reply;
        String lower = reply.toLowerCase();
        String[] words = {"attached", "attachment", "enclosed",
                "संलग्न", "अटैच", "ಲಗತ್ತಿಸ", "ಲಗತ್ತು", "ಅಟ್ಯಾಚ್"};
        for (String w : words) {
            if (lower.contains(w)) {
                return reply + "\n\n[Note: This AI cannot attach files. If this reply mentions an attachment, attach the file yourself before sending.]";
            }
        }
        return reply;
    }

    private String escapeJson(String text) {
        StringBuilder sb = new StringBuilder();
        for (char c : text.toCharArray()) {
            switch (c) {
                case '\\' -> sb.append("\\\\");
                case '"'  -> sb.append("\\\"");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
                    else sb.append(c);
                }
            }
        }
        return sb.toString();
    }
}