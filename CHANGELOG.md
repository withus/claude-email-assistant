# Changelog

All notable changes to Claude Email Assistant will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Outlook support
- Template responses
- Response history
- Improved mobile support

## [1.0.0] - 2025-01-07

### Added
- Initial release of Claude Email Assistant
- Gmail integration with email content extraction
- Anthropic Claude API integration for AI-powered responses
- Interactive preview modal with chat interface
- Multiple response styles (Professional, Formal, Casual, Concise)
- Quick action buttons for common modifications
- Customizable settings with API key management
- Multi-language support (English, German, auto-detect)
- Custom signature support
- Cost-optimized Claude 3.5 Haiku model as default
- Comprehensive documentation and open-source licensing

### Features
- **One-Click Responses**: Generate AI responses directly in Gmail
- **Preview Modal**: Review and edit responses before inserting
- **Chat Interface**: Iteratively improve responses through conversation
- **Quick Actions**: Make responses more polite, shorter, formal, etc.
- **Custom Prompts**: Define your own AI instructions
- **Signature Integration**: Automatically append custom signatures
- **Error Handling**: Graceful error handling with user-friendly messages
- **Chrome Extension**: Full Chrome Manifest V3 compliance

### Technical Details
- Chrome Extension Manifest V3
- Background service worker for API calls
- Content script for Gmail DOM integration
- Chrome storage for settings persistence
- CORS handling for API requests
- Responsive modal design
- Token counting and cost estimation

### Supported Models
- Claude 3.5 Haiku (Default - Cost-effective)
- Claude 3.5 Sonnet (Balanced)
- Claude 3 Opus (Premium)

### Browser Support
- Google Chrome (Latest)
- Chromium-based browsers

### API Requirements
- Anthropic Claude API key
- Minimum account credit for API usage

---

## Version History

### Development Notes

This extension was developed with the following priorities:
1. **User Experience**: Simple, intuitive interface
2. **Cost Efficiency**: Optimized for minimal API costs
3. **Reliability**: Robust Gmail integration
4. **Flexibility**: Customizable responses and settings
5. **Open Source**: MIT licensed for community contributions

### Known Limitations

- Gmail only (no other email providers yet)
- Requires Anthropic API key and credit
- Chrome/Chromium browsers only
- Internet connection required for AI functionality

### Future Roadmap

#### Version 1.1 (Planned)
- Improved Gmail selector robustness
- Better error messages and user feedback
- Performance optimizations
- UI/UX enhancements

#### Version 1.2 (Planned)
- Response templates
- Response history
- Bulk operations support
- Enhanced customization options

#### Version 2.0 (Future)
- Support for Outlook and other email providers
- Integration with additional AI models
- Advanced formatting options
- Team/enterprise features