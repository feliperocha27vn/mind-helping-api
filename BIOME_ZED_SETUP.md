# Biome Configuration Guide for Zed Editor

## Overview

This guide provides best practices for configuring Biome in the Zed editor to ensure consistent code formatting and linting across your team and all environments.

## Prerequisites

- Zed >= v0.131.0
- Biome extension installed (available in Zed extensions view)
- Node.js with npm installed
- `@biomejs/biome` package in your project

## Installation

### 1. Install Biome Extension in Zed

1. Open Zed and press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Search for `zed: extensions`
3. Search for "Biome" and click Install

### 2. Install Biome as Project Dependency

```bash
npm install --save-dev @biomejs/biome
```

## Project-Level Configuration

### 1. Create `biome.json` or `biome.jsonc`

Place the configuration file at your project root, next to `package.json`.

**Recommendation:** Use `biome.jsonc` to allow comments in your configuration.

### 2. Basic Configuration Template

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.0.5/schema.json",
  
  // Global file inclusion/exclusion patterns
  "files": {
    "includes": ["src/**", "tests/**"],
    "ignoreUnknown": false
  },

  // Formatter settings (applies to all languages)
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentSize": 2,
    "lineWidth": 100,
    "lineEnding": "lf",
    "ignore": ["node_modules", "dist", "build"]
  },

  // Linter settings
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    },
    "ignore": ["node_modules", "dist", "build", "**/*.generated.ts"]
  },

  // JavaScript-specific settings
  "javascript": {
    "formatter": {
      "enabled": true,
      "quoteStyle": "double",
      "quoteProperties": "asNeeded",
      "trailingCommas": "es5",
      "semicolons": "always",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false,
      "jsxQuoteStyle": "double"
    }
  },

  // JSON-specific settings
  "json": {
    "formatter": {
      "enabled": true,
      "indentSize": 2,
      "lineWidth": 100
    }
  }
}
```

### 3. Recommended Configuration for TypeScript Projects

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.0.5/schema.json",

  "files": {
    "includes": ["src/**/*.{ts,tsx,js,jsx,json,jsonc}"],
    "ignoreUnknown": true
  },

  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentSize": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },

  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "warn"
      },
      "security": {
        "noDangerouslySetInnerHtml": "error"
      },
      "style": {
        "noImplicitBoolean": "warn",
        "useNamingConvention": {
          "level": "warn",
          "options": {
            "strictCase": false,
            "allowLeadingUnderscore": true
          }
        }
      },
      "suspicious": {
        "noAssignInExpressions": "error",
        "noMisleadingCharacterClass": "error"
      }
    },
    "ignore": ["node_modules", "dist", "build", "coverage"]
  },

  "javascript": {
    "formatter": {
      "enabled": true,
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "always"
    },
    "linter": {
      "enabled": true
    }
  },

  "json": {
    "formatter": {
      "enabled": true,
      "indentSize": 2
    },
    "linter": {
      "enabled": true
    }
  }
}
```

## Zed Editor Configuration

### 1. User Settings (Global)

Edit your global Zed settings: `Cmd+Alt+,` (macOS) or `Ctrl+Alt+,` (Windows/Linux)

```json
{
  "lsp": {
    "biome": {
      "settings": {
        "require_config_file": false
      }
    }
  },
  "languages": {
    "JavaScript": {
      "formatter": { "language_server": { "name": "biome" } },
      "code_actions_on_format": {
        "source.fixAll.biome": true,
        "source.organizeImports.biome": true
      }
    },
    "TypeScript": {
      "formatter": { "language_server": { "name": "biome" } },
      "code_actions_on_format": {
        "source.fixAll.biome": true,
        "source.organizeImports.biome": true
      }
    },
    "TSX": {
      "formatter": { "language_server": { "name": "biome" } },
      "code_actions_on_format": {
        "source.fixAll.biome": true,
        "source.organizeImports.biome": true
      }
    },
    "JSON": {
      "formatter": { "language_server": { "name": "biome" } }
    }
  }
}
```

### 2. Project Settings

Create `.zed/settings.json` in your project root for project-specific overrides:

```json
{
  "format_on_save": "on",
  "languages": {
    "JavaScript": {
      "formatter": { "language_server": { "name": "biome" } },
      "code_actions_on_format": {
        "source.fixAll.biome": true,
        "source.organizeImports.biome": true
      }
    },
    "TypeScript": {
      "formatter": { "language_server": { "name": "biome" } },
      "code_actions_on_format": {
        "source.fixAll.biome": true,
        "source.organizeImports.biome": true
      }
    },
    "TSX": {
      "formatter": { "language_server": { "name": "biome" } },
      "code_actions_on_format": {
        "source.fixAll.biome": true,
        "source.organizeImports.biome": true
      }
    }
  }
}
```

## Best Practices

### 1. Configuration File Format

**Prefer `biome.jsonc` over `biome.json`**

- Allows comments for documentation
- More maintainable for team collaboration
- Biome fully supports JSONC format

### 2. File Inclusion/Exclusion

```jsonc
{
  "files": {
    // Always include source and test files
    "includes": [
      "src/**/*.{ts,tsx,js,jsx}",
      "tests/**/*.{ts,tsx,js,jsx}",
      "*.config.{ts,js}",
      "package.json"
    ],
    // Exclude generated and dependency files
    "ignoreUnknown": false
  }
}
```

### 3. Language-Specific Rules

Define rules per language to handle different conventions:

```jsonc
{
  "linter": {
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "linter": {
      "rules": {
        "complexity": {
          "noExcessiveNestedTestSuites": "off"
        }
      }
    }
  }
}
```

### 4. Formatter Configuration Consistency

Ensure all team members use the same formatter settings:

```jsonc
{
  "formatter": {
    "indentStyle": "space",      // Team standard
    "indentSize": 2,              // Team standard
    "lineWidth": 100,             // Readable line length
    "lineEnding": "lf"            // Unix line endings
  }
}
```

### 5. Code Actions on Format

Enable automatic fixes and import organization on save:

```json
{
  "code_actions_on_format": {
    "source.fixAll.biome": true,
    "source.organizeImports.biome": true
  }
}
```

## Integration with Git

### Add to `.gitignore`

If you don't want to commit Biome's cache:

```
.biome.cache
```

### Pre-commit Hook (Optional)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npx biome check --apply-unsafe .
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Common Issues & Solutions

### Issue: Biome LSP not starting

**Solution:** Ensure `biome.json`/`biome.jsonc` exists at project root

```json
{
  "lsp": {
    "biome": {
      "settings": {
        "require_config_file": true
      }
    }
  }
}
```

### Issue: Formatter conflicts with other tools

**Solution:** Disable conflicting formatters in Zed settings

```json
{
  "languages": {
    "JavaScript": {
      "formatter": { "language_server": { "name": "biome" } }
    }
  }
}
```

### Issue: Comments in `biome.json` causing errors

**Solution:** Use `biome.jsonc` instead

Simply rename `biome.json` to `biome.jsonc`

### Issue: Biome not respecting `.gitignore`

**Solution:** Use `ignoreUnknown` in `biome.jsonc`

```jsonc
{
  "files": {
    "ignoreUnknown": true
  }
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx biome ci .
```

## NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "format": "biome format .",
    "format:fix": "biome format --write .",
    "lint": "biome lint .",
    "lint:fix": "biome lint --apply .",
    "check": "biome check .",
    "check:fix": "biome check --apply .",
    "check:unsafe": "biome check --apply-unsafe ."
  }
}
```

## Team Setup Checklist

- [ ] Install Biome extension in Zed
- [ ] Add `@biomejs/biome` to `devDependencies`
- [ ] Create `biome.jsonc` at project root
- [ ] Create `.zed/settings.json` with Biome configuration
- [ ] Add `.biome.cache` to `.gitignore` (optional)
- [ ] Add npm scripts for formatting and linting
- [ ] Update project README with setup instructions
- [ ] Set up pre-commit hooks (optional)
- [ ] Configure CI/CD pipeline
- [ ] Document any custom rules in team wiki

## References

- [Biome Official Documentation](https://biomejs.dev/)
- [Biome Configuration Guide](https://biomejs.dev/guides/configure-biome/)
- [Biome Zed Extension](https://biomejs.dev/reference/zed/)
- [Zed Documentation](https://zed.dev/docs/configuring-zed)

## Version Information

- Biome: v2.0.5+
- Zed: v0.131.0+
- Node.js: v16.0.0+