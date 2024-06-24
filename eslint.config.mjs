export default [
  {
    files: ['*.ts', '*.tsx', '*.vue'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2022
      }
    },
    plugins: {
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin'),
      'vue': await import('eslint-plugin-vue')
    },
    rules: {
      camelcase: 'off',
      'n/no-callback-literal': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prefer-const': 'off'
    }
  },
  {
    files: ['*.js', '*.jsx'],
    languageOptions: {
      ecmaVersion: 2022
    },
    env: {
      browser: true,
      commonjs: true,
      es6: true,
      node: true
    },
    extends: [
      'standard'
    ],
    rules: {
      camelcase: 'off',
      'n/no-callback-literal': 'off',
      'prefer-const': 'off'
    }
  },
  {
    files: ['*.vue'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022
      }
    },
    extends: [
      'plugin:vue/vue3-recommended'
    ]
  }
];
