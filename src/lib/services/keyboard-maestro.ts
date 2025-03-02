import {fetch} from '@tauri-apps/plugin-http'

// TODO: Get it from config
const PASTE_COPIED_TEXT_UUID = '7C312DCF-EDBC-44BD-9DE1-8E57E7E6E771'

export const keyboardMaestro = {
	pasteTextFromClipboard: async () => {
		await triggerMacro(PASTE_COPIED_TEXT_UUID)
	},
}

async function triggerMacro(macroUuid: string) {
	const triggerUrl = `http://localhost:4490/action.html?macro=${macroUuid}`
	await fetch(triggerUrl, {method: 'GET'})
}
