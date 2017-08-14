import typescript from 'rollup-plugin-typescript';
export default {
	banner:'/* dialog */',
	entry: 'src/index.ts',
	dest: 'dest/js/dialog.js',
	moduleName: 'HERE.UI',
	format: 'umd',
	plugins:[
		typescript()
	]
};
