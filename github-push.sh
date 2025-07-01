#!/bin/bash

# GitHub Push Script for Claude Email Assistant
echo "🚀 Claude Email Assistant - GitHub Publisher"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found. Are you in the right directory?"
    exit 1
fi

# Get user input
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -sp "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: Username and token are required!"
    exit 1
fi

# Configure git
echo ""
echo "📝 Configuring git..."
git config user.name "$GITHUB_USERNAME"
git config user.email "${GITHUB_USERNAME}@users.noreply.github.com"

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "🔄 Updating existing remote..."
    git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/claude-email-assistant.git"
else
    echo "➕ Adding remote..."
    git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/claude-email-assistant.git"
fi

# Create main branch
echo "🔀 Setting up main branch..."
git branch -M main

echo ""
echo "📊 Repository status:"
git status --short

echo ""
echo "🚀 Ready to push to GitHub!"
echo "Repository URL: https://github.com/${GITHUB_USERNAME}/claude-email-assistant"
echo ""
echo "⚠️  Make sure you've created an empty repository on GitHub first!"
echo ""
read -p "Push to GitHub now? (y/n): " CONFIRM

if [ "$CONFIRM" == "y" ]; then
    echo ""
    echo "📤 Pushing to GitHub..."
    if git push -u origin main; then
        echo ""
        echo "✅ Success! Your repository is now live at:"
        echo "   https://github.com/${GITHUB_USERNAME}/claude-email-assistant"
        echo ""
        echo "📋 Next steps:"
        echo "1. Update README.md with your details"
        echo "2. Create a release on GitHub"
        echo "3. Share your extension!"
    else
        echo ""
        echo "❌ Push failed. Please check:"
        echo "1. Repository exists and is empty on GitHub"
        echo "2. Token has correct permissions"
        echo "3. No typos in username"
    fi
else
    echo "Push cancelled. You can run this script again when ready."
fi