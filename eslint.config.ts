import pluginJs from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config({
	ignores: ['node_modules', 'dist', 'src-tauri'],
	files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
	extends: [
		pluginJs.configs.recommended,
		...tseslint.configs.recommended,
		pluginReact.configs.flat.recommended,
		importPlugin.flatConfigs.recommended,
	],
	languageOptions: {
		globals: globals.browser,
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/internal-regex': '^@/',
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
		'react/jsx-uses-react': 'off',
		'react/react-in-jsx-scope': 'off',
	},
})
