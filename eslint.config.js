import neostandard from 'neostandard';

export default [
  ...neostandard(),
  {
    languageOptions: {
      globals: {
        it: 'readonly',
        describe: 'readonly'
      }
    }
  },
  {
    rules: {
      '@stylistic/comma-dangle': ['error', {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }],
      '@stylistic/max-len': ['error', { code: 80 }],
      '@stylistic/semi': ['error', 'always'],
      strict: [2, 'global']
    }
  }
];
