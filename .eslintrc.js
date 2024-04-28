module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  globals: {},
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:import/recommended'],
  plugins: ['prettier', 'import'],
  rules: {
    'no-unused-vars': 'warn',
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
};
