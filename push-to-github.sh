#!/bin/bash

# GitHub Release Script for Claude Email Assistant
# This script helps you push the extension to GitHub

echo "🚀 Claude Email Assistant - GitHub Release Helper"
echo "================================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized!"
    echo "Please run 'git init' first."
    exit 1
fi

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required!"
    exit 1
fi

# Choose connection method
echo ""
echo "Choose connection method:"
echo "1) HTTPS (recommended)"
echo "2) SSH"
read -p "Enter choice (1 or 2): " CONNECTION_METHOD

# Set remote URL based on choice
if [ "$CONNECTION_METHOD" == "2" ]; then
    REMOTE_URL="git@github.com:${GITHUB_USERNAME}/claude-email-assistant.git"
else
    REMOTE_URL="https://github.com/${GITHUB_USERNAME}/claude-email-assistant.git"
fi

echo ""
echo "📝 Repository URL: $REMOTE_URL"
echo ""

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' already exists. Updating..."
    git remote set-url origin "$REMOTE_URL"
else
    echo "➕ Adding remote 'origin'..."
    git remote add origin "$REMOTE_URL"
fi

# Rename branch to main
echo "🔄 Renaming branch to 'main'..."
git branch -M main

# Show current status
echo ""
echo "📊 Current git status:"
git status --short

echo ""
echo "Ready to push to GitHub!"
echo ""
echo "⚠️  Before pushing, make sure you have:"
echo "   1. Created an empty repository on GitHub named 'claude-email-assistant'"
echo "   2. NOT initialized it with README, .gitignore, or license"
echo ""

read -p "Have you created the empty repository on GitHub? (y/n): " REPO_CREATED

if [ "$REPO_CREATED" != "y" ]; then
    echo ""
    echo "👉 Please create the repository first:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Name: claude-email-assistant"
    echo "   3. Keep it empty (no README, license, or .gitignore)"
    echo "   4. Run this script again"
    exit 0
fi

echo ""
echo "🚀 Pushing to GitHub..."
echo ""

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Your repository is now live at:"
    echo "   https://github.com/${GITHUB_USERNAME}/claude-email-assistant"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Update README.md with your username and name"
    echo "   2. Create a release on GitHub"
    echo "   3. Share your extension with the community!"
    echo ""
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. Your GitHub credentials"
    echo "   2. Repository exists and is empty"
    echo "   3. You have push permissions"
    echo ""
    echo "If using HTTPS and asked for password, use a Personal Access Token:"
    echo "https://github.com/settings/tokens"
fi