// Popup Script für Claude Email Assistant

document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');
  const toggleButton = document.getElementById('toggleVisibility');

  // API Key laden
  const result = await chrome.storage.sync.get(['claudeApiKey']);
  if (result.claudeApiKey) {
    apiKeyInput.value = result.claudeApiKey;
  }

  // Toggle Password Visibility
  toggleButton.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      toggleButton.textContent = '🙈';
    } else {
      apiKeyInput.type = 'password';
      toggleButton.textContent = '👁️';
    }
  });

  // Save Button Handler
  saveButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Bitte einen API Key eingeben!', 'error');
      return;
    }
    
    // Validiere API Key Format
    if (!apiKey.startsWith('sk-ant-')) {
      showStatus('API Key sollte mit "sk-ant-" beginnen', 'error');
      return;
    }
    
    try {
      // Speichere API Key
      await chrome.storage.sync.set({ claudeApiKey: apiKey });
      
      // Skip API validation - often fails due to CORS
      showStatus('✅ API Key gespeichert!', 'success');
      
    } catch (error) {
      showStatus('Fehler beim Speichern: ' + error.message, 'error');
    }
  });

  // Enter Key Handler
  apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveButton.click();
    }
  });

  // Status anzeigen
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    // Auto-hide nach 5 Sekunden
    setTimeout(() => {
      statusDiv.className = 'status';
    }, 5000);
  }

  // API Key testen (optional)
  async function testApiKey(apiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 10,
          messages: [{
            role: 'user',
            content: 'Hi'
          }]
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('API Test Fehler:', error);
      return false;
    }
  }
});