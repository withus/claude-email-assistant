# GitHub Release Instructions

Follow these steps to release Claude Email Assistant to GitHub:

## 1. Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository with these settings:
   - **Repository name**: `claude-email-assistant`
   - **Description**: `AI-powered email responses with Claude directly in Gmail - Chrome Extension`
   - **Public** repository (for open source)
   - **DO NOT** initialize with README, .gitignore, or license (we already have them)

## 2. Push to GitHub

After creating the empty repository, run these commands in your terminal:

```bash
# Navigate to the project directory
cd /root/projekte/claude-email-assistant-en

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/claude-email-assistant.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If you prefer SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/claude-email-assistant.git
git branch -M main
git push -u origin main
```

## 3. Update README

After pushing, update the README.md file:

1. Replace `[YOUR_USERNAME]` with your GitHub username in all links
2. Replace `[Your Name]` with your actual name in the Author section
3. Update any placeholder links or images

## 4. Create Release

1. Go to your repository on GitHub
2. Click on "Releases" → "Create a new release"
3. Fill in:
   - **Tag version**: `v1.0.0`
   - **Release title**: `Claude Email Assistant v1.0.0 - Initial Release`
   - **Description**: Copy from CHANGELOG.md
   - **Attach binaries**: Upload the packaged extension (see below)

## 5. Package Extension for Chrome Web Store (Optional)

To create a .crx file for distribution:

```bash
# In Chrome:
1. Go to chrome://extensions/
2. Enable Developer mode
3. Click "Pack extension"
4. Browse to: /root/projekte/claude-email-assistant-en
5. Click "Pack Extension"
```

This creates:
- `claude-email-assistant.crx` - Extension file
- `claude-email-assistant.pem` - Private key (KEEP SAFE!)

## 6. Add Topics and Description

On your GitHub repository page:

1. Click the gear icon next to "About"
2. Add topics:
   - `chrome-extension`
   - `gmail`
   - `ai`
   - `claude`
   - `anthropic`
   - `email-assistant`
   - `productivity`
3. Add website: `https://chrome.google.com/webstore` (when published)

## 7. Enable GitHub Features

1. Go to Settings → General
2. Enable:
   - Issues
   - Discussions (for community Q&A)
   - Projects (for roadmap)
   - Wiki (for additional docs)

## 8. Set Up GitHub Pages (Optional)

For a project website:

1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: /docs
4. Create a simple landing page

## 9. Add Badges to README

Update README.md with actual badge links:

```markdown
[![GitHub release](https://img.shields.io/github/release/YOUR_USERNAME/claude-email-assistant.svg)](https://GitHub.com/YOUR_USERNAME/claude-email-assistant/releases/)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/claude-email-assistant.svg)](https://GitHub.com/YOUR_USERNAME/claude-email-assistant/stargazers/)
[![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/claude-email-assistant.svg)](https://GitHub.com/YOUR_USERNAME/claude-email-assistant/issues/)
```

## 10. Announce Your Release

Share your extension:

1. **Reddit**: r/chrome, r/productivity, r/artificial
2. **Twitter/X**: Tag @AnthropicAI
3. **Product Hunt**: Submit as new product
4. **Hacker News**: Show HN post
5. **Dev.to**: Write an article about it

## Quick Start Commands

```bash
# Complete push sequence
cd /root/projekte/claude-email-assistant-en
git remote add origin https://github.com/YOUR_USERNAME/claude-email-assistant.git
git branch -M main
git push -u origin main
```

## Important Notes

- Keep your API key private - never commit it
- The .pem file is your private key - store it safely
- Consider adding a SECURITY.md file for responsible disclosure
- Add GitHub Actions for automated testing (future enhancement)

Good luck with your release! 🚀