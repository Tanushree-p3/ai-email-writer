📧 AI Email Assistant

A privacy-focused, full-stack AI browser extension that integrates local Large Language Models directly into the Gmail web client. Powered by **Spring Boot**, **Ollama (`gemma3:4b`)**, and **Vanilla JavaScript**, it allows users to draft smart email replies, summarize threads, and translate responses into regional languages like **Hindi** and **Kannada**—all while keeping data locally processed.

Features
* In-Context Gmail Integration: Injects custom **AI Reply** and **Summarize** buttons directly into Gmail's compose and read toolbars using MutationObserver DOM hooks.
* Multilingual Translation Pipeline: Uses a 2-step prompt engineering pipeline (English reasoning → local script generation) to produce grammatically accurate responses in **Hindi (हिन्दी)**, **Kannada (ಕನ್ನಡ)**, and **English** without model repetition loops.
* Smart Summarization: Rapidly extracts 2-sentence summaries from long email threads.
* Attachment Safeguards: Automatically detects requests for documents, injects [ATTACH FILE HERE] placeholders, and alerts the user to attach actual files manually.
* Local LLM Processing: Connects to a locally hosted Ollama instance running gemma3:4b via Spring Boot WebClient for enhanced privacy and zero third-party API costs.

Tech Stack
* Frontend: Chrome Extension Manifest v3 (JavaScript, HTML, CSS, DOM Manipulation)
* Backend: Java 26, Spring Boot 3.x, Spring WebFlux (WebClient)
* AI Model: Ollama (gemma3:4b)
