console.log("Background service worker loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateReply") {
    fetch('http://localhost:8080/api/email/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailContent: request.emailContent,
        tone: request.tone,
        language: request.language
      })
    })
      .then(response => {
        if (!response.ok) throw new Error('Backend error: ' + response.status);
        return response.text();
      })
      .then(data => sendResponse({ success: true, reply: data }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.action === "summarizeEmail") {
    fetch('http://localhost:8080/api/email/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailContent: request.emailContent,
        tone: "",
        language: request.language
      })
    })
      .then(response => {
        if (!response.ok) throw new Error('Backend error: ' + response.status);
        return response.text();
      })
      .then(data => sendResponse({ success: true, summary: data }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});