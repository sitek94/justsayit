import {relaunch} from '@tauri-apps/plugin-process'
import {check, Update} from '@tauri-apps/plugin-updater'
import {useEffect, useState} from 'react'
import {version} from '../package.json'

export function AppUpdateAlert() {
	const [update, setUpdate] = useState<Update | null>(null)

	useEffect(() => {
		;(async () => {
			const update = await check()
			if (update) {
				setUpdate(update)
			}
		})()
	}, [])

	if (!update) return null

	const handleUpdateClick = async () => {
		await update.downloadAndInstall()
		await relaunch()
	}

	return (
		<div className="fixed top-0 right-0 left-0 bg-blue-500 p-4 text-white">
			<div className="mx-auto flex max-w-md items-center justify-between">
				<p>{`New version available: v${update.version} (You're on v${version})`}</p>
				<button
					onClick={handleUpdateClick}
					className="cursor-pointer rounded-md bg-white px-2 py-1 text-sm text-blue-500 transition-colors hover:bg-blue-50"
				>
					Update Now
				</button>
			</div>
		</div>
	)
}
