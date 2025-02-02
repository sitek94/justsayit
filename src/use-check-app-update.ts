import {ask} from '@tauri-apps/plugin-dialog'
import {relaunch} from '@tauri-apps/plugin-process'
import {check} from '@tauri-apps/plugin-updater'
import {useEffect} from 'react'
import {version} from '../package.json'

export function useCheckAppUpdate() {
	useEffect(() => {
		;(async () => {
			if (import.meta.env.DEV) return

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
		})()
	}, [])
}
