import {getAllWebviewWindows, WebviewWindow} from '@tauri-apps/api/webviewWindow'

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

export async function bringMainWindowToFront() {
	// `app.show() steals the focus`
	// probably I could just get a webview by its label, just experimenting for now
	const mainWindow = await getWindowByLabel('main')
	await mainWindow?.show()
}

export async function hideMainWindow() {
	const mainWindow = await getWindowByLabel('main')
	await mainWindow?.hide()
}

async function getWindowByLabel(label: string) {
	const windows = await getAllWebviewWindows()
	return windows.find(window => window.label === label)
}
