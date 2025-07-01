// Popup Script for Claude Email Assistant

document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');
  const toggleButton = document.getElementById('toggleVisibility');

  // Load API Key
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
      showStatus('Please enter an API Key!', 'error');
      return;
    }
    
    // Validate API Key format
    if (!apiKey.startsWith('sk-ant-')) {
      showStatus('API Key should start with "sk-ant-"', 'error');
      return;
    }
    
    try {
      // Save API Key
      await chrome.storage.sync.set({ claudeApiKey: apiKey });
      
      // Skip API validation - often fails due to CORS
      showStatus('✅ API Key saved!', 'success');
      
    } catch (error) {
      showStatus('Error saving: ' + error.message, 'error');
    }
  });

  // Enter Key Handler
  apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveButton.click();
    }
  });

  // Show status
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusDiv.className = 'status';
    }, 5000);
  }

  // Test API Key (optional)
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
      console.error('API Test Error:', error);
      return false;
    }
  }
});