module.exports = {
  root: true,
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    extraFileExtensions: [ '.vue', '.ts' ]
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    // 'eslint:recommended',

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
    // ESLint typescript rules
    'plugin:@typescript-eslint/recommended',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    // 'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    'plugin:vue/vue3-strongly-recommended' // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
  ],
  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue'
  ],

  // add your custom rules here
  rules: {
    'no-console': 'warn', // 'error',
    'no-debugger': 'warn', // 'error',
    'vue/valid-v-slot': ['warn', { allowModifiers: true }],
    curly: ['error', 'multi'],
    indent: ['warn', 2],
    'array-callback-return': ['off', { allowImplicit: true }],
    'no-return-assign': ['off'],
    'no-unused-expressions': ['off', { allowShortCircuit: true, allowTernary: true }],
    'no-sequences': ['off'],
    'no-undef': 'warn',
    'no-useless-escape': ['off'],
    'no-unused-vars': ['off'],
    'vue/script-setup-uses-vars': ['off'],
    'comma-dangle': ['error', 'never'],
    'quotes': ['warn', 'single'],
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  overrides: [
    {
      // files: ['./pages/**/*.vue', './layouts/**/*.vue'],
      files: [
        './pages/**/*.vue',
        './layouts/**/*.vue',
        './components/Base/*.vue'
      ],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ],
  globals: {
    process: 'readonly',
    ref: 'readonly',
    useI18n: 'readonly',
    defineNuxtConfig: 'readonly',
    defineNuxtPlugin: 'readonly',
    defineStore: 'readonly',
    computed:'readonly',
    watch: 'readonly'
  }
}