module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended'
    ],
    globals: {
        'TweenLite': false,
        'Power3': false,
        'Scroll': false
    },
    plugins: ['vue'],
    rules: {
        'no-console': 'off',
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': 0,
        'import/first': false,
        'arrow-spacing': ['error', { before: false, after: false }],
        'space-before-function-paren': ['error', 'never'],
        "object-curly-spacing": ["error", "never"],
        indent: ['error', 4],
        semi: ['error', 'always'],
        quotes: ['error', 'double'],
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
};
