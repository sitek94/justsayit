import {writeText} from '@tauri-apps/plugin-clipboard-manager'

export const clipboard = {
	copy,
}

async function copy(text: string) {
	await writeText(text)
}
