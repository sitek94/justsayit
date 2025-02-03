import pluginJs from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config({
	ignores: ['node_modules', 'dist', 'src-tauri'],
	files: ['**/*.{js,mjs,cjs,ts,svelte}'],
	extends: [
		pluginJs.configs.recommended,
		...tseslint.configs.recommended,
		importPlugin.flatConfigs.recommended,
	],
	languageOptions: {globals: globals.browser},
	settings: {
		'import/internal-regex': '^$lib/',
	},
	rules: {
		'import/no-unresolved': 'off',
		'import/order': [
			'warn',
			{
				alphabetize: {order: 'asc', caseInsensitive: true},
				'newlines-between': 'never',
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
			},
		],
	},
})
