import {useState} from 'react'
import {version} from '../package.json'
import {AudioVisualizer} from './audio-visualizer'
import {groq} from './groq'
import {useCheckAppUpdate} from './use-check-app-update'

export function App() {
	useCheckAppUpdate()

	const [transcription, setTranscription] = useState<string | null>(null)

	const handleRecordingComplete = async (audioBlob: Blob) => {
		const transcription = await groq.transcribe(await audioBlob.arrayBuffer())
		setTranscription(transcription)
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
			<div className="p-8 text-center">
				<h1 className="mb-8 text-4xl font-bold text-zinc-800 dark:text-white">
					justsayit v{version}
				</h1>
				<AudioVisualizer onRecordingComplete={handleRecordingComplete} />

				{transcription && (
					<div className="mt-4">
						<p className="text-green-500">Transcription: {transcription}</p>
					</div>
				)}
			</div>
		</main>
	)
}
