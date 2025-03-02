import {readText, writeText} from '@tauri-apps/plugin-clipboard-manager'

export const clipboard = {
	copy: async (text: string) => {
		await writeText(text)
	},

	read: async () => {
		return await readText()
	},

	hasText: async () => {
		try {
			const text = await readText()
			return text.length > 0
		} catch (error) {
			console.error('Error checking clipboard content:', error)
			return false
		}
	},
}
