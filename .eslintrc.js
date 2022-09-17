module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: [
    'pug',
    '@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    camelcase: 'off',
    'no-var': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-undef': 'off',
    'n/no-callback-literal': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off'
  }
}
