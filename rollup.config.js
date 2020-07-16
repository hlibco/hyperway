import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [
        resolve(),
        terser()
    ]
}