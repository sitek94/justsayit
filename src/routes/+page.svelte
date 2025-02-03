<script lang="ts">
	import {groq} from '$lib/groq'
	import AudioVisualizer from '$lib/audio-visualizer.svelte'
	import {clipboard} from '$lib/clipboard'
	let transcription = $state('')

	const handleRecordingComplete = async (audioBlob: Blob) => {
		transcription = await groq.transcribe(await audioBlob.arrayBuffer())
		await clipboard.copy(transcription)
	}
</script>

<main class="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
	<div class="p-8 text-center">
		<h1 class="mb-8 text-4xl font-bold text-zinc-800 dark:text-white">justsayit</h1>
		<AudioVisualizer onRecordingComplete={handleRecordingComplete} />

		{#if transcription}
			<div class="mt-4">
				<p class="text-green-500">Transcription: {transcription}</p>
			</div>
		{/if}
	</div>
</main>
