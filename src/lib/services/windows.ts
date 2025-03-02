import {WebviewWindow} from '@tauri-apps/api/webviewWindow'

export async function openSettingsWindow() {
	const webview = new WebviewWindow('settings', {
		title: 'Settings',
		decorations: true,
		resizable: false,
		width: 300,
		height: 400,
		url: '/settings',
	})

	webview.once('tauri://created', () => {
		webview.show()
	})
	webview.once('tauri://error', e => {
		console.error(e)
	})
}
