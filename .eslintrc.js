module.exports = {
  extends: [
    'airbnb',
    'prettier',
    'plugin:react/recommended',
    'plugin:markdown/recommended',
  ],
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true,
  },
  settings: {
    react: {
      version: '16.9',
    },
  },
  plugins: ['react', 'babel', 'react-hooks', 'markdown'],
  overrides: [
    {
      // In v2, explicitly apply eslint-plugin-markdown's `markdown`
      // processor on any Markdown files you want to lint.
      files: ['components/*/demo/*.md'],
      processor: 'markdown/markdown',
    },
  ],
  rules: {
    'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  globals: {
    gtag: true,
  },
}
