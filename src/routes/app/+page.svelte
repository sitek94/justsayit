<script lang="ts">
	import {register, unregister} from '@tauri-apps/plugin-global-shortcut'
	import {onDestroy, onMount} from 'svelte'
	import type {Language} from '$lib/core/types'
	import {aiFormatting, type PresetName} from '$lib/features/ai-formatting'
	import {createRecorder} from '$lib/features/audio/recoder.svelte'
	import type {ModelName} from '$lib/services/ai'
	import {clipboard} from '$lib/services/clipboard'
	import {fileSystem} from '$lib/services/file-system'
	import {playStartSound, playStopSound} from '$lib/services/play-sound'
	import {transcription} from '$lib/services/transcription'
	import Visualizer from '$lib/visualizer.svelte'

	let isProcessing = $state(false)
	let formatWithAi = $state(false)
	let preset = $state<PresetName>('default')
	let aiModel = $state<ModelName>('claude35Sonnet')
	let language = $state<Language>('en')

	const recorder = createRecorder({
		onStart: () => {
			playStartSound()
		},
		onStop: async audio => {
			playStopSound()
			await processAudio(audio)
		},
	})

	async function processAudio(audio: Blob) {
		const buffer = await audio.arrayBuffer()
		try {
			isProcessing = true
			const transcript = await transcription.transcribe(buffer, language)
			const formattedTranscript = await formatTranscript(transcript)
			await clipboard.copy(formattedTranscript)
			await fileSystem.saveRecording({audio, transcript: formattedTranscript, raw: transcript})
		} catch (error) {
			console.error(error)
		} finally {
			isProcessing = false
		}
	}

	async function formatTranscript(transcript: string) {
		if (formatWithAi) {
			return await aiFormatting.format({
				text: transcript,
				presetName: preset,
			})
		}

		return transcript
	}

	onMount(() => {
		register('Control+Q', async event => {
			if (event.state === 'Released') {
				if (recorder.isRecording) {
					await recorder.stopRecording()
				} else {
					await recorder.startRecording()
				}
			}
		})
	})

	onDestroy(() => {
		unregister('Control+Q')
	})
</script>

<div class="relative flex flex-col">
	{#if isProcessing}
		<div
			data-tauri-drag-region
			class="absolute inset-0 z-10 flex items-center justify-center bg-black/75"
		>
			<p class="text-white">Processing...</p>
		</div>
	{/if}
	{#if recorder.mediaStream}
		<Visualizer stream={recorder.mediaStream} />
	{/if}

	<div class="flex justify-evenly bg-[#ccc] text-sm">
		<button
			class="rounded-lg bg-gray-500 px-1 text-white"
			onclick={() => (formatWithAi = !formatWithAi)}
		>
			{formatWithAi ? 'ai:on' : 'ai:off'}
		</button>

		<select bind:value={preset}>
			<option value="default">default</option>
			<option value="message">message</option>
			<option value="note">note</option>
			<option value="email">email</option>
		</select>

		<select bind:value={aiModel}>
			<option value="gpt4o">gpt4o</option>
			<option value="gpt4oMini">gpt4oMini</option>
			<option value="claude35Sonnet">claude35Sonnet</option>
			<option value="claude35Haiku">claude35Haiku</option>
		</select>

		<select bind:value={language}>
			<option value="en">en</option>
			<option value="pl">pl</option>
			<option value="es">es</option>
		</select>
	</div>
</div>
