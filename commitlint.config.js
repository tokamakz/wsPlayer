module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [1, 'always', [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'perf',
      'test',
      'build',
      'ci',
      'chore',
      'revert'
    ]]
  }
}
