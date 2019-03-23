module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended'
    ],
    rules: {
        'react-hooks/rule-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    }
};
