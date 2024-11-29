import pkg from './package.json'  with { type: 'json' };

export default [
  {
    input: 'src/index.js',
    plugins: [
    ],
    output:[
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
