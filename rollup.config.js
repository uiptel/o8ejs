import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import pkg from './package.json'  with { type: 'json' };

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
    plugins: [
      del({ targets: 'dist/*' }),

      copy({
        targets: [
          { src: 'src', dest: 'dist' }
        ]
      })
    ]
  }
];
