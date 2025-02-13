import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  vue: true,
  rules: {
    'no-console': 'off',
    'max-len': ['error', { code: 120 }],
  },
  globals: {
    $t: 'readonly',
  },
})
