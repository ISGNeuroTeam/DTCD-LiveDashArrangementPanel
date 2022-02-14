import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import vue from 'rollup-plugin-vue';
import path from 'path';
import pluginMeta from './src/Plugin.Meta';
import { version } from './package.json';

const watch = Boolean(process.env.ROLLUP_WATCH);

const pluginName = pluginMeta.name.replace(/_/g, '-');
const outputFile = `${pluginName}.js`;
const outputDirectory = watch ? `./../../DTCD/server/plugins/DTCD-${pluginName}_${version}` : `./build`;
const baseStylesFile = path.resolve(__dirname, 'src/styles/base');

const plugins = [
  json(),
  nodeResolve({
    jsnext: true,
    preferBuiltins: true,
    browser: true,
    dedupe: ['vue'],
    extensions: ['.mjs', '.js', '.json', '.node', '.vue'],
  }),
  commonjs(),
  vue({
    data: {
      scss: `@import '${baseStylesFile}';`,
    },
  }),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.VUE_ENV': JSON.stringify('browser'),
  }),
  alias({
    entries: {
      '@': path.resolve(__dirname, 'src'),
    },
  }),
  babel({
    babelHelpers: 'bundled',
  }),
];

export default {
  plugins,
  input: `./src/Plugin.js`,
  output: {
    file: `${outputDirectory}/${outputFile}`,
    format: 'esm',
    sourcemap: false,
  },
  watch: {
    include: ['./*/**'],
  },
};
