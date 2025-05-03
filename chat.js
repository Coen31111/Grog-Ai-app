const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

function appendMessage(role, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', role);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendTypingDots() {
  const typing = document.createElement('div');
  typing.classList.add('message', 'ai');
  typing.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  typing.id = 'typing-indicator';
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingDots() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

async function sendMessage(message) {
  appendMessage('user', message);
  appendTypingDots();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{
          role: 'user',
          content: message
        }]
      })
    });

    const data = await response.json();
    removeTypingDots();
    const aiReply = data.choices[0].message.content.trim();
    appendMessage('ai', aiReply);

  } catch (error) {
    removeTypingDots();
    appendMessage('ai', 'Error connecting to MindPort.');
    console.error(error);
  }
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message) {
    sendMessage(message);
    userInput.value = '';
  }
});
