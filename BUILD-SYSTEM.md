# Dev vs Production Build System

This document explains the PureFeed Extension's build system and why we have both development and production modes.

## Overview

The PureFeed Extension uses a **single popup template** approach with **build-time script replacement** to handle development vs production differences efficiently.

## File Structure

```
popup.html              # Active popup (changes based on dev/prod)
popup-template.html     # Template for development (ES6 modules)
popup-bundled.js        # Generated production bundle
src/                    # Source modules (ES6)
```

## The Problem We Solved

### Before (The Issue):

- Running `npm run dev` would copy `popup-modular.html` → `popup.html`
- Running `npm run prod` would only create `popup-bundled.js` but not update `popup.html`
- **Result**: Production mode was still using modular scripts instead of bundled code
- **Data Loss**: Original production popup was overwritten and couldn't be restored

### After (The Solution):

- Single `popup.html` that gets modified at build time
- `popup-template.html` serves as the development template backup
- Build process automatically switches script tags based on mode

## Development vs Production

### Development Mode (`npm run dev`)

**What it does:**

```bash
npm run manifest                    # Generate manifest
cp manifest-modular.json manifest.json    # Use modular manifest
cp popup-template.html popup.html          # Restore development popup
```

**popup.html contains:**

```html
<script type="module" src="src/popup-main.js"></script>
<!-- Also includes a red "DEV" indicator in bottom-right corner -->
```

**Advantages:**

- ✅ **Faster development** - No build step required
- ✅ **Better debugging** - Individual source files visible in DevTools
- ✅ **Hot reloading** - Changes immediately visible after extension reload
- ✅ **Module boundaries** - Easy to trace bugs to specific files
- ✅ **Modern workflow** - Direct ES6 module support
- ✅ **Visual indicator** - Red "DEV" badge shows you're in development mode

**Disadvantages:**

- ❌ **Slower loading** - Multiple HTTP requests for each module
- ❌ **Development only** - Not optimized for end users

### Production Mode (`npm run prod`)

**What it does:**

```bash
node build.cjs                     # Bundle all modules
# build.cjs automatically updates popup.html script tag
```

**popup.html contains:**

```html
<script src="popup-bundled.js"></script>
<!-- DEV indicator is automatically removed -->
```

**Advantages:**

- ✅ **Faster loading** - Single HTTP request
- ✅ **Optimized performance** - Bundled code
- ✅ **Production ready** - Suitable for distribution
- ✅ **Smaller footprint** - No module resolution overhead

**Disadvantages:**

- ❌ **Harder debugging** - All code in one file
- ❌ **Build step required** - Must rebuild after changes

## Key Build Script Logic

The build script (`build.cjs`) does three main things:

1. **Bundle content scripts** → `content-bundled.js`
2. **Bundle popup scripts** → `popup-bundled.js`
3. **Update popup.html script tag** for production
4. **Remove DEV indicator** for clean production UI

```javascript
// Automatic script tag replacement
popupContent = popupContent.replace(
    '<script type="module" src="src/popup-main.js"></script>',
    '<script src="popup-bundled.js"></script>'
);
```

## Commands Summary

| Command         | Purpose           | popup.html Script                                |
| --------------- | ----------------- | ------------------------------------------------ |
| `npm run dev`   | Development mode  | `<script type="module" src="src/popup-main.js">` |
| `npm run prod`  | Production build  | `<script src="popup-bundled.js">`                |
| `npm run clean` | Reset to dev mode | `<script type="module" src="src/popup-main.js">` |

## Why This Approach?

### ✅ **Single Source of Truth**

- One `popup.html` template instead of maintaining two separate files
- Eliminates code duplication between dev and prod popups

### ✅ **No Data Loss**

- `popup-template.html` preserves the development version
- Can always restore development mode with `npm run dev`

### ✅ **Automatic Switching**

- Build process handles script tag replacement automatically
- No manual file management required

### ✅ **Clear Separation**

- Development and production modes are clearly defined
- Easy to switch between modes for testing

## Cross-Platform Considerations

⚠️ **Current scripts use Linux/Unix commands** (`cp`, `&&`, `rm -f`)

**Won't work on:**

- Windows Command Prompt
- Windows PowerShell (without WSL)

**Solutions for cross-platform:**

1. Use Node.js scripts instead of shell commands
2. Add cross-platform packages like `cpx2`
3. Use npm scripts with Node.js file operations

## Workflow Examples

### Development Workflow:

```bash
npm run dev                # Setup development mode
# Make changes to src/ files
# Reload extension in browser
# Changes are immediately visible
```

### Production Workflow:

```bash
npm run prod              # Build and switch to production
# Test the bundled version
npm run dev               # Switch back to development
```

### Distribution:

```bash
npm run prod              # Ensure production build
npm run zip               # Create distribution package
```

## Future Improvements

1. **Cross-platform scripts** using Node.js
2. **Source maps** for production debugging
3. **Minification** for smaller bundle size
4. **Watch mode** for automatic rebuilding
5. **TypeScript support** for better development experience

