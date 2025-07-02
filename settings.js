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

// Translate all UI elements
function translateUI() {
  // Translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = chrome.i18n.getMessage(key);
  });
  
  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = chrome.i18n.getMessage(key);
  });
  
  // Update model info with proper translation
  updateModelInfo();
}

// Update model info based on selected model
function updateModelInfo() {
  const modelSelect = document.getElementById('model');
  const modelInfo = document.getElementById('modelInfo');
  const selectedModel = modelSelect.value;
  
  // Map model values to i18n keys
  const modelInfoMap = {
    'claude-3-5-haiku-20241022': 'model_haiku_desc',
    'claude-3-5-sonnet-20241022': 'model_sonnet_desc',
    'claude-3-opus-20240229': 'model_opus_desc'
  };
  
  const infoKey = modelInfoMap[selectedModel];
  if (infoKey) {
    modelInfo.innerHTML = `<span data-i18n="${infoKey}">${chrome.i18n.getMessage(infoKey)}</span>`;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  translateUI();
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
  document.getElementById('model').addEventListener('change', () => {
    updateModelInfo();
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

  // Language change listener
  document.getElementById('language').addEventListener('change', async (e) => {
    // Save the language immediately when changed
    const currentSettings = await getCurrentSettings();
    currentSettings.language = e.target.value;
    await chrome.storage.sync.set({ language: e.target.value });
    
    // Reload the page to apply new language
    window.location.reload();
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
    updateModelInfo();
    
    // Update signature preview
    const signatureInput = document.getElementById('signature');
    if (signatureInput.value.trim()) {
      const preview = document.getElementById('signaturePreview');
      preview.textContent = signatureInput.value;
      preview.style.display = 'block';
    }
    
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus(chrome.i18n.getMessage('save_error'), 'error');
  }
}

// Save Settings
async function saveSettings() {
  try {
    const apiKey = document.getElementById('apiKey').value.trim();
    
    // Validate API Key
    if (!apiKey) {
      showStatus(chrome.i18n.getMessage('api_key_required'), 'error');
      return;
    }
    
    if (!apiKey.startsWith('sk-ant-')) {
      showStatus(chrome.i18n.getMessage('api_key_invalid'), 'error');
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
    
    showStatus(chrome.i18n.getMessage('save_success'), 'success');
    
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus(chrome.i18n.getMessage('save_error') + ': ' + error.message, 'error');
  }
}

// Reset Settings
async function resetSettings() {
  if (confirm(chrome.i18n.getMessage('reset_confirm'))) {
    try {
      await chrome.storage.sync.clear();
      await loadSettings();
      showStatus(chrome.i18n.getMessage('reset_success'), 'success');
    } catch (error) {
      showStatus(chrome.i18n.getMessage('save_error') + ': ' + error.message, 'error');
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