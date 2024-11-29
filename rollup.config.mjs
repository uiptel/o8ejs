import copy from 'rollup-plugin-copy';
import pkg from './package.json'  with { type: 'json' };

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      copy({
        targets: [
          { src: 'src/typedefs.js', dest: 'dist/' },
        ]
      })
    ]
  }
];
