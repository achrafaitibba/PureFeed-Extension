> **Note**: This extension was entirely vibe-coded with a focus on clean architecture and functionality over formality.

# PureFeed

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/achrafaitibba/PureFeed-Extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Browser Extension](https://img.shields.io/badge/Browser-Extension-blue.svg)](https://chrome.google.com/webstore)

A browser extension that helps you maintain focus by hiding distracting sections on social media platforms and providing smart redirects to more meaningful content. Currently supports **Chromium-based browsers** (Chrome, Edge, Brave) with plans to expand to Firefox and Safari.

## Features

- **Element Hiding**: Hide distracting sections using precision XPath selectors
- **Intelligent Redirects**: Automatically redirect to focused content (e.g., YouTube subscriptions instead of homepage)
- **Auto-Click Actions**: Automatically click elements after hiding (e.g., switch to "Following" tab on Twitter)
- **Multi-Platform Support**: Twitter/X, LinkedIn, YouTube, Reddit with dynamic platform detection
- **Persistent Settings**: User preferences saved across browser sessions
- **Clean Architecture**: Maintainable, testable, and extensible codebase
- **Performance Optimized**: Debounced DOM operations and smart mutation observers

## Browser Support

**Currently Supported:**

- Chrome
- Microsoft Edge
- Brave Browser
- Other Chromium-based browsers

**Coming Soon:**

- Firefox (WebExtensions compatibility layer in development)
- Safari (planned for future release)

## Installation & Setup

### For Chrome

1. Clone or download this repository
2. Build the extension:
    ```bash
    npm run build
    ```
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked" and select the project directory
6. The extension is now active with default settings

### For Microsoft Edge

1. Follow steps 1-2 from Chrome installation
2. Open Edge and navigate to `edge://extensions/`
3. Enable "Developer mode" (toggle in left sidebar)
4. Click "Load unpacked" and select the project directory
5. The extension is now active with default settings

### For Brave Browser

1. Follow steps 1-2 from Chrome installation
2. Open Brave and navigate to `brave://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the project directory
5. The extension is now active with default settings

### Development Setup

```bash
# Development mode (modular, with live reload indicator)
npm run dev

# Production build (bundled, optimized)
npm run prod

# Clean and rebuild
npm run rebuild

# Package for distribution
npm run package:chrome
npm run package:firefox
npm run package:all
```

## Configuration

The extension uses a declarative `config.json` file for all platform configurations:

```json
{
    "sections": [
        {
            "id": "twitter_foryoupage",
            "name": "X: For You Page",
            "platform": "twitter",
            "xpaths": ["//div[@role='presentation']//span[text()='For you']/parent::div"],
            "toClick": "//div[@role='presentation']//span[text()='Following']/parent::div"
        },
        {
            "id": "youtube_redirect",
            "name": "YouTube - Home to Feed Redirect",
            "platform": "youtube",
            "currentPath": "/",
            "newPath": "/feed/subscriptions"
        }
    ]
}
```

### Configuration Properties

| Property      | Type   | Description                                              |
| ------------- | ------ | -------------------------------------------------------- |
| `id`          | string | Unique identifier for the section                        |
| `name`        | string | Display name in popup interface                          |
| `platform`    | string | Platform identifier (twitter, linkedin, youtube, reddit) |
| `xpaths`      | array  | XPath selectors for elements to hide                     |
| `currentPath` | string | URL path to redirect from                                |
| `newPath`     | string | URL path to redirect to                                  |
| `toClick`     | string | Optional XPath for element to click after hiding         |

## Development

### Build System

The project uses a sophisticated build system supporting both development and production modes:

#### Development Mode

```bash
npm run dev
```

- Uses ES modules for easier debugging
- Includes DEV mode indicator in popup
- Live reload friendly
- Uses `popup-template.html` → `popup.html`

#### Production Mode

```bash
npm run prod
```

- Bundles modules into single files for compatibility
- Removes dev indicators for clean UI
- Optimizes for distribution
- Creates `content-bundled.js` and `popup-bundled.js`

### Available Scripts

| Command                   | Purpose           | Output                        |
| ------------------------- | ----------------- | ----------------------------- |
| `npm run dev`             | Development setup | Modular files, dev indicators |
| `npm run build`           | Production build  | Bundled files, optimized      |
| `npm run clean`           | Reset to dev mode | Removes bundled files         |
| `npm run rebuild`         | Clean + build     | Fresh production build        |
| `npm run package:chrome`  | Chrome package    | ZIP file for Chrome store     |
| `npm run package:firefox` | Firefox package   | ZIP file for Firefox store    |
| `npm run lint`            | Code linting      | ESLint check                  |
| `npm run format`          | Code formatting   | Prettier formatting           |

### Adding New Features

#### 1. New Platform Support

Simply add to `config.json`:

```json
{
    "id": "newplatform_section",
    "name": "New Platform: Section Name",
    "platform": "newplatform",
    "xpaths": ["//xpath/selector"]
}
```

#### 2. New Business Logic

Add new functionality by:

1. Creating entities in `src/domain/entities/`
2. Adding services to `src/domain/services/`
3. Implementing use cases in `src/application/usecases/`
4. Adding infrastructure in `src/infrastructure/`
5. Updating presentation controllers in `src/presentation/`

### Code Quality

The project maintains high code quality through:

- ESLint configuration for consistent code style
- Prettier for automatic code formatting
- Clean Architecture principles
- Comprehensive documentation
- Type safety through JSDoc comments

## Contributing

We welcome contributions! Please help us improve PureFeed.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature-name`)
3. Follow the clean architecture patterns
4. Add tests for new functionality
5. Run quality checks (`npm run lint && npm run format`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/feature-name`)
8. Open a Pull Request

### Issue Templates

We have several issue templates to help you report problems or request features:

- [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) - Report bugs with detailed reproduction steps
- [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) - Propose new features or enhancements
- [Platform Support Request](.github/ISSUE_TEMPLATE/platform_request.md) - Request support for new social media platforms
- [Question/Support](.github/ISSUE_TEMPLATE/question.md) - Get help or ask questions

### Adding New Platforms

To add support for a new social media platform:

1. Add configuration to `config.json`
2. Test on the target platform
3. Document the new platform
4. Submit PR with testing evidence

No code changes are required - the extension automatically detects and supports new platforms from configuration!

## Distribution

### Chrome Web Store

```bash
npm run package:chrome
# Upload purefeed-extension-chrome.zip to Chrome Web Store
```

### Firefox Add-ons (Coming Soon)

```bash
npm run package:firefox
# Upload purefeed-extension-firefox.zip to Firefox Add-ons
```

### Manual Installation

```bash
npm run build
# Load unpacked extension from project directory
```

## Technical Details

### Performance Optimizations

- Debounced DOM operations to prevent excessive processing
- Smart mutation observers that only trigger when needed
- Platform detection to avoid unnecessary processing on unsupported sites
- Lazy loading of extension components

### Security

- Minimal permissions required
- No external network requests
- Local storage only for settings
- Content Security Policy compliant

## Requirements

- **Node.js**: >= 14.0.0 (for build scripts)
- **Chrome**: Version 88+ (for ES modules support)
- **Edge**: Version 88+ (Chromium-based)
- **Brave**: Latest version

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/achrafaitibba/PureFeed-Extension/issues)
- **Discussions**: [GitHub Discussions](https://github.com/achrafaitibba/PureFeed-Extension/discussions)

---

**Star this repo if it helps you stay focused!**
