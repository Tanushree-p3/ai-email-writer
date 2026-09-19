document.getElementById('generateBtn').addEventListener('click', async () => {
  const emailContent = document.getElementById('emailContent').value;
  const tone = document.getElementById('tone').value;
  const resultDiv = document.getElementById('result');

  if (!emailContent) {
    resultDiv.innerText = 'Please paste an email first.';
    return;
  }

  resultDiv.innerText = 'Generating...';

  try {
    const response = await fetch('http://localhost:8080/api/email/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailContent: emailContent,
        tone: tone,
      }),
    });

    if (!response.ok) {
      throw new Error('Backend error');
    }

    const data = await response.text();
    resultDiv.innerText = data;
  } catch (err) {
    resultDiv.innerText = 'Error: Make sure your backend is running on localhost:8080';
  }
});