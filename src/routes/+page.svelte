<script lang="ts">
	import AudioVisualizer from '$lib/audio-visualizer.svelte'
	import {clipboard} from '$lib/clipboard'
	import {groq} from '$lib/groq'

	let transcription = $state('')
	let apiKey = $state('')

	const handleRecordingComplete = async (audioBlob: Blob) => {
		transcription = await groq.transcribe(await audioBlob.arrayBuffer(), apiKey)
		await clipboard.copy(transcription)
	}
</script>

<main class="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
	<div class="p-8 text-center">
		<h1 class="mb-8 text-4xl font-bold text-zinc-800 dark:text-white">justsayit</h1>
		<label for="api-key" class="mb-2 block text-sm font-medium text-zinc-800 dark:text-white">
			Groq API Key
		</label>
		<input
			id="api-key"
			class="mb-4 rounded-md border-2 border-zinc-200 p-2 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
			type="text"
			bind:value={apiKey}
		/>

		<AudioVisualizer onRecordingComplete={handleRecordingComplete} />

		{#if transcription}
			<div class="mt-4">
				<p class="text-green-500">Transcription: {transcription}</p>
			</div>
		{/if}
	</div>
</main>
