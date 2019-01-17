import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';

const { VERSION, DEPENDENCIES } = require('./globals.js');

const configurator = (file, format, plugins) => ({
  input: 'src/index.js',
  output: {
    name: 'RangeTrack',
    format,
    file,
    intro: `const VERSION = ${VERSION};\nconst DEPENDENCIES = ${DEPENDENCIES};`
  },
  plugins
});

const devConfig = configurator('dist/higlass-range.js', 'umd', [
  resolve(),
  commonjs({ sourceMap: false }),
  babel(),
  filesize(),
  visualizer()
]);

const prodConfig = configurator('dist/higlass-range.min.js', 'umd', [
  resolve(),
  commonjs({ sourceMap: false }),
  babel(),
  terser()
]);

export default [devConfig, prodConfig];
