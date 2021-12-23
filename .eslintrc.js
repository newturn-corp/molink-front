module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'plugin:react/recommended',
        'standard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 13,
        sourceType: 'module'
    },
    plugins: [
        'react',
        '@typescript-eslint'
    ],
    rules: {
        indent: [2, 4],
        semi: [2, 'never'],
        'no-use-before-define': 'off',
        'no-unused-vars': 'off',
        'no-useless-escape': 'off',
        'no-console': 'warn',
        'no-case-declarations': 'off'
    },
    globals: {
        JSX: true
    }
}
