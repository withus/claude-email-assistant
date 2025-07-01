// Background Service Worker für API Calls

// Message Handler für Content Script
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === 'callClaude') {
    handleClaudeRequest(request.data)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Wichtig für async response
  }
  
  if (request.action === 'callClaudeWithContext') {
    handleClaudeWithContextRequest(request.data)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Enhanced Claude API Call Handler
async function handleClaudeRequest(data, retryCount = 0) {
  const { prompt, systemPrompt, apiKey, settings } = data;
  const maxRetries = 3;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: settings?.model || 'claude-3-5-sonnet-20241022',
        max_tokens: settings?.maxTokens || 1000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Retry bei Overload (529) oder Rate Limit (429)
      if ((response.status === 529 || response.status === 429) && retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Claude überlastet, versuche in ${delay}ms erneut... (Versuch ${retryCount + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return handleClaudeRequest(data, retryCount + 1);
      }
      
      throw new Error(`Claude API Error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    return responseData.content[0].text;
    
  } catch (error) {
    // Retry bei Netzwerkfehlern
    if (error.message.includes('fetch') && retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`Netzwerkfehler, versuche in ${delay}ms erneut... (Versuch ${retryCount + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return handleClaudeRequest(data, retryCount + 1);
    }
    
    console.error('Background script error:', error);
    throw error;
  }
}

// Handler for conversation context calls
async function handleClaudeWithContextRequest(data, retryCount = 0) {
  const { messages, systemPrompt, settings } = data;
  const maxRetries = 3;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: settings.model || 'claude-3-5-sonnet-20241022',
        max_tokens: settings.maxTokens || 1000,
        system: systemPrompt,
        messages: messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Retry bei Overload (529) oder Rate Limit (429)
      if ((response.status === 529 || response.status === 429) && retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Claude überlastet, versuche in ${delay}ms erneut... (Versuch ${retryCount + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return handleClaudeWithContextRequest(data, retryCount + 1);
      }
      
      throw new Error(`Claude API Error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    return responseData.content[0].text;
    
  } catch (error) {
    // Retry bei Netzwerkfehlern
    if (error.message.includes('fetch') && retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`Netzwerkfehler, versuche in ${delay}ms erneut... (Versuch ${retryCount + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return handleClaudeWithContextRequest(data, retryCount + 1);
    }
    
    console.error('Background script error:', error);
    throw error;
  }
}