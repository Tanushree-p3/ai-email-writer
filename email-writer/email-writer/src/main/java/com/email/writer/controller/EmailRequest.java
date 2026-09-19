
package com.email.writer.controller;

public class EmailRequest {
    private String emailContent;
    private String tone;
    private String language;

    public String getEmailContent() { return emailContent; }
    public void setEmailContent(String emailContent) { this.emailContent = emailContent; }
    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}