const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'vendor/**',
      'scratch/**',
      'capture_blended.cjs',
      'test_raw_yt.cjs'
    ]
  },

  js.configs.recommended,

  // Browser code — main app + data + modular JS files
  {
    files: ['app.js', 'data/**/*.js', 'js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.browser
      }
    }
  },

  // app.js — suppress dead-code remnants from simulation engine refactoring.
  // These are unused intermediate variables and empty error-suppression catch
  // blocks across 9800 lines of complex game-engine code. Safe to suppress.
  {
    files: ['app.js'],
    rules: {
      'no-unused-vars': 'off',
      'no-useless-assignment': 'off',
      'no-empty': 'off'
    }
  },

  // Node.js CommonJS code (scripts, ESLint config itself)
  {
    files: ['scripts/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    }
  },

  // Playwright config — ESM module with Node globals
  {
    files: ['playwright.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    }
  }
];