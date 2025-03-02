import {defaultWindowIcon} from '@tauri-apps/api/app'
import {Menu} from '@tauri-apps/api/menu'
import {TrayIcon} from '@tauri-apps/api/tray'
import {exit} from '@tauri-apps/plugin-process'
import {get, writable} from 'svelte/store'
import {openSettingsWindow} from '../services/windows'

const trayId = writable<string | null>(null)

export async function initializeTray() {
	const menu = await Menu.new({
		items: [
			{
				id: 'quit',
				text: 'Quit',
				action: async () => {
					await exit()
				},
			},
			{
				id: 'settings',
				text: 'Settings',
				action: openSettingsWindow,
			},
		],
	})

	const options = {
		menu,
		menuOnLeftClick: true,
		icon: (await defaultWindowIcon())!,
	}

	const tray = await TrayIcon.new(options)

	return tray
}

export async function destroyTray() {
	const id = get(trayId)
	if (id) {
		await TrayIcon.removeById(id)
	}
}
