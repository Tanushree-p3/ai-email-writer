AI Email Assistant (100% Offline & Private)

A privacy-focused, full-stack AI browser extension that integrates local Large Language Models directly into the Gmail web client. Powered by Spring Boot, Ollama (gemma3:4b), and Vanilla JavaScript, it allows users to draft smart email replies, summarize threads, and translate responses into regional languages like Hindi and Kannada—completely offline without sending data to external cloud servers.

Privacy & Offline First
* Zero Internet Required for AI: All language processing and generation happens 100% locally on your machine via Ollama.
* Complete Data Privacy: No email content, drafts, or summaries are ever uploaded to third-party cloud APIs (like OpenAI or Claude).

Features
* In-Context Gmail Integration: Injects custom "AI Reply" and "Summarize" buttons directly into Gmail's compose and read toolbars using MutationObserver DOM hooks.
* Multilingual Translation Pipeline: Uses a 2-step prompt engineering pipeline (English reasoning → local script generation) to produce grammatically accurate responses in "Hindi" (हिन्दी), "Kannada" (ಕನ್ನಡ), and "English".
* Smart Summarization: Rapidly extracts 2-sentence summaries from long email threads offline.
* Attachment Safeguards: Automatically detects requests for documents, injects [ATTACH FILE HERE] placeholders, and alerts the user to attach actual files manually.

Tech Stack
* Frontend: Chrome Extension Manifest v3 (JavaScript, HTML, CSS, DOM Manipulation)
* Backend: Java 26, Spring Boot 3.x, Spring WebFlux (WebClient)
* AI Model: Ollama (`gemma3:4b` runs locally)
