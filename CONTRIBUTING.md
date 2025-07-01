# Contributing to Claude Email Assistant

Thank you for your interest in contributing to Claude Email Assistant! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Areas for Contribution](#areas-for-contribution)

## Code of Conduct

This project follows a simple code of conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professionalism in all interactions

## Getting Started

### Prerequisites

- Google Chrome browser
- Basic knowledge of JavaScript and Chrome Extensions
- Anthropic Claude API access (for testing)
- Git for version control

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/[YOUR_USERNAME]/claude-email-assistant.git
   cd claude-email-assistant
   ```

2. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project folder

3. **Set up API access**
   - Get a Claude API key from [console.anthropic.com](https://console.anthropic.com/)
   - Configure the extension with your API key

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-outlook-support`
- `fix/gmail-selector-bug`
- `docs/update-installation-guide`
- `refactor/improve-api-handling`

### Commit Messages

Follow this format:
```
type(scope): brief description

Longer description if needed

- List specific changes
- Include any breaking changes
- Reference issues if applicable
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation updates
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

### Code Organization

```
claude-email-assistant/
├── manifest.json          # Extension manifest
├── content.js            # Gmail integration
├── background.js         # API communication
├── settings.html         # Settings UI
├── settings.js           # Settings logic
├── modal.css            # Modal styling
├── popup.html           # Popup UI (if any)
├── popup.js             # Popup logic (if any)
└── docs/                # Additional documentation
```

## Testing

### Manual Testing Checklist

Before submitting changes, test:

- [ ] Extension loads without errors
- [ ] Settings page works correctly
- [ ] API key validation functions
- [ ] Gmail button injection works
- [ ] Email content extraction works
- [ ] Claude API integration works
- [ ] Response preview modal functions
- [ ] Response insertion into Gmail works
- [ ] Error handling works properly

### Gmail Compatibility

Test with different Gmail configurations:
- Different themes (Default, Comfortable, Compact)
- Different languages
- Various email types (plain text, HTML, replies, forwards)
- Different screen sizes

### Browser Testing

Test in different Chrome versions:
- Latest stable
- Previous major version
- Chrome Canary (for future compatibility)

## Style Guidelines

### JavaScript

- Use modern ES6+ syntax
- Prefer `const` and `let` over `var`
- Use descriptive variable names
- Comment complex logic
- Handle errors gracefully

```javascript
// Good
const extractEmailContent = (emailElement) => {
  const data = {
    subject: '',
    sender: '',
    content: '',
    timestamp: ''
  };
  
  // Extract subject with fallback selectors
  const subjectElement = emailElement.querySelector('.bog') || 
                         emailElement.querySelector('[role="heading"]');
  
  if (subjectElement) {
    data.subject = subjectElement.textContent.trim();
  }
  
  return data;
};

// Bad
function extract(e) {
  var d = {};
  d.s = e.querySelector('.bog').textContent;
  return d;
}
```

### HTML/CSS

- Use semantic HTML elements
- Follow BEM methodology for CSS classes
- Ensure accessibility (ARIA labels, keyboard navigation)
- Responsive design principles

```css
/* Good */
.claude-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
}

.claude-modal__content {
  max-width: 800px;
  margin: 50px auto;
  background: white;
  border-radius: 8px;
}

/* Bad */
.modal {
  position: fixed;
  background: rgba(0,0,0,.5);
}
```

## Areas for Contribution

### High Priority

1. **Gmail Compatibility**
   - Improve DOM selector robustness
   - Handle Gmail UI updates
   - Support different Gmail themes

2. **Error Handling**
   - Better API error messages
   - Graceful degradation
   - Retry mechanisms

3. **Performance**
   - Optimize DOM queries
   - Reduce memory usage
   - Faster response times

### Medium Priority

1. **UI/UX Improvements**
   - Better visual design
   - Improved accessibility
   - Mobile-friendly modal

2. **Features**
   - Template responses
   - Response history
   - Bulk operations

### Low Priority

1. **Additional Email Providers**
   - Outlook support
   - Yahoo Mail support
   - Other webmail providers

2. **Advanced Features**
   - Machine learning improvements
   - Integration with other AI models
   - Advanced formatting options

## Submitting Changes

### Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Ensure tests pass** and the extension works correctly
3. **Update the README** if you've added features
4. **Create detailed PR description** explaining your changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in Chrome
- [ ] Tested with Gmail
- [ ] Tested error scenarios

## Screenshots
(If applicable)

## Additional Notes
Any additional information
```

### Review Process

- All changes require at least one review
- Maintainers will provide feedback
- Address feedback promptly
- Once approved, changes will be merged

## Getting Help

### Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Gmail DOM Structure Guide](https://developers.google.com/gmail)
- [Anthropic Claude API Docs](https://docs.anthropic.com/)

### Communication

- Create GitHub issues for bugs or feature requests
- Use discussions for questions and ideas
- Be patient and respectful when seeking help

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special mentions for ongoing contributors

Thank you for contributing to Claude Email Assistant! 🚀