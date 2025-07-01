# Claude Email Assistant

<div align="center">

![Claude Email Assistant Logo](icon128.png)

**AI-powered email responses with Claude directly in Gmail**

[![Chrome Extension](https://img.shields.io/badge/chrome-extension-brightgreen)](https://developer.chrome.com/docs/extensions/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Anthropic Claude](https://img.shields.io/badge/AI-Anthropic%20Claude-purple)](https://www.anthropic.com/)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Configuration](#configuration) • [API Setup](#api-setup) • [Contributing](#contributing)

</div>

## Overview

Claude Email Assistant is a Chrome extension that brings the power of Anthropic's Claude AI directly to your Gmail inbox. With just one click, generate intelligent, context-aware email responses that match your preferred tone and style.

## Features

✨ **One-Click Responses** - Generate AI responses directly in Gmail  
🎨 **Multiple Response Styles** - Professional, Formal, Casual, or Concise  
💬 **Interactive Chat Interface** - Refine responses through conversation  
⚡ **Quick Actions** - Make responses more polite, shorter, formal, etc.  
🔄 **Preview Modal** - Review and edit before inserting  
📝 **Custom Signatures** - Automatically add your signature  
🌐 **Multi-language Support** - English, Spanish, Chinese (Simplified), Portuguese, French  
💰 **Cost Optimization** - Uses Claude 3.5 Haiku for 73% cost savings  
⚙️ **Customizable Prompts** - Define your own AI instructions  

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
2. **Click the "🤖 Claude Reply" button** that appears in the email toolbar
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
- **🎭 More Polite** - Add courtesy and friendliness
- **📝 Shorter** - Condense to essential points
- **👔 More Formal** - Increase professionalism
- **😊 More Casual** - Make it more relaxed
- **🙏 Add Apology** - Include polite apology
- **🔄 Regenerate** - Create completely new response

#### Custom Signatures
Set up your signature in settings to automatically append to all responses:
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
  - **Haiku** (Recommended): Fastest and most cost-effective
  - **Sonnet**: Balanced performance and quality
  - **Opus**: Highest quality for complex responses

#### Response Settings
- **Response Length**: 200-2000 tokens (Short to Detailed)
- **Response Style**: Professional, Formal, Casual, or Concise
- **Language**: English, German, or Auto-detect

#### Personal Settings
- **Signature**: Automatically added to every response
- **Name**: Helps Claude with proper addressing
- **Custom System Prompt**: Define specific AI instructions

### Model Comparison

| Model | Speed | Cost | Quality | Best For |
|-------|-------|------|---------|----------|
| Claude 3.5 Haiku | ⚡⚡⚡ | 💰 | ⭐⭐⭐ | Quick responses, cost-conscious users |
| Claude 3.5 Sonnet | ⚡⚡ | 💰💰💰 | ⭐⭐⭐⭐ | Balanced performance |
| Claude 3 Opus | ⚡ | 💰💰💰💰💰 | ⭐⭐⭐⭐⭐ | Complex, nuanced responses |

## API Setup

### Get Your Claude API Key

1. **Create Anthropic Account**
   - Visit [console.anthropic.com](https://console.anthropic.com/)
   - Sign up or log in to your account

2. **Generate API Key**
   - Navigate to "Account" → "API Keys"
   - Click "Create Key"
   - Give it a descriptive name (e.g., "Gmail Assistant")
   - Copy the generated key (starts with `sk-ant-`)

3. **Add Credit**
   - Go to "Account" → "Billing"
   - Add credit to your account (minimum $5)
   - Monitor usage in the dashboard

### Cost Estimation

With Claude 3.5 Haiku (recommended):
- **Average email response**: ~500 tokens
- **Cost per response**: ~$0.0004 (less than $0.001)
- **100 responses**: ~$0.04
- **1000 responses**: ~$0.40

## Development

### Project Structure

```
claude-email-assistant/
├── manifest.json          # Extension configuration
├── content.js            # Gmail integration script
├── background.js         # API communication
├── settings.html         # Settings interface
├── settings.js           # Settings logic
├── modal.css            # Modal styling
├── icons/               # Extension icons
└── README.md            # This file
```

### Key Components

- **Content Script**: Integrates with Gmail DOM, extracts email content, injects buttons
- **Background Script**: Handles Claude API calls, manages CORS issues
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

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/withus/claude-email-assistant.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
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

- 🌐 **Localization**: Add support for more languages
- 🎨 **UI/UX**: Improve visual design and user experience
- 🔧 **Gmail Compatibility**: Enhance selector robustness
- 📧 **Email Providers**: Add support for other email providers
- 🚀 **Performance**: Optimize for speed and efficiency

## Troubleshooting

### Common Issues

**❌ "Failed to fetch" Error**
- Ensure your API key is valid and starts with `sk-ant-`
- Check that you have credit in your Anthropic account
- Try refreshing Gmail and reloading the extension

**❌ "Extension context invalidated" Error**
- Refresh the Gmail tab
- Try disabling and re-enabling the extension
- Check Chrome console for additional error details

**❌ Reply button not working**
- Make sure you're in an email thread (not compose)
- Try clicking reply first, then use Claude button
- Some Gmail themes may affect button detection

**❌ Response not inserting**
- Check if compose box is visible and active
- Try clicking in the compose area first
- Response will be copied to clipboard as fallback

### Debug Mode

Enable Chrome Developer Tools:
1. Right-click in Gmail → "Inspect"
2. Go to Console tab
3. Look for "Claude Email Assistant" messages
4. Report issues with console output

## Privacy & Security

- **API Key Storage**: Stored locally in Chrome's sync storage
- **Email Content**: Only processed for response generation, not stored
- **Data Transmission**: Email content sent to Anthropic's API only
- **No Analytics**: Extension doesn't collect usage analytics
- **Open Source**: All code is publicly auditable

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by withus with assistance from Claude AI.

## Acknowledgments

- **Anthropic** for providing the Claude API
- **Gmail** for the robust web interface
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

**Made with ❤️ and AI**

[⬆ Back to Top](#claude-email-assistant)

</div>