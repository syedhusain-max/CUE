import next from 'eslint-config-next/core-web-vitals';

const config = [
  ...next,
  { ignores: ['.next/**', 'node_modules/**', 'public/**'] },
  {
    // Generated from the Claude Design export (scripts/port). Plain <img> and literal
    // apostrophes are kept as they were in the original page.
    files: ['components/cue/CueApp.jsx'],
    rules: {
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default config;
