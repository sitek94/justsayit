import {useState} from 'react'
import {version} from '../package.json'
import {AudioVisualizer} from './audio-visualizer'
import {useCheckAppUpdate} from './use-check-app-update'

export function App() {
	const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)

	useCheckAppUpdate()

	console.log(recordedAudio)

	return (
		<main className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
			<div className="p-8 text-center">
				<h1 className="text-4xl font-bold text-zinc-800 dark:text-white">justsayit v{version}</h1>
				<AudioVisualizer onRecordingComplete={audioBlob => setRecordedAudio(audioBlob)} />

				{recordedAudio && (
					<div className="mt-4">
						<p className="text-green-500">Audio captured! Size: {recordedAudio.size} bytes</p>
					</div>
				)}
			</div>
		</main>
	)
}
