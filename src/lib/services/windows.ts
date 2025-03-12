import {getAllWebviewWindows, WebviewWindow} from '@tauri-apps/api/webviewWindow'

const WINDOW_LABELS = {
	MAIN: 'main',
	SETTINGS: 'settings',
}

export async function openSettingsWindow() {
	const webview = new WebviewWindow(WINDOW_LABELS.SETTINGS, {
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
	const mainWindow = await getWindowByLabel(WINDOW_LABELS.MAIN)
	await mainWindow?.setAlwaysOnTop(true)
	await mainWindow?.show()
}

export async function hideMainWindow() {
	const mainWindow = await getWindowByLabel(WINDOW_LABELS.MAIN)
	await mainWindow?.setAlwaysOnTop(false)
	await mainWindow?.hide()
}

export async function toggleMainWindowVisibility() {
	const mainWindow = await getWindowByLabel(WINDOW_LABELS.MAIN)
	const isVisible = await mainWindow?.isVisible()
	if (isVisible) {
		await hideMainWindow()
	} else {
		await bringMainWindowToFront()
		// Focus the main window so that we can use local shortcuts immediately
		await mainWindow?.setFocus()
	}
}

async function getWindowByLabel(label: string) {
	const windows = await getAllWebviewWindows()
	return windows.find(window => window.label === label)
}
