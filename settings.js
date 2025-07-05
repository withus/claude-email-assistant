// Settings Script for Claude Email Assistant

// Default Settings
const DEFAULT_SETTINGS = {
  apiKey: '',
  model: 'claude-3-5-haiku-20241022',
  maxTokens: 1000,
  responseStyle: 'professional',
  signature: '', // Legacy single signature
  signatures: [], // New: Array of signature objects
  defaultSender: '',
  customPrompt: '',
  language: 'en'
};

// Default signature structure
const DEFAULT_SIGNATURE = {
  id: Date.now(),
  title: '',
  content: '',
  isHtml: false
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

// Global variables
let signatures = [];
let nextSignatureId = 1;

// Render all signatures
function renderSignatures() {
  const container = document.getElementById('signaturesContainer');
  container.innerHTML = '';
  
  if (signatures.length === 0) {
    // Add a default signature if none exist
    addNewSignature();
    return;
  }
  
  signatures.forEach((sig, index) => {
    const sigDiv = createSignatureElement(sig, index);
    container.appendChild(sigDiv);
  });
}

// Create signature element
function createSignatureElement(signature, index) {
  const div = document.createElement('div');
  div.className = 'signature-item';
  div.dataset.signatureId = signature.id;
  
  div.innerHTML = `
    <div class="signature-header">
      <input type="text" class="signature-title-input" 
        value="${signature.title || chrome.i18n.getMessage('signature_default_title') || 'Signature ' + (index + 1)}" 
        placeholder="${chrome.i18n.getMessage('signature_title_placeholder') || 'Signature name...'}">
      <div class="signature-actions">
        <button type="button" class="signature-btn html-toggle" data-html="${signature.isHtml || false}">
          ${chrome.i18n.getMessage('toggle_html') || 'HTML'}
        </button>
        <button type="button" class="signature-btn" onclick="insertHtmlTag(this, '<br>')" ${!signature.isHtml ? 'style="display:none;"' : ''}>BR</button>
        <button type="button" class="signature-btn" onclick="insertHtmlTag(this, '<b></b>')" ${!signature.isHtml ? 'style="display:none;"' : ''}>B</button>
        <button type="button" class="signature-btn" onclick="insertHtmlTag(this, '<a href=\"\"></a>')" ${!signature.isHtml ? 'style="display:none;"' : ''}>Link</button>
        <button type="button" class="signature-btn delete">
          ${chrome.i18n.getMessage('delete') || 'Delete'}
        </button>
      </div>
    </div>
    <textarea class="signature-textarea" placeholder="${chrome.i18n.getMessage('placeholder_signature')}">${signature.content || ''}</textarea>
    <div class="signature-preview-small"></div>
  `;
  
  // Setup event listeners for this signature
  setupSignatureEventListeners(div, signature);
  
  // Update preview
  updateSingleSignaturePreview(div, signature);
  
  return div;
}

// Setup event listeners for a signature element
function setupSignatureEventListeners(element, signature) {
  const titleInput = element.querySelector('.signature-title-input');
  const textarea = element.querySelector('.signature-textarea');
  const htmlToggle = element.querySelector('.html-toggle');
  const deleteBtn = element.querySelector('.delete');
  const htmlButtons = element.querySelectorAll('.signature-btn:not(.html-toggle):not(.delete)');
  
  // Title change
  titleInput.addEventListener('input', (e) => {
    signature.title = e.target.value;
  });
  
  // Content change
  textarea.addEventListener('input', (e) => {
    signature.content = e.target.value;
    updateSingleSignaturePreview(element, signature);
  });
  
  // HTML toggle
  htmlToggle.addEventListener('click', () => {
    signature.isHtml = !signature.isHtml;
    htmlToggle.dataset.html = signature.isHtml;
    htmlToggle.style.background = signature.isHtml ? 'linear-gradient(135deg, #7B5FB2 0%, #4A90E2 100%)' : '#e5e7eb';
    htmlToggle.style.color = signature.isHtml ? 'white' : '#374151';
    
    // Show/hide HTML buttons
    htmlButtons.forEach(btn => {
      btn.style.display = signature.isHtml ? 'block' : 'none';
    });
    
    updateSingleSignaturePreview(element, signature);
  });
  
  // Initialize HTML toggle state
  if (signature.isHtml) {
    htmlToggle.style.background = 'linear-gradient(135deg, #7B5FB2 0%, #4A90E2 100%)';
    htmlToggle.style.color = 'white';
  }
  
  // Delete button
  deleteBtn.addEventListener('click', () => {
    if (signatures.length > 1) {
      signatures = signatures.filter(s => s.id !== signature.id);
      renderSignatures();
    } else {
      alert(chrome.i18n.getMessage('cannot_delete_last_signature') || 'Cannot delete the last signature');
    }
  });
}

// Update preview for a single signature
function updateSingleSignaturePreview(element, signature) {
  const preview = element.querySelector('.signature-preview-small');
  const content = signature.content || '';
  
  if (content.trim()) {
    let displayValue = content;
    if (!signature.isHtml && !content.includes('<')) {
      displayValue = content.replace(/\n/g, '<br>');
    }
    preview.innerHTML = displayValue;
  } else {
    preview.innerHTML = '<span style="color: #9ca3af;">' + (chrome.i18n.getMessage('no_signature_preview') || 'No signature set') + '</span>';
  }
}

// Add new signature
function addNewSignature() {
  const newSignature = {
    id: nextSignatureId++,
    title: chrome.i18n.getMessage('signature_default_title') || 'Signature ' + (signatures.length + 1),
    content: '',
    isHtml: false
  };
  
  signatures.push(newSignature);
  renderSignatures();
  
  // Focus on the new signature's title
  setTimeout(() => {
    const newElement = document.querySelector(`[data-signature-id="${newSignature.id}"] .signature-title-input`);
    if (newElement) {
      newElement.focus();
      newElement.select();
    }
  }, 100);
}

// Insert HTML tag helper
window.insertHtmlTag = function(button, tag) {
  const signatureItem = button.closest('.signature-item');
  const textarea = signatureItem.querySelector('.signature-textarea');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  
  textarea.value = text.substring(0, start) + tag + text.substring(end);
  
  // Position cursor inside the tag
  if (tag.includes('><')) {
    const cursorPos = start + tag.indexOf('><') + 1;
    textarea.setSelectionRange(cursorPos, cursorPos);
  } else {
    textarea.setSelectionRange(start + tag.length, start + tag.length);
  }
  
  textarea.focus();
  textarea.dispatchEvent(new Event('input'));
};

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

  // Add signature button
  document.getElementById('addSignature').addEventListener('click', addNewSignature);
  
  // Initialize signatures display
  renderSignatures();

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
    document.getElementById('defaultSender').value = settings.defaultSender || '';
    document.getElementById('customPrompt').value = settings.customPrompt || '';
    document.getElementById('language').value = settings.language;
    
    // Update model info
    updateModelInfo();
    
    // Load signatures
    if (settings.signatures && settings.signatures.length > 0) {
      signatures = settings.signatures;
      // Update nextSignatureId to avoid conflicts
      nextSignatureId = Math.max(...signatures.map(s => s.id || 0)) + 1;
    } else if (settings.signature) {
      // Migrate from old single signature
      signatures = [{
        id: 1,
        title: chrome.i18n.getMessage('signature_default_title') || 'Default Signature',
        content: settings.signature,
        isHtml: settings.signature.includes('<')
      }];
      nextSignatureId = 2;
    } else {
      // No signatures at all
      signatures = [];
    }
    
    // Render signatures
    renderSignatures();
    
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
    
    // Collect signature data from the form
    const signatureElements = document.querySelectorAll('.signature-item');
    signatures = [];
    
    signatureElements.forEach(element => {
      const sigId = parseInt(element.dataset.signatureId);
      const title = element.querySelector('.signature-title-input').value.trim();
      const content = element.querySelector('.signature-textarea').value.trim();
      const isHtml = element.querySelector('.html-toggle').dataset.html === 'true';
      
      signatures.push({
        id: sigId,
        title: title || chrome.i18n.getMessage('signature_default_title') || 'Signature',
        content: content,
        isHtml: isHtml
      });
    });
    
    // Collect all settings
    const settings = {
      apiKey: apiKey,
      model: document.getElementById('model').value,
      maxTokens: parseInt(document.getElementById('maxTokens').value),
      responseStyle: document.getElementById('responseStyle').value,
      signatures: signatures, // New: array of signatures
      signature: signatures.length > 0 ? signatures[0].content : '', // Legacy support
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