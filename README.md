# Claude Email Assistant

<div align="center">

![Claude Email Assistant Logo](icon128.png)

**Email replies with Claude directly in Gmail**

[![Chrome Extension](https://img.shields.io/badge/chrome-extension-brightgreen)](https://developer.chrome.com/docs/extensions/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Anthropic Claude](https://img.shields.io/badge/AI-Anthropic%20Claude-purple)](https://www.anthropic.com/)

[Features](#features) | [Installation](#installation) | [Usage](#usage) | [Configuration](#configuration) | [API Setup](#api-setup) | [Contributing](#contributing)

</div>

## Overview

Claude Email Assistant is a Chrome extension that uses Anthropic's Claude in Gmail. With one click it drafts a reply to the open email in the tone and style you choose.

## About this project

I built Claude Email Assistant as my own product. A content script adds Claude buttons to Gmail and reads the open email. The background service worker sends the request directly to the Claude Messages API (`/v1/messages`), so there is no server in between. The API key stays in `chrome.storage.sync` in the user's own browser. The interface is available in six languages: English, German, Spanish, French, Portuguese and Simplified Chinese.

## Architecture

- **`content.js`**: runs on `mail.google.com`, adds the Claude buttons for replies and new emails, extracts the email text, shows the preview window with chat and quick actions and inserts the result into the Gmail compose box. If that fails, the text is copied to the clipboard.
- **`background.js`**: service worker that receives requests from the content script via `chrome.runtime.sendMessage` and calls `https://api.anthropic.com/v1/messages`. On status 429 or 529 and on network errors it retries up to three times with increasing delay (1, 2 and 4 seconds).
- **Settings (`settings.html`, `settings.js`)**: opens from the extension icon. Here the user enters the API key and chooses model, response length, style, language, several signatures and an optional custom prompt. Everything is saved in `chrome.storage.sync`.

## Features

- **One-click replies:** generate a reply directly in Gmail with the "Claude Reply" button
- **New emails:** draft a new email with the "Claude Compose" button
- **Response styles:** Professional, Formal, Casual or Concise
- **Chat:** refine the reply in a conversation
- **Quick actions:** make the reply more polite, shorter, more formal or more casual, add an apology or regenerate it
- **Preview:** review and edit the reply before inserting it
- **Signatures:** save several signatures and choose one per reply
- **Languages:** English, German, Spanish, French, Portuguese, Simplified Chinese and auto-detect
- **Model choice:** Claude 3.5 Haiku, Claude 3.5 Sonnet or Claude 3 Opus
- **Custom prompt:** add your own instructions for Claude

## Installation

### From Source (Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/withus/claude-email-assistant.git
   cd claude-email-assistant
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension folder
   - The Claude Email Assistant icon should appear in your toolbar

3. **Get Claude API Key**
   - Visit [Anthropic Console](https://console.anthropic.com/account/keys)
   - Create a new API key
   - Copy the key (starts with `sk-ant-`)

4. **Configure Extension**
   - Click the extension icon in Chrome toolbar
   - Enter your Claude API key
   - Customize your settings (optional)
   - Click "Save"

## Usage

### Basic Usage

1. **Open Gmail** and navigate to any email
2. **Click the "Claude Reply" button** that appears in the email toolbar
3. **Wait for Claude** to analyze the email and generate a response
4. **Review the response** in the preview modal
5. **Make adjustments** using chat or quick actions if needed
6. **Click "Insert into Gmail"** to add the response to your compose box

### Advanced Features

#### Interactive Chat
- Use the chat interface to refine responses
- Example: "Make this more formal" or "Add a meeting suggestion"
- Maintains conversation context for iterative improvements

#### Quick Actions
- **More Polite:** add courtesy and friendliness
- **Shorter:** condense to essential points
- **More Formal:** increase professionalism
- **More Casual:** make it more relaxed
- **Add Apology:** include a polite apology
- **Regenerate:** create a completely new response

#### Signatures
Save one or more signatures in the settings and choose one in the preview before inserting the reply:
```
Best regards,

John Doe
Senior Developer
john@example.com
+1 (555) 123-4567
```

## Configuration

### Settings Overview

Access settings by clicking the extension icon in your Chrome toolbar.

#### API Configuration
- **Claude API Key**: Your Anthropic API key (required)
- **Model Selection**: Choose between Claude models
  - **Claude 3.5 Haiku** (`claude-3-5-haiku-20241022`): preselected on the settings page, lowest cost
  - **Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`): used as fallback if no settings have been saved yet
  - **Claude 3 Opus** (`claude-3-opus-20240229`): highest cost

#### Response Settings
- **Response Length**: 200 to 2000 tokens, default 1000
- **Response Style**: Professional, Formal, Casual or Concise
- **Language**: English, German, Spanish, French, Portuguese, Simplified Chinese or Auto-detect (replies in the language of the original email)

#### Personal Settings
- **Signatures**: Several signatures, one of them chosen per reply
- **Name**: Helps Claude with proper addressing
- **Custom System Prompt**: Define specific AI instructions

### Model Comparison

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| Claude 3.5 Haiku | fastest | lowest | Quick responses, cost-conscious users |
| Claude 3.5 Sonnet | medium | medium | Balanced performance |
| Claude 3 Opus | slowest | highest | Complex, nuanced responses |

## API Setup

### Get Your Claude API Key

1. **Create Anthropic Account**
   - Visit [console.anthropic.com](https://console.anthropic.com/)
   - Sign up or log in to your account

2. **Generate API Key**
   - Navigate to "Account", then "API Keys"
   - Click "Create Key"
   - Give it a descriptive name (e.g., "Gmail Assistant")
   - Copy the generated key (starts with `sk-ant-`)

3. **Add Credit**
   - Go to "Account", then "Billing"
   - Add credit to your account (minimum $5)
   - Monitor usage in the dashboard

### Costs

Every reply is billed by Anthropic per input and output token. The cost depends on the chosen model and the response length (200 to 2000 tokens). Current prices are listed on [anthropic.com/pricing](https://www.anthropic.com/pricing).

## Development

### Project Structure

```
claude-email-assistant/
  manifest.json          # Extension configuration (Manifest V3)
  content.js             # Gmail integration script
  background.js          # Service worker for the API calls
  settings.html          # Settings page (popup of the extension icon)
  settings.js            # Settings logic
  modal.css              # Preview modal styling
  _locales/              # Translations: de, en, es, fr, pt, zh_CN
  icon16.png ... icon128.png, logo.png
  docs/                  # Release and GitHub setup notes
  CHANGELOG.md
  CONTRIBUTING.md
  LICENSE
  README.md
```

### Key Components

- **Content Script**: Integrates with the Gmail DOM, extracts email content, injects buttons
- **Background Script**: Handles Claude API calls outside the Gmail page, which avoids CORS issues
- **Settings Page**: User configuration interface
- **Modal System**: Preview and editing interface

### Gmail Integration

The extension uses DOM selectors to integrate with Gmail:

```javascript
// Email detection
const emails = document.querySelectorAll('[role="listitem"]');

// Content extraction
const contentSelectors = [
  '.ii.gt',
  '[dir="ltr"]',
  '.a3s.aiL',
  '.Am.Al.editable'
];

// Compose box insertion
const composeBox = document.querySelector(
  '[role="textbox"][contenteditable="true"]:not([aria-label*="Subject"])'
);
```

## Contributing

Contributions are welcome. To get started:

### Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-email-assistant.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```
4. **Make your changes**
5. **Test thoroughly**
6. **Submit a pull request**

### Contribution Guidelines

- Follow existing code style and conventions
- Test your changes thoroughly in Gmail
- Update documentation for new features
- Ensure backward compatibility
- Add appropriate error handling

### Areas for Contribution

- **Localization**: Add support for more languages
- **UI/UX**: Improve visual design and user experience
- **Gmail Compatibility**: Make the selectors more robust
- **Email Providers**: Add support for other email providers
- **Performance**: Optimize for speed and efficiency

## Troubleshooting

### Common Issues

**"Failed to fetch" Error**
- Ensure your API key is valid and starts with `sk-ant-`
- Check that you have credit in your Anthropic account
- Try refreshing Gmail and reloading the extension

**"Extension context invalidated" Error**
- Refresh the Gmail tab
- Try disabling and re-enabling the extension
- Check Chrome console for additional error details

**Reply button not working**
- Make sure you're in an email thread (not compose)
- Try clicking reply first, then use Claude button
- Some Gmail themes may affect button detection

**Response not inserting**
- Check if compose box is visible and active
- Try clicking in the compose area first
- Response will be copied to clipboard as fallback

### Debug Mode

Enable Chrome Developer Tools:
1. Right-click in Gmail and choose "Inspect"
2. Go to Console tab
3. Look for "Claude Email Assistant" messages
4. Report issues with console output

## Privacy and Security

- **API Key Storage**: Stored locally in Chrome's sync storage
- **Email Content**: Only processed for response generation, not stored
- **Data Transmission**: Email content sent to Anthropic's API only
- **No Analytics**: Extension doesn't collect usage analytics
- **Open Source**: All code is publicly auditable

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Created by withus with assistance from Claude AI.

## Acknowledgments

- **Anthropic** for the Claude API
- **Gmail** for the web interface
- **Chrome Extensions** for the platform
- **Open Source Community** for inspiration and tools

## Support

If you encounter any issues or have questions:

1. **Check the [Troubleshooting](#troubleshooting) section**
2. **Search existing [Issues](https://github.com/withus/claude-email-assistant/issues)**
3. **Create a new issue** with detailed description and steps to reproduce
4. **Include browser version, extension version, and console errors**

---

<div align="center">

[Back to top](#claude-email-assistant)

</div>
