// http://eslint.org/docs/user-guide/configuring

// module.exports = {
//   root: true,
//   parser: 'babel-eslint',
//   parserOptions: {
//     sourceType: 'module'
//   },
//   env: {
//     browser: true,
//   },
//   // https://github.com/standard/standard/blob/master/docs/RULES-en.md
//   extends: 'standard',
//   // required to lint *.vue files
//   plugins: [
//     'html'
//   ],
//   // add your custom rules here
//   'rules': {
//     // allow paren-less arrow functions
//     'arrow-parens': 0,
//     // allow async-await
//     'generator-star-spacing': 0,
//     // allow debugger during development
//     'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
//   }
// }

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
    "eslint:recommended",
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "plugin:vue/recommended",
    "plugin:prettier/recommended"
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    "semi": [2, "never"],
    "no-console": "off",
    "vue/max-attributes-per-line": "off",
    "vue/require-prop-types": "off",
    "vue/attributes-order": "off",
    "vue/require-v-for-key": "off",
    "vue/order-in-components": "off",
    "vue/no-textarea-mustache": "off",
    "vue/no-side-effects-in-computed-properties": "off",
    "prettier/prettier": ["error", {
      "semi": false,
      "singleQuote": true,
      "trailingComma": "none",
      "bracketSpacing": true,
      "arrowParens": "avoid",
    }]
  }
}
