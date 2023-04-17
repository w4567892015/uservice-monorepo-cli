module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    'import',
    'prettier',
    '@typescript-eslint/eslint-plugin'
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['**/models/*', '.eslintrc.js', 'rpc.d.ts', 'rpc.js'],
  rules: {
    '@typescript-eslint/no-shadow': 'off',
    "@typescript-eslint/dot-notation": 'off',
    "@typescript-eslint/lines-between-class-members": 'off',
    "@typescript-eslint/naming-convention": 'off',
    'import/extensions': 'off',

    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'func-names': 'off',

    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/indent': ["error", 2, {
      'ignoredNodes': [
        // 'PropertyDefinition',
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
        'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
      ]
    }],
    'import/prefer-default-export': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
  },
};
