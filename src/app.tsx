import {version} from '../package.json'
import {AudioVisualizer} from './audio-visualizer'
import {useCheckAppUpdate} from './use-check-app-update'

export function App() {
	useCheckAppUpdate()

	return (
		<main className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
			<div className="p-8 text-center">
				<h1 className="text-4xl font-bold text-zinc-800 dark:text-white">justsayit v{version}</h1>
				<AudioVisualizer />
			</div>
		</main>
	)
}
