module.exports = {
    env: {
      browser: true,
      es6: true,
    },
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
      Parse: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': ['error'],
      '@typescript-eslint/member-naming': [
        'error',
        {
          private: '^__',
          protected: '^_',
        },
      ],
      '@typescript-eslint/no-var-requires': ['warn'],
      '@typescript-eslint/no-empty-function': ['warn'],
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/camelcase': ['off'],
      '@typescript-eslint/no-use-before-define': ['off'],
      '@typescript-eslint/explicit-function-return-type': ['off']
    },
  };
  