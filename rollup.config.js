import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json'  with { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    plugins: [
      typescript({ useTsconfigDeclarationDir: true })
    ],
    output:[
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
