# GitHub Setup Instructions

Since direct GitHub integration isn't available in this environment, here's how to publish your Claude Email Assistant to GitHub:

## Option 1: Quick Setup (Recommended)

1. **Create GitHub Repository**
   - Go to: https://github.com/new
   - Repository name: `claude-email-assistant`
   - Description: `AI-powered email responses with Claude directly in Gmail - Chrome Extension`
   - **Important**: Leave it empty (don't initialize with README)

2. **Get Personal Access Token**
   - Go to: https://github.com/settings/tokens/new
   - Name: `Claude Email Assistant Deploy`
   - Expiration: 30 days (or your preference)
   - Select scopes:
     - ✅ repo (all)
     - ✅ workflow
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

3. **Push to GitHub**
   Run these commands in your terminal:
   ```bash
   cd /root/projekte/claude-email-assistant-en
   
   # Set your GitHub username
   GITHUB_USERNAME="YOUR_GITHUB_USERNAME"
   GITHUB_TOKEN="YOUR_PERSONAL_ACCESS_TOKEN"
   
   # Configure git
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   
   # Add remote with token
   git remote add origin https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/claude-email-assistant.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

## Option 2: Using GitHub Desktop

1. Copy the project to Windows:
   ```bash
   cp -r /root/projekte/claude-email-assistant-en /mnt/c/Users/svenw/Desktop/claude-email-assistant
   ```

2. Open GitHub Desktop
3. Add existing repository from Desktop
4. Publish to GitHub

## Option 3: Manual Git Push

If you have SSH keys set up:
```bash
cd /root/projekte/claude-email-assistant-en
git remote add origin git@github.com:YOUR_USERNAME/claude-email-assistant.git
git branch -M main
git push -u origin main
```

## After Publishing

1. **Update README.md**
   - Replace `[YOUR_USERNAME]` with your GitHub username
   - Replace `[Your Name]` with your actual name

2. **Create Release**
   - Go to: https://github.com/YOUR_USERNAME/claude-email-assistant/releases/new
   - Tag: `v1.0.0`
   - Title: `Claude Email Assistant v1.0.0 - Initial Release`
   - Description: Copy from CHANGELOG.md

3. **Add Topics**
   - Go to repository Settings
   - Add: `chrome-extension`, `gmail`, `ai`, `claude`, `anthropic`

4. **Enable Features**
   - Issues ✅
   - Discussions ✅
   - Wiki (optional)

## Chrome Web Store (Optional)

To publish to Chrome Web Store:
1. Package the extension in Chrome
2. Create developer account ($5 one-time fee)
3. Submit for review

Your extension is ready to share with the world! 🚀