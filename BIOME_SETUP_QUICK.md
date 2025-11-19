# Biome + Zed - Quick Setup Guide

## ⚡ 5 Minute Setup

### 1. Install Biome (Already Done ✓)
```bash
npm install -D @biomejs/biome
```

### 2. Biome Configuration Files (Already Done ✓)
- ✅ `biome.jsonc` - Main Biome configuration
- ✅ `.zed/settings.json` - Zed project settings

### 3. Install Biome Extension in Zed
1. Open Zed
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Type `zed: extensions`
4. Search for **"Biome"**
5. Click Install
6. **Restart Zed** (`Cmd+K Cmd+Q` on Mac or `Ctrl+K Ctrl+Q` on Windows/Linux)

### 4. Verify Installation
```bash
# Check Biome works
npx biome check .

# Format a file
npx biome format src/use-cases/professional/fetch-patients-use-case.ts --write
```

### 5. Add NPM Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "format": "biome format --write .",
    "lint": "biome lint .",
    "check": "biome check --write ."
  }
}
```

## ✅ Verification Checklist

- [ ] Biome extension installed in Zed
- [ ] Restart Zed editor
- [ ] Open a `.ts` file
- [ ] Press `Cmd+Shift+P` → `code_actions: show`
- [ ] Should see "Fix all with Biome" option
- [ ] Format on save works (Cmd+S should format automatically)

## 🔧 Key Features Configured

### ✓ Automatic Formatting
- When you save a file (`Cmd+S`), Biome automatically formats it
- Works for: TypeScript, JavaScript, JSON, JSONC

### ✓ Auto-Fix on Save
- Biome fixes linting errors automatically
- Organizes imports automatically

### ✓ Code Actions
- `source.fixAll.biome` - Fix all issues
- `source.organizeImports.biome` - Organize imports

## 🚀 Usage

### Format Current File
```bash
npm run format
```

### Lint and Check
```bash
npm run lint
npm run check
```

### Format Specific File
```bash
npx biome format --write src/file.ts
```

### Lint Specific File
```bash
npx biome lint src/file.ts
```

## 🛠️ Configuration Overview

### `biome.jsonc` Settings
- **Indent**: 2 spaces
- **Line Width**: 100 characters
- **Quotes**: Double quotes
- **Semicolons**: Always
- **Trailing Commas**: Yes (ES5 compatible)
- **Line Endings**: LF (Unix)

### `.zed/settings.json` Settings
- **Format on Save**: Enabled
- **Auto-fix on Format**: Enabled
- **Import Organization**: Enabled
- **Languages**: TypeScript, JavaScript, TSX, JSON, JSONC

## ⚠️ Troubleshooting

### Biome not working in Zed?
1. Verify `biome.jsonc` exists in project root
2. Check that Biome extension is installed
3. Restart Zed: `Cmd+K Cmd+Q` (Mac)
4. Open Command Palette: Check `lsp: restart` → `biome`

### Formatting not happening on save?
1. Check `.zed/settings.json` has `"format_on_save": "on"`
2. Verify the language is configured (TypeScript, JavaScript, etc.)
3. Restart Zed editor

### Import organization not working?
1. Check `"source.organizeImports.biome": true` in `.zed/settings.json`
2. Make sure you're using TypeScript/JavaScript files
3. Verify `biome.jsonc` has `"enabled": true` for `organizeImports`

### Conflicts with other formatters?
1. Make sure you don't have Prettier installed
2. Remove any other formatter configurations from Zed settings
3. In Zed settings, use only `"formatter": { "language_server": { "name": "biome" } }`

## 📚 Documentation Links

- [Biome Official Docs](https://biomejs.dev/)
- [Biome Zed Extension](https://biomejs.dev/reference/zed/)
- [Zed Configuring Guide](https://zed.dev/docs/configuring-zed)

## 🎯 Next Steps

1. **Try it now**: Open any `.ts` file and save it
2. **See it work**: Notice automatic formatting
3. **Run checks**: `npm run check` to see all fixes applied
4. **Share with team**: Push `biome.jsonc` and `.zed/settings.json` to git

## 💡 Pro Tips

### Use with Git
```bash
# Before committing, run:
npm run check

# Or add to pre-commit hook:
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run check"
```

### CI/CD Integration
```yaml
# .github/workflows/lint.yml
name: Lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run check
```

### Team Communication
Share this checklist with your team to ensure everyone has:
- [ ] Zed >= v0.131.0
- [ ] Biome extension installed
- [ ] Latest `biome.jsonc` from repo
- [ ] Latest `.zed/settings.json` from repo

## 📝 Configuration Files Reference

### `biome.jsonc` (Project Root)
Main configuration for code formatting and linting rules.
- Controls formatter behavior (indentation, line width, quotes)
- Defines linter rules and severity levels
- File inclusion/exclusion patterns
- Language-specific overrides

### `.zed/settings.json` (Project .zed Directory)
Zed editor settings for this project.
- Enables Biome as formatter for each language
- Configures code actions on format
- Disables conflicting formatters
- Tab size and whitespace settings

## 🎉 You're All Set!

Biome is now configured and ready to use. Every time you save a file:
1. Code is formatted according to `biome.jsonc`
2. Linting issues are automatically fixed
3. Imports are organized
4. Trailing whitespace is removed
5. Files end with newlines

**Happy coding! 🚀**
