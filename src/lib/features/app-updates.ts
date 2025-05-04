import {getVersion} from '@tauri-apps/api/app'
import {ask} from '@tauri-apps/plugin-dialog'
import {relaunch} from '@tauri-apps/plugin-process'
import {check} from '@tauri-apps/plugin-updater'

export async function checkForUpdates() {
	try {
		const version = await getVersion()
		const update = await check()

		// Sometimes the update object exists but has no data, so double-check before using it
		if (update && update.version) {
			const hasAgreed = await ask(
				`A new version v${update.version} is available (You're on v${version}). Would you like to update?`,
				{
					title: 'Update Available',
					okLabel: 'Update',
					cancelLabel: 'Later',
					kind: 'info',
				},
			)

			if (hasAgreed) {
				await update.downloadAndInstall()
				await relaunch()
			}
		}
	} catch (error) {
		console.error('Error checking for updates', error)
	}
}
