# Chrome Web Store Release Guide

## Prerequisites

1. **Developer Account** ($5 one-time fee)
   - Go to: https://chrome.google.com/webstore/devconsole
   - Sign in with Google account
   - Pay $5 registration fee (one-time)

2. **Prepare Assets**
   - ✅ Extension code (complete)
   - ✅ Icons: 16x16, 48x48, 128x128 (complete)
   - 📸 Screenshots (need to create)
   - 📝 Store listing content (need to write)
   - 🎨 Promotional images (optional)

## Step-by-Step Release Process

### 1. Create Extension Package

```bash
# Method 1: ZIP file (Recommended)
cd /root/projekte/claude-email-assistant-en
zip -r claude-email-assistant.zip * -x "*.git*" -x "*.md" -x "push-to-github.sh" -x "logo.png" -x "GITHUB_TOKEN_GUIDE.md" -x "RELEASE_INSTRUCTIONS.md" -x "github-release-commands.txt"

# Method 2: Chrome Pack Extension
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Pack extension"
# 4. Select folder: /root/projekte/claude-email-assistant-en
# 5. Leave private key blank (first time)
```

### 2. Required Store Assets

#### A. Screenshots (Required: 1-5 images)
- **Size**: 1280x800 or 640x400 pixels
- **Format**: PNG or JPG
- **What to show**:
  1. Extension button in Gmail
  2. Preview modal with response
  3. Settings page
  4. Chat interface in action
  5. Multiple language support

#### B. Store Listing Icon
- **Size**: 128x128 PNG (already have: icon128.png)

#### C. Promotional Images (Optional)
- Small tile: 440x280 PNG
- Large tile: 920x680 PNG
- Marquee: 1400x560 PNG

### 3. Store Listing Content

#### Title
```
Claude Email Assistant - AI Email Replies
```

#### Short Description (132 chars max)
```
AI-powered email responses with Claude directly in Gmail. Multi-language support. Save time with intelligent, context-aware replies.
```

#### Detailed Description
```
Transform your email workflow with Claude Email Assistant - the intelligent Chrome extension that brings AI-powered responses directly to Gmail.

🚀 KEY FEATURES:

✨ One-Click AI Responses
• Generate intelligent replies with a single click
• Claude AI understands context and tone
• Maintains professional communication standards

🎯 Smart Preview & Edit
• Review responses before sending
• Interactive chat to refine replies
• Quick actions: make it shorter, more formal, or friendlier

🌍 Multi-Language Support
• English, Spanish, Chinese, Portuguese, French, and German
• Auto-detect email language
• Respond in your preferred language

⚡ Quick Actions
• Make responses more polite
• Shorten for brevity
• Adjust formality level
• Add apologies when needed
• Regenerate completely new responses

🛡️ Privacy & Security
• Your emails are never stored
• Direct API connection to Claude
• API key stored locally
• No third-party data sharing

💼 Perfect For:
• Business professionals
• Customer support teams
• Sales representatives
• Anyone managing high email volume
• International communication

🎨 Features:
• Beautiful gradient UI matching Gmail
• Customizable response styles
• Personal signature support
• Custom AI instructions
• Word count tracking

HOW IT WORKS:
1. Install the extension
2. Add your Claude API key (get one at console.anthropic.com)
3. Open any email in Gmail
4. Click the "Claude Reply" button
5. Review, edit, and send!

Save hours on email responses while maintaining quality and personalization. Let Claude handle the writing while you focus on what matters.

Note: Requires a Claude API key from Anthropic. Usage costs apply based on API usage.
```

#### Category
- **Primary**: Productivity
- **Secondary**: Communication

#### Language
- English (United States) - Primary
- Add all 6 supported languages

#### Privacy Policy URL
Create a simple privacy policy (required)

### 4. Privacy Policy Template

```markdown
# Privacy Policy for Claude Email Assistant

Last updated: [Date]

## Data Collection
Claude Email Assistant does NOT collect, store, or transmit any personal data or email content to our servers.

## Local Storage
- API keys are stored locally in Chrome's secure storage
- User preferences are stored locally
- No email content is ever stored

## Third-Party Services
- Email content is sent directly to Anthropic's Claude API for processing
- No intermediary servers are used
- Refer to Anthropic's privacy policy for their data handling

## Permissions
- activeTab: To interact with Gmail
- storage: To save your settings locally

## Contact
[Your email]
```

### 5. Upload to Chrome Web Store

1. **Go to Developer Dashboard**
   https://chrome.google.com/webstore/devconsole

2. **Click "New Item"**

3. **Upload ZIP file**

4. **Fill in Store Listing**:
   - Add screenshots
   - Copy description
   - Select categories
   - Add privacy policy URL

5. **Pricing & Distribution**:
   - Free
   - All regions (or select specific)
   - No payments/fees

6. **Submit for Review**

### 6. Review Process

- **Review time**: 1-3 business days typically
- **Common rejection reasons**:
  - Missing privacy policy
  - Unclear permissions justification
  - Poor quality screenshots
  - Misleading description

### 7. Post-Publication

1. **Monitor Reviews**
2. **Respond to User Feedback**
3. **Regular Updates**
4. **Track Analytics**

## Quick Checklist

- [ ] Create developer account ($5)
- [ ] Create ZIP package
- [ ] Take 1-5 screenshots
- [ ] Write store description
- [ ] Create privacy policy
- [ ] Upload and submit
- [ ] Wait for approval

## Tips for Success

1. **Screenshots**: Show real Gmail interface with your extension
2. **Description**: Focus on benefits, not features
3. **Keywords**: Include relevant search terms naturally
4. **Updates**: Plan regular updates to maintain ranking
5. **Support**: Provide clear support email/website

## Useful Commands

```bash
# Create release package
cd /root/projekte/claude-email-assistant-en
zip -r claude-email-assistant-v1.0.0.zip * \
  -x "*.git*" \
  -x "*.md" \
  -x "push-to-github.sh" \
  -x "logo.png" \
  -x "*_INSTRUCTIONS*" \
  -x "*_GUIDE*" \
  -x "github-release-commands.txt"

# Verify package contents
unzip -l claude-email-assistant-v1.0.0.zip
```

Ready to publish! 🚀