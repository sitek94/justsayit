import {version} from '../package.json'
import {AppUpdateAlert} from './app-update-alert'

export function App() {
	return (
		<>
			<AppUpdateAlert />
			<main className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
				<div className="p-8 text-center">
					<h1 className="text-4xl font-bold text-zinc-800 dark:text-white">
						Tauri Template v{version}
					</h1>
				</div>
			</main>
		</>
	)
}
