import {getAllWebviewWindows, WebviewWindow} from '@tauri-apps/api/webviewWindow'

const WINDOW_LABELS = {
	MAIN: 'main',
	SETTINGS: 'settings',
}

export async function openSettingsWindow() {
	const webview = new WebviewWindow(WINDOW_LABELS.SETTINGS, {
		title: 'Settings',
		decorations: false,
		resizable: true,
		transparent: true,
		shadow: false,
		width: 300,
		minWidth: 300,
		maxWidth: 600,
		height: 400,
		minHeight: 400,
		maxHeight: 800,
		focus: true,
		alwaysOnTop: true,
		closable: false,
		url: '/settings',
		windowEffects: {
			effects: [],
			radius: 16,
		},
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
