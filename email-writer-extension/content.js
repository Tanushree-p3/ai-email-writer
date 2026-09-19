console.log("AI Email Assistant extension loaded on Gmail");

function injectAIButton() {
  const toolbars = document.querySelectorAll('div.dC');
  toolbars.forEach(toolbar => {
    if (toolbar.querySelector('.ai-reply-btn')) return;

    const sendButton = toolbar.querySelector('div[role="button"]');
    if (!sendButton) return;

    const baseStyle = `
      display: inline-flex; align-items: center; justify-content: center;
      margin-left: 8px; padding: 0 16px; height: 36px;
      background-color: #f1f3f4; color: #3c4043; border-radius: 18px;
      font-family: Google Sans, Roboto, Arial, sans-serif; font-size: 14px;
      font-weight: 500; cursor: pointer; user-select: none;
    `;

    const aiButton = document.createElement('div');
    aiButton.className = 'ai-reply-btn';
    aiButton.innerText = 'AI Reply';
    aiButton.style.cssText = baseStyle;

    const summarizeButton = document.createElement('div');
    summarizeButton.className = 'ai-summarize-btn';
    summarizeButton.innerText = 'Summarize';
    summarizeButton.style.cssText = baseStyle;

    const langSelect = document.createElement('select');
    langSelect.className = 'ai-lang-select';
    langSelect.style.cssText = `
      margin-left: 8px; height: 36px; padding: 0 10px; border-radius: 18px;
      border: 1px solid #dadce0; background-color: #f1f3f4; color: #3c4043;
      font-family: Google Sans, Roboto, Arial, sans-serif; font-size: 14px; cursor: pointer;
    `;

    [['English', 'English'], ['Hindi', 'Hindi (हिन्दी)'], ['Kannada', 'Kannada (ಕನ್ನಡ)']].forEach(([value, label]) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label;
      langSelect.appendChild(opt);
    });

    langSelect.value = localStorage.getItem('aiEmailLanguage') || 'English';
    langSelect.addEventListener('change', () => {
      localStorage.setItem('aiEmailLanguage', langSelect.value);
    });

    function getEmailContent() {
      const el = document.querySelector('.a3s.aiL');
      return el ? el.innerText : '';
    }

    function insertIntoComposeBox(text) {
      const composeBox = document.querySelector('div[contenteditable="true"][role="textbox"][aria-label="Message Body"]');
      if (composeBox) {
        composeBox.focus();
        document.execCommand('insertText', false, text);
      }
    }

    aiButton.addEventListener('click', () => {
      aiButton.innerText = 'Generating...';
      const emailContent = getEmailContent();
      if (!emailContent) {
        aiButton.innerText = 'No email found';
        setTimeout(() => { aiButton.innerText = 'AI Reply'; }, 2000);
        return;
      }

      chrome.runtime.sendMessage(
        { action: "generateReply", emailContent, tone: "formal", language: langSelect.value },
        (response) => {
          if (response && response.success) {
            insertIntoComposeBox(response.reply);
            aiButton.innerText = 'AI Reply';
          } else {
            aiButton.innerText = 'Error - check backend';
            setTimeout(() => { aiButton.innerText = 'AI Reply'; }, 3000);
          }
        }
      );
    });

    summarizeButton.addEventListener('click', () => {
      summarizeButton.innerText = 'Summarizing...';
      const emailContent = getEmailContent();
      if (!emailContent) {
        summarizeButton.innerText = 'No email found';
        setTimeout(() => { summarizeButton.innerText = 'Summarize'; }, 2000);
        return;
      }

      chrome.runtime.sendMessage(
        { action: "summarizeEmail", emailContent, language: langSelect.value },
        (response) => {
          if (response && response.success) {
            alert("Summary:\n\n" + response.summary);
            summarizeButton.innerText = 'Summarize';
          } else {
            summarizeButton.innerText = 'Error - check backend';
            setTimeout(() => { summarizeButton.innerText = 'Summarize'; }, 3000);
          }
        }
      );
    });

    toolbar.appendChild(aiButton);
    toolbar.appendChild(summarizeButton);
    toolbar.appendChild(langSelect);
  });
}

const observer = new MutationObserver(() => { injectAIButton(); });
observer.observe(document.body, { childList: true, subtree: true });
injectAIButton();