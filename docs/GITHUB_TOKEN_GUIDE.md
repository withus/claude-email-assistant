# GitHub Personal Access Token Guide

## Quick Steps:

1. **Open**: https://github.com/settings/tokens/new
2. **Login** to GitHub if needed
3. **Fill out**:
   - Note: `Claude Email Assistant`
   - Expiration: Your choice (30 days is fine)
   - Scopes: ✅ Check `repo` (full control)
4. **Click**: "Generate token" (green button)
5. **Copy**: The token starting with `ghp_`

## What it looks like:

```
Personal Access Token (classic)
Token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
         ↑ Copy this entire string
```

## Security Tips:

- ✅ Treat this like a password
- ✅ Never commit it to code
- ✅ You can delete it after pushing
- ✅ Create a new one anytime at GitHub

## If you lose it:
Just create a new one - it's free and takes 30 seconds!

## Using the token:

When the script asks for your token, paste the entire `ghp_...` string.

The script will use it like this:
```
https://YOUR_TOKEN@github.com/USERNAME/repo.git
```

This allows git to push without asking for your password.