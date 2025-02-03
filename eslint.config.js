import eslint from '@eslint/js'
import * as typescriptParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import * as espree from 'espree'
import globals from 'globals'
import * as svelteParser from 'svelte-eslint-parser'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	eslintPluginSvelte.configs['flat/recommended'],
	{ignores: ['node_modules', 'build', 'src-tauri', '.svelte-kit']},
	{languageOptions: {globals: globals.browser}},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: {
					js: espree,
					ts: typescriptParser,
					typescript: typescriptParser,
				},
				project: './tsconfig.json',
				extraFileExtensions: ['.svelte'],
			},
		},
	},
	{
		files: ['src/**/*.{js,ts,svelte}'],
		extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
		settings: {'import/internal-regex': '^$lib/'},
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
	},
)
