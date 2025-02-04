import '$lib/global.css'
import {getVersion} from '@tauri-apps/api/app'
import {ask} from '@tauri-apps/plugin-dialog'
import {relaunch} from '@tauri-apps/plugin-process'
import {check} from '@tauri-apps/plugin-updater'
import type {LayoutLoad} from './$types'

// We're running SPA
export const prerender = false
export const ssr = false

export const load: LayoutLoad = async () => {
	if (import.meta.env.PROD) {
		const version = await getVersion()
		const update = await check()

		if (update) {
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
	}
}
