// Settings Script for Claude Email Assistant

// Default Settings
const DEFAULT_SETTINGS = {
  apiKey: '',
  model: 'claude-3-5-haiku-20241022',
  maxTokens: 1000,
  responseStyle: 'professional',
  signature: '',
  defaultSender: '',
  customPrompt: '',
  language: 'en'
};

// Model Info
const MODEL_INFO = {
  'claude-3-5-haiku-20241022': 'Fastest and most affordable option',
  'claude-3-5-sonnet-20241022': 'Balanced: Speed and quality',
  'claude-3-opus-20240229': 'Highest quality for complex responses'
};

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  // API Key Toggle
  document.getElementById('toggleApiKey').addEventListener('click', () => {
    const input = document.getElementById('apiKey');
    const button = document.getElementById('toggleApiKey');
    
    if (input.type === 'password') {
      input.type = 'text';
      button.textContent = '🙈';
    } else {
      input.type = 'password';
      button.textContent = '👁️';
    }
  });

  // Model Info Update
  document.getElementById('model').addEventListener('change', (e) => {
    const info = MODEL_INFO[e.target.value];
    document.getElementById('modelInfo').textContent = info;
  });

  // Max Tokens Slider
  const maxTokensSlider = document.getElementById('maxTokens');
  const maxTokensValue = document.getElementById('maxTokensValue');
  
  maxTokensSlider.addEventListener('input', (e) => {
    maxTokensValue.textContent = e.target.value;
  });

  // Signature Preview
  document.getElementById('signature').addEventListener('input', (e) => {
    const preview = document.getElementById('signaturePreview');
    if (e.target.value.trim()) {
      preview.textContent = e.target.value;
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  });

  // Save Button
  document.getElementById('saveButton').addEventListener('click', saveSettings);

  // Reset Button
  document.getElementById('resetButton').addEventListener('click', resetSettings);

  // Enter Key in API Key
  document.getElementById('apiKey').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveSettings();
    }
  });
}

// Load Settings
async function loadSettings() {
  try {
    const stored = await chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS));
    const settings = { ...DEFAULT_SETTINGS, ...stored };
    
    // Apply settings to form
    document.getElementById('apiKey').value = settings.apiKey || '';
    document.getElementById('model').value = settings.model;
    document.getElementById('maxTokens').value = settings.maxTokens;
    document.getElementById('maxTokensValue').textContent = settings.maxTokens;
    document.getElementById('responseStyle').value = settings.responseStyle;
    document.getElementById('signature').value = settings.signature || '';
    document.getElementById('defaultSender').value = settings.defaultSender || '';
    document.getElementById('customPrompt').value = settings.customPrompt || '';
    document.getElementById('language').value = settings.language;
    
    // Update model info
    const modelInfo = MODEL_INFO[settings.model];
    document.getElementById('modelInfo').textContent = modelInfo;
    
    // Update signature preview
    const signatureInput = document.getElementById('signature');
    if (signatureInput.value.trim()) {
      const preview = document.getElementById('signaturePreview');
      preview.textContent = signatureInput.value;
      preview.style.display = 'block';
    }
    
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('Error loading settings', 'error');
  }
}

// Save Settings
async function saveSettings() {
  try {
    const apiKey = document.getElementById('apiKey').value.trim();
    
    // Validate API Key
    if (!apiKey) {
      showStatus('Please enter an API Key!', 'error');
      return;
    }
    
    if (!apiKey.startsWith('sk-ant-')) {
      showStatus('API Key should start with "sk-ant-"', 'error');
      return;
    }
    
    // Collect all settings
    const settings = {
      apiKey: apiKey,
      model: document.getElementById('model').value,
      maxTokens: parseInt(document.getElementById('maxTokens').value),
      responseStyle: document.getElementById('responseStyle').value,
      signature: document.getElementById('signature').value.trim(),
      defaultSender: document.getElementById('defaultSender').value.trim(),
      customPrompt: document.getElementById('customPrompt').value.trim(),
      language: document.getElementById('language').value
    };
    
    // Save to storage
    await chrome.storage.sync.set(settings);
    
    // For backward compatibility, also save claudeApiKey
    await chrome.storage.sync.set({ claudeApiKey: apiKey });
    
    showStatus('✅ Settings saved!', 'success');
    
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving: ' + error.message, 'error');
  }
}

// Reset Settings
async function resetSettings() {
  if (confirm('Really reset all settings?')) {
    try {
      await chrome.storage.sync.clear();
      await loadSettings();
      showStatus('Settings reset', 'success');
    } catch (error) {
      showStatus('Error resetting: ' + error.message, 'error');
    }
  }
}

// Show Status Message
function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusDiv.className = 'status';
  }, 5000);
}

// Helper: Get current settings
async function getCurrentSettings() {
  const stored = await chrome.storage.sync.get(Object.keys(DEFAULT_SETTINGS));
  return { ...DEFAULT_SETTINGS, ...stored };
}