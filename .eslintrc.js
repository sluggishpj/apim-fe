module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es6: true
    },
    extends: ['plugin:vue/essential', '@vue/airbnb'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        semi: [0, 'always'],
        'comma-dangle': [2, 'never'],
        indent: 0,
        'implicit-arrow-linebreak': 0,
        'space-before-function-paren': 0,
        'object-curly-newline': 0,
        'vue/no-parsing-error': [
            4,
            {
                'x-invalid-end-tag': false
            }
        ],
        'operator-linebreak': [2, 'after', { overrides: { '?': 'before', ':': 'before' } }],
        'arrow-parens': 0,
        'implicit-arrow-linebreak': 0,
        'space-before-function-paren': 0,
        'no-shadow': 0,
        'no-param-reassign': 0,
        'import/newline-after-import': 0,
        'function-paren-newline': 0,
        'default-case': 0,
        'max-len': 0,
        'prefer-destructuring': 0
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
