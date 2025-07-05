// Claude Email Assistant - Content Script
console.log(chrome.i18n.getMessage('extension_name') + ' loaded!');

// Inject CSS
const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
cssLink.href = chrome.runtime.getURL('modal.css');
document.head.appendChild(cssLink);

// Add Claude button to each email and compose button
function addClaudeButtons() {
  // Add compose button near Gmail's compose button
  addComposeButton();
  
  // Finde alle Email Container
  const emails = document.querySelectorAll('[role="listitem"]');
  
  emails.forEach(email => {
    // Skip if button already exists
    if (email.querySelector('.claude-reply-btn')) return;
    
    // Find the action bar (where Reply, Forward etc. are)
    const actionBar = email.querySelector('[role="toolbar"], [aria-label*="More"], .btC');
    if (!actionBar) return;
    
    // Create Claude button
    const claudeBtn = createClaudeButton();
    claudeBtn.addEventListener('click', () => handleClaudeReply(email));
    
    // Insert button
    const firstButton = actionBar.querySelector('[role="button"]');
    if (firstButton) {
      firstButton.parentElement.insertBefore(claudeBtn, firstButton);
    } else {
      actionBar.appendChild(claudeBtn);
    }
  });
}

// Add compose button near Gmail's compose button
function addComposeButton() {
  // Skip if already exists
  if (document.querySelector('.claude-compose-btn')) return;
  
  // Find Gmail's compose button
  const composeSelectors = [
    '.T-I.T-I-KE.L3', // Standard compose button
    '[gh="cm"]', // Compose button container
    '.z0 > .L3', // Alternative compose button
    '.aic .z0 > div[role="button"]' // Another variation
  ];
  
  let gmailComposeBtn = null;
  for (const selector of composeSelectors) {
    gmailComposeBtn = document.querySelector(selector);
    if (gmailComposeBtn) break;
  }
  
  if (!gmailComposeBtn) return;
  
  // Create Claude compose button
  const claudeComposeBtn = document.createElement('div');
  claudeComposeBtn.className = 'claude-compose-btn T-I T-I-KE L3';
  claudeComposeBtn.setAttribute('role', 'button');
  claudeComposeBtn.style.cssText = `
    margin-left: 8px;
    background: linear-gradient(135deg, #7B5FB2 0%, #4A90E2 100%);
    color: white;
    border-radius: 4px;
    padding: 0 24px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    height: 48px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
  `;
  
  // Create icon and text
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('icon24.png');
  icon.style.cssText = 'width: 24px; height: 24px; margin-right: 8px;';
  
  claudeComposeBtn.appendChild(icon);
  claudeComposeBtn.appendChild(document.createTextNode(chrome.i18n.getMessage('button_compose') || 'Claude Compose'));
  
  // Hover effect
  claudeComposeBtn.addEventListener('mouseenter', () => {
    claudeComposeBtn.style.background = 'linear-gradient(135deg, #6B4FA2 0%, #3A80D2 100%)';
  });
  claudeComposeBtn.addEventListener('mouseleave', () => {
    claudeComposeBtn.style.background = 'linear-gradient(135deg, #7B5FB2 0%, #4A90E2 100%)';
  });
  
  // Click handler
  claudeComposeBtn.addEventListener('click', handleClaudeCompose);
  
  // Insert after Gmail's compose button
  gmailComposeBtn.parentElement.appendChild(claudeComposeBtn);
}

// Creates the Claude button
function createClaudeButton() {
  const button = document.createElement('div');
  button.className = 'claude-reply-btn T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3';
  button.setAttribute('role', 'button');
  button.style.cssText = `
    margin-right: 8px;
    background: linear-gradient(135deg, #7B5FB2 0%, #4A90E2 100%);
    color: white;
    border-radius: 4px;
    padding: 0 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    height: 36px;
    font-size: 14px;
    font-weight: 500;
  `;
  // Create icon element
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('icon20.png');
  icon.style.cssText = 'width: 20px; height: 20px; margin-right: 6px; vertical-align: middle;';
  
  button.innerHTML = '';
  button.appendChild(icon);
  button.appendChild(document.createTextNode(chrome.i18n.getMessage('button_text')));
  
  // Hover Effect
  button.addEventListener('mouseenter', () => {
    button.style.background = 'linear-gradient(135deg, #6B4FA2 0%, #3A80D2 100%)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.background = 'linear-gradient(135deg, #7B5FB2 0%, #4A90E2 100%)';
  });
  
  return button;
}

// Main function: Read email and generate response
async function handleClaudeReply(emailElement) {
  try {
    // Change button status
    const button = emailElement.querySelector('.claude-reply-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite; margin-right: 6px;">⏳</span> ' + chrome.i18n.getMessage('button_loading');
    button.style.pointerEvents = 'none';
    
    // Extract email content
    const emailData = extractEmailContent(emailElement);
    
    if (!emailData.content) {
      throw new Error('Could not read email content');
    }
    
    button.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite; margin-right: 6px;">⏳</span> ' + chrome.i18n.getMessage('button_thinking');
    
    // Get settings (including API key)
    const settings = await getSettings();
    
    // Fallback: Check old claudeApiKey too
    let apiKey = settings.apiKey;
    if (!apiKey) {
      try {
        const { claudeApiKey } = await chrome.storage.sync.get(['claudeApiKey']);
        apiKey = claudeApiKey;
      } catch (error) {
        console.warn('Could not access chrome storage:', error);
      }
    }
    
    if (!apiKey) {
      throw new Error('Please enter Claude API Key in extension settings!');
    }
    
    // Claude API Call
    const reply = await generateClaudeReply(emailData, apiKey);
    
    button.innerHTML = '<span style="margin-right: 6px;">✍️</span> ' + chrome.i18n.getMessage('button_inserting');
    
    // Find reply button - try different selectors
    const replySelectors = [
      '[role="button"][aria-label*="Reply"]',
      '[role="button"][data-tooltip*="Reply"]', 
      '[aria-label="Reply"]',
      '[data-tooltip="Reply"]',
      '.T-I.J-J5-Ji.T-I-Js-IF.aaq.T-I-ax7.L3[role="button"]', // Standard Gmail Reply Button
      'span[role="link"]:not([aria-label*="Draft"])', // Reply Link
      '.aaq', // Gmail Reply Button Klasse
      '[role="button"]:has-text("Reply")',
      'div[data-tooltip*="Antworten"]', // German
      '[aria-label*="Antworten"]' // German
    ];
    
    let replyButton = null;
    for (const selector of replySelectors) {
      replyButton = emailElement.querySelector(selector) || document.querySelector(selector);
      if (replyButton) break;
    }
    
    // Open preview modal instead of direct insert
    await openPreviewModal(emailData, reply);
    
    // Restore original button content with icon
    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('icon20.png');
    icon.style.cssText = 'width: 20px; height: 20px; margin-right: 6px; vertical-align: middle;';
    
    button.innerHTML = '';
    button.appendChild(icon.cloneNode(true));
    button.appendChild(document.createTextNode(chrome.i18n.getMessage('button_text')));
    button.style.pointerEvents = 'auto';
    
  } catch (error) {
    console.error('Claude Email Assistant Error:', error);
    alert(chrome.i18n.getMessage('error_generic') + ': ' + error.message);
    
    // Reset button
    const button = emailElement.querySelector('.claude-reply-btn');
    if (button) {
      // Create icon element
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('icon20.png');
  icon.style.cssText = 'width: 20px; height: 20px; margin-right: 6px; vertical-align: middle;';
  
  button.innerHTML = '';
  button.appendChild(icon);
  button.appendChild(document.createTextNode(chrome.i18n.getMessage('button_text')));
      button.style.pointerEvents = 'auto';
    }
  }
}

// Extract email content
function extractEmailContent(emailElement) {
  const data = {
    subject: '',
    sender: '',
    content: '',
    timestamp: ''
  };
  
  // Subject
  const subjectElement = emailElement.querySelector('[data-legacy-thread-id] span') || 
                        emailElement.querySelector('.bog') ||
                        emailElement.querySelector('[role="heading"]');
  if (subjectElement) {
    data.subject = subjectElement.textContent.trim();
  }
  
  // Sender
  const senderElement = emailElement.querySelector('.yW span[email]') || 
                       emailElement.querySelector('.gD') ||
                       emailElement.querySelector('[email]');
  if (senderElement) {
    data.sender = senderElement.getAttribute('email') || senderElement.textContent.trim();
  }
  
  // Email content - try different selectors
  const contentSelectors = [
    '.ii.gt',
    '[dir="ltr"]',
    '.a3s.aiL',
    '.Am.Al.editable',
    '[role="listitem"] .y2'
  ];
  
  for (const selector of contentSelectors) {
    const contentElement = emailElement.querySelector(selector);
    if (contentElement && contentElement.textContent.trim()) {
      data.content = contentElement.textContent.trim();
      break;
    }
  }
  
  // Timestamp
  const timeElement = emailElement.querySelector('.xW span[title]') || 
                     emailElement.querySelector('.g3');
  if (timeElement) {
    data.timestamp = timeElement.getAttribute('title') || timeElement.textContent.trim();
  }
  
  return data;
}

// Global state for current conversation
let currentConversation = null;
let isComposeMode = false;

// Handle Claude Compose button click
async function handleClaudeCompose() {
  try {
    isComposeMode = true;
    
    // Create empty email data for compose mode
    const emailData = {
      subject: '',
      sender: '',
      content: '',
      timestamp: new Date().toLocaleString(),
      isCompose: true
    };
    
    // Open modal in compose mode with empty reply
    await openPreviewModal(emailData, '');
    
  } catch (error) {
    console.error('Claude Email Assistant Compose Error:', error);
    alert(chrome.i18n.getMessage('error_generic') + ': ' + error.message);
  }
}

// Preview Modal Functions
async function openPreviewModal(emailData, initialReply) {
  // Initialize conversation
  currentConversation = new ClaudeConversation(emailData, initialReply);
  
  // Create modal
  const modal = createPreviewModal(emailData, initialReply);
  document.body.appendChild(modal);
  
  // Setup event listeners
  setupModalEventListeners(modal);
  
  // Focus on modal
  modal.querySelector('.claude-response-textarea').focus();
}

function createPreviewModal(emailData, reply) {
  const modal = document.createElement('div');
  modal.className = 'claude-modal';
  
  // Get localized strings
  const i18n = chrome.i18n;
  const wordCount = reply ? reply.split(' ').filter(w => w).length : 0;
  const isCompose = emailData.isCompose || false;
  
  // Different title for compose mode
  const modalTitle = isCompose ? 
    (i18n.getMessage('modal_title_compose') || 'Claude Compose Email') : 
    i18n.getMessage('modal_title');
  
  modal.innerHTML = `
    <div class="claude-modal-content">
      <div class="claude-modal-header">
        <h2 class="claude-modal-title">
          <img src="${chrome.runtime.getURL('icon24.png')}" style="width: 24px; height: 24px; margin-right: 8px; vertical-align: middle;">
          ${modalTitle}
        </h2>
        <button class="claude-modal-close">&times;</button>
      </div>
      
      <div class="claude-modal-body">
        ${!isCompose ? `
        <!-- Original Email -->
        <div class="claude-section">
          <h3 class="claude-section-title">📧 ${i18n.getMessage('section_original')}</h3>
          <div class="claude-original-email">
            <div class="claude-email-meta">
              ${i18n.getMessage('from_label')}: ${emailData.sender || i18n.getMessage('unknown_sender')} | 
              ${i18n.getMessage('subject_label')}: ${emailData.subject || i18n.getMessage('no_subject')} | 
              ${emailData.timestamp || ''}
            </div>
            <div class="claude-email-content">${emailData.content || i18n.getMessage('no_content')}</div>
          </div>
        </div>
        ` : ''}
        
        <!-- Response Editor -->
        <div class="claude-section">
          <h3 class="claude-section-title">✍️ ${isCompose ? (i18n.getMessage('section_compose') || 'Compose Email') : i18n.getMessage('section_response')}</h3>
          <div class="claude-response-editor">
            <textarea class="claude-response-textarea" 
              placeholder="${isCompose ? (i18n.getMessage('compose_placeholder') || 'Your email will appear here...') : 'Response loading...'}">${reply}</textarea>
            <div class="claude-word-count">${i18n.getMessage('word_count', [wordCount.toString()])}</div>
          </div>
        </div>
        
        <!-- Chat Interface -->
        <div class="claude-section">
          <h3 class="claude-section-title">💬 ${i18n.getMessage('section_chat')}</h3>
          <div class="claude-chat-container">
            <div class="claude-chat-history" id="claude-chat-history">
              <!-- Chat messages will be added here -->
            </div>
            <div class="claude-chat-input-container">
              <textarea class="claude-chat-input" id="claude-chat-input" 
                placeholder="${isCompose ? (i18n.getMessage('compose_chat_placeholder') || 'Tell Claude what email to write (e.g., "Write a professional email to John about the project deadline")') : i18n.getMessage('chat_placeholder')}" 
                rows="1"></textarea>
              <button class="claude-chat-send" id="claude-chat-send">${i18n.getMessage('chat_send')}</button>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="claude-section">
          <h3 class="claude-section-title">⚡ ${i18n.getMessage('section_actions')}</h3>
          <div class="claude-quick-actions">
            <button class="claude-quick-action" data-action="polite">🎭 ${i18n.getMessage('action_polite')}</button>
            <button class="claude-quick-action" data-action="shorter">📝 ${i18n.getMessage('action_shorter')}</button>
            <button class="claude-quick-action" data-action="formal">👔 ${i18n.getMessage('action_formal')}</button>
            <button class="claude-quick-action" data-action="casual">😊 ${i18n.getMessage('action_casual')}</button>
            <button class="claude-quick-action" data-action="apologetic">🙏 ${i18n.getMessage('action_apologetic')}</button>
            <button class="claude-quick-action" data-action="regenerate">🔄 ${i18n.getMessage('action_regenerate')}</button>
          </div>
        </div>
      </div>
      
      <div class="claude-modal-footer">
        <div class="claude-footer-left">
          <select id="claude-signature-select" class="claude-signature-dropdown" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; margin-right: 8px;">
            <!-- Signatures will be populated here -->
          </select>
          <button class="claude-btn claude-btn-secondary" id="claude-copy">📋 ${i18n.getMessage('button_copy')}</button>
        </div>
        <div class="claude-footer-right">
          <button class="claude-btn claude-btn-secondary" id="claude-close">❌ ${i18n.getMessage('button_close')}</button>
          <button class="claude-btn claude-btn-success" id="claude-accept">✅ ${i18n.getMessage('button_accept')}</button>
        </div>
      </div>
    </div>
  `;
  
  return modal;
}

function setupModalEventListeners(modal) {
  // Close modal
  const closeButtons = modal.querySelectorAll('.claude-modal-close, #claude-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => closeModal(modal));
  });
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
  
  // ESC key
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal(modal);
      document.removeEventListener('keydown', escHandler);
    }
  });
  
  // Response textarea auto-resize and word count
  const textarea = modal.querySelector('.claude-response-textarea');
  const wordCount = modal.querySelector('.claude-word-count');
  
  textarea.addEventListener('input', () => {
    // Auto resize
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    
    // Update word count
    const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = `${words.length} words`;
  });
  
  // Chat input
  const chatInput = modal.querySelector('#claude-chat-input');
  const chatSend = modal.querySelector('#claude-chat-send');
  
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(modal);
    }
  });
  
  chatSend.addEventListener('click', () => sendChatMessage(modal));
  
  // Quick actions
  const quickActions = modal.querySelectorAll('.claude-quick-action');
  quickActions.forEach(btn => {
    btn.addEventListener('click', () => handleQuickAction(modal, btn.dataset.action));
  });
  
  // Copy button
  modal.querySelector('#claude-copy').addEventListener('click', async () => {
    let text = modal.querySelector('.claude-response-textarea').value;
    
    // Append selected signature
    const selectedSignature = await getSelectedSignature(modal);
    if (selectedSignature && selectedSignature.content) {
      text += '\n\n' + selectedSignature.content;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      showToast(chrome.i18n.getMessage('toast_copied'), 'success');
    });
  });
  
  // Accept button
  modal.querySelector('#claude-accept').addEventListener('click', async () => {
    let text = modal.querySelector('.claude-response-textarea').value;
    
    // Append selected signature
    const selectedSignature = await getSelectedSignature(modal);
    if (selectedSignature && selectedSignature.content) {
      text += '\n\n' + selectedSignature.content;
    }
    
    insertReplyIntoGmail(text);
    closeModal(modal);
    showToast(chrome.i18n.getMessage('toast_inserted'), 'success');
  });
}

async function sendChatMessage(modal) {
  const input = modal.querySelector('#claude-chat-input');
  const sendBtn = modal.querySelector('#claude-chat-send');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message to chat
  addChatMessage(modal, 'user', message);
  
  // Clear input and disable send
  input.value = '';
  sendBtn.disabled = true;
  sendBtn.textContent = chrome.i18n.getMessage('chat_thinking');
  
  try {
    // Request change from Claude
    const newReply = await currentConversation.requestChange(message);
    
    // Update response textarea
    const textarea = modal.querySelector('.claude-response-textarea');
    textarea.value = newReply;
    textarea.dispatchEvent(new Event('input')); // Trigger word count update
    
    // Add Claude response to chat
    addChatMessage(modal, 'assistant', chrome.i18n.getMessage('response_updated'));
    
  } catch (error) {
    addChatMessage(modal, 'assistant', `${chrome.i18n.getMessage('error_generic')}: ${error.message}`);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = chrome.i18n.getMessage('chat_send');
  }
}

async function handleQuickAction(modal, action) {
  const btn = modal.querySelector(`[data-action="${action}"]`);
  const originalText = btn.textContent;
  
  btn.classList.add('loading');
  btn.textContent = '⏳ ' + chrome.i18n.getMessage('action_working');
  
  const actionPrompts = {
    polite: 'Make the response more polite and friendly',
    shorter: 'Shorten the response to the essentials',
    formal: 'Make the response more formal and professional',
    casual: 'Make the response more casual and less formal',
    apologetic: 'Add a polite apology',
    regenerate: 'Generate a completely new response with different wording'
  };
  
  try {
    const newReply = await currentConversation.requestChange(actionPrompts[action]);
    
    // Update response textarea
    const textarea = modal.querySelector('.claude-response-textarea');
    textarea.value = newReply;
    textarea.dispatchEvent(new Event('input'));
    
    // Add to chat history
    addChatMessage(modal, 'user', actionPrompts[action]);
    addChatMessage(modal, 'assistant', chrome.i18n.getMessage('response_updated'));
    
  } catch (error) {
    addChatMessage(modal, 'assistant', `${chrome.i18n.getMessage('error_generic')}: ${error.message}`);
  } finally {
    btn.classList.remove('loading');
    btn.textContent = originalText;
  }
}

function addChatMessage(modal, role, content) {
  const chatHistory = modal.querySelector('#claude-chat-history');
  const messageDiv = document.createElement('div');
  messageDiv.className = `claude-chat-message claude-chat-${role}`;
  
  const avatar = role === 'user' ? '👤' : '🤖';
  
  messageDiv.innerHTML = `
    <div class="claude-chat-avatar">${avatar}</div>
    <div class="claude-chat-content">${content}</div>
  `;
  
  chatHistory.appendChild(messageDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function closeModal(modal) {
  modal.remove();
  currentConversation = null;
}

async function insertReplyIntoGmail(text) {
  // Check if compose box exists, if not try to open reply
  let composeBox = document.querySelector('[role="textbox"][contenteditable="true"]:not([aria-label*="Subject"])');
  
  if (!composeBox) {
    // Try to find and click reply button
    const replySelectors = [
      '[role="button"][aria-label*="Reply"]',
      '[role="button"][data-tooltip*="Reply"]',
      '[aria-label="Reply"]',
      '[data-tooltip="Reply"]',
      '.T-I.J-J5-Ji.T-I-Js-IF.aaq.T-I-ax7.L3[role="button"]',
      'span[role="link"]:not([aria-label*="Draft"])',
      '.aaq',
      'div[data-tooltip*="Antworten"]',
      '[aria-label*="Antworten"]'
    ];
    
    for (const selector of replySelectors) {
      const replyButton = document.querySelector(selector);
      if (replyButton) {
        replyButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        composeBox = document.querySelector('[role="textbox"][contenteditable="true"]:not([aria-label*="Subject"])');
        if (composeBox) break;
      }
    }
  }
  
  if (composeBox) {
    insertReplyText(text);
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(text);
    showToast(chrome.i18n.getMessage('toast_reply_not_found'), 'warning');
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#6B46C1'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 1000000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    animation: slideInRight 0.3s ease-out;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Conversation management class
class ClaudeConversation {
  constructor(emailData, initialReply) {
    this.emailData = emailData;
    this.isCompose = emailData.isCompose || false;
    
    if (this.isCompose) {
      // For compose mode, start with empty messages
      this.messages = [];
    } else {
      // For reply mode, include the original email
      this.messages = [
        {
          role: 'user',
          content: `Original Email from ${emailData.sender}:\nSubject: ${emailData.subject}\n\n${emailData.content}`
        },
        {
          role: 'assistant',
          content: initialReply
        }
      ];
    }
  }
  
  async requestChange(changeRequest) {
    if (this.isCompose && this.messages.length === 0) {
      // First message in compose mode - direct email request
      this.messages.push({
        role: 'user',
        content: changeRequest
      });
    } else {
      // Add user's change request for existing conversation
      this.messages.push({
        role: 'user',
        content: this.isCompose ? changeRequest : `Change the previous response: ${changeRequest}`
      });
    }
    
    try {
      // Get settings for system prompt
      const settings = await getSettings();
      
      // Ensure we have an API key
      let apiKey = settings.apiKey;
      if (!apiKey) {
        try {
          const { claudeApiKey } = await chrome.storage.sync.get(['claudeApiKey']);
          apiKey = claudeApiKey;
        } catch (error) {
          console.warn('Could not access chrome storage:', error);
        }
      }
      
      if (!apiKey) {
        throw new Error('API Key not found. Please enter in settings.');
      }
      
      // Update settings with API key
      settings.apiKey = apiKey;
      
      // Call Claude with conversation context
      const systemPrompt = settings.customPrompt || await getDefaultSystemPrompt(settings, this.isCompose);
      
      const newReply = await callClaudeWithContext(this.messages, systemPrompt, settings);
      
      // Add new reply to conversation
      this.messages.push({
        role: 'assistant',
        content: newReply
      });
      
      return newReply;
    } catch (error) {
      console.error('Error in requestChange:', error);
      throw error;
    }
  }
}

async function callClaudeWithContext(messages, systemPrompt, settings) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage({
        action: 'callClaudeWithContext',
        data: { 
          messages, 
          systemPrompt, 
          settings 
        }
      }, response => {
        if (chrome.runtime.lastError) {
          reject(new Error('Extension context invalidated. Please reload Gmail!'));
          return;
        }
        
        if (response && response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response?.error || 'Unknown error'));
        }
      });
    } catch (error) {
      reject(new Error(chrome.i18n.getMessage('error_extension_invalidated')));
    }
  });
}

// Get user settings
async function getSettings() {
  const defaultSettings = {
    apiKey: '',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1000,
    responseStyle: 'professional',
    signature: '',
    defaultSender: '',
    customPrompt: '',
    language: 'de'
  };
  
  try {
    if (chrome && chrome.storage && chrome.storage.sync) {
      const stored = await chrome.storage.sync.get(Object.keys(defaultSettings));
      return { ...defaultSettings, ...stored };
    } else {
      console.warn('Chrome storage not available, using defaults');
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    return defaultSettings;
  }
}

// Generate default system prompt based on settings
async function getDefaultSystemPrompt(settings, isCompose = false) {
  const styleInstructions = {
    professional: 'polite, professional and friendly',
    formal: 'very formal and respectful',
    casual: 'casual, personal and less formal',
    concise: 'short, precise and direct'
  };
  
  const style = styleInstructions[settings.responseStyle] || styleInstructions.professional;
  const languageMap = {
    'en': 'English',
    'es': 'Spanish',
    'zh_CN': 'Chinese (Simplified)',
    'pt': 'Portuguese',
    'fr': 'French',
    'de': 'German'
  };
  const language = languageMap[settings.language] || 'the same language as the original email';
  
  let prompt = isCompose ? 
    `You are a professional email assistant. Write complete emails that are ${style}.

Important instructions:
- Write in ${language}
- Write a complete email based on the user's request
- Include an appropriate subject line if requested
- Use appropriate salutation and closing based on context
- Make the email ready to send
- Do NOT include any signature (signatures are handled separately)` :
    `You are a professional email assistant. Write responses that are ${style}.

Important instructions:
- Respond in ${language}
- Address all important points in the email
- Use appropriate salutation based on context
- End with a suitable closing phrase
- Do NOT include any signature (signatures are handled separately)`;

  // Note: We don't add signature to the prompt anymore
  // Signatures are now handled separately and appended only on copy/insert
  
  if (settings.defaultSender) {
    prompt += `\n- My name is ${settings.defaultSender}`;
  }
  
  prompt += '\n- Keep the response appropriately long but complete';
  
  return prompt;
}

// Claude API Aufruf über Background Script (initial)
async function generateClaudeReply(emailData, apiKey) {
  // Get user settings
  const settings = await getSettings();
  
  // Use custom prompt or generate default
  const systemPrompt = settings.customPrompt || await getDefaultSystemPrompt(settings);
  
  const emailPrompt = `Original Email:
Subject: ${emailData.subject}
From: ${emailData.sender}
Date: ${emailData.timestamp}

Email Content:
${emailData.content}`;

  // Sende Request an Background Script
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage({
        action: 'callClaude',
        data: { 
          prompt: emailPrompt,
          systemPrompt: systemPrompt,
          apiKey: settings.apiKey || apiKey,
          settings: settings
        }
      }, response => {
        if (chrome.runtime.lastError) {
          reject(new Error('Extension context invalidated. Please reload Gmail!'));
          return;
        }
        
        if (response && response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response?.error || 'Unknown error'));
        }
      });
    } catch (error) {
      reject(new Error(chrome.i18n.getMessage('error_extension_invalidated')));
    }
  });
}

// Text in Compose Box einfügen
function insertReplyText(text) {
  const composeBox = document.querySelector('[role="textbox"][contenteditable="true"]:not([aria-label*="Subject"])');
  if (!composeBox) {
    throw new Error('Compose Box nicht gefunden');
  }
  
  // Fokus setzen
  composeBox.focus();
  
  // Text mit korrekter Formatierung einfügen
  const lines = text.split('\n');
  composeBox.innerHTML = lines.map(line => 
    line.trim() ? `<div>${line}</div>` : '<div><br></div>'
  ).join('');
  
  // Cursor ans Ende setzen
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(composeBox);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  
  // Event triggern damit Gmail die Änderung registriert
  composeBox.dispatchEvent(new Event('input', { bubbles: true }));
}

// Populate signature dropdown
async function populateSignatureDropdown(modal) {
  const dropdown = modal.querySelector('#claude-signature-select');
  if (!dropdown) return;
  
  try {
    const settings = await getSettings();
    const signatures = settings.signatures || [];
    
    // Clear existing options
    dropdown.innerHTML = '';
    
    // Add "No signature" option
    const noSigOption = document.createElement('option');
    noSigOption.value = '';
    noSigOption.textContent = chrome.i18n.getMessage('no_signature_option') || 'No signature';
    dropdown.appendChild(noSigOption);
    
    // Add signatures
    signatures.forEach((sig, index) => {
      const option = document.createElement('option');
      option.value = sig.id;
      option.textContent = sig.title || `Signature ${index + 1}`;
      if (index === 0) option.selected = true; // Select first signature by default
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading signatures:', error);
  }
}

// Get selected signature
async function getSelectedSignature(modal) {
  const dropdown = modal.querySelector('#claude-signature-select');
  if (!dropdown || !dropdown.value) return null;
  
  try {
    const settings = await getSettings();
    const signatures = settings.signatures || [];
    return signatures.find(sig => sig.id == dropdown.value);
  } catch (error) {
    console.error('Error getting signature:', error);
    return null;
  }
}

// Hilfsfunktion: Auf Element warten
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkInterval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkInterval);
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error(`Element ${selector} nicht gefunden`));
      }
    }, 100);
  });
}

// Gmail Änderungen beobachten
const observer = new MutationObserver(() => {
  addClaudeButtons();
});

// Starte Observer
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial ausführen
setTimeout(addClaudeButtons, 1000);