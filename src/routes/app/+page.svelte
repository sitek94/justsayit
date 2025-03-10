<script lang="ts">
	import {register, unregister} from '@tauri-apps/plugin-global-shortcut'
	import {onDestroy, onMount} from 'svelte'
	import type {Language} from '$lib/core/types'
	import {aiFormatting, type PresetName} from '$lib/features/ai-formatting'
	import {getPreset} from '$lib/features/ai-formatting/presets'
	import {createRecorder} from '$lib/features/audio/recorder.svelte'
	import Visualizer from '$lib/features/audio/visualizer.svelte'
	import type {ModelName} from '$lib/services/ai'
	import {clipboard} from '$lib/services/clipboard'
	import {fileSystem} from '$lib/services/file-system'
	import {keyboardMaestro} from '$lib/services/keyboard-maestro'
	import {playStartSound, playStopSound} from '$lib/services/play-sound'
	import {transcription} from '$lib/services/transcription'
	import {
		bringMainWindowToFront,
		hideMainWindow,
		toggleMainWindowVisibility,
	} from '$lib/services/windows'

	let isProcessing = $state(false)
	let formatWithAi = $state(false)
	let preset = $state<PresetName>('default')
	let aiModel = $state<ModelName>('claude35Sonnet')
	let language = $state<Language>('en')

	$effect(() => {
		applyPreset(preset, language)
	})

	function applyPreset(preset: PresetName, language: Language) {
		const {model} = getPreset(preset, language)
		aiModel = model
		formatWithAi = true
	}

	const recorder = createRecorder({
		onBeforeStart: async () => {
			await bringMainWindowToFront()
		},
		onStart: async () => {
			playStartSound()
		},
		onStop: async audio => {
			await playStopSound()
			await processAudio(audio)
		},
	})

	async function processAudio(audio: Blob) {
		const buffer = await audio.arrayBuffer()
		try {
			isProcessing = true
			const transcript = await transcription.transcribe(buffer, language)
			const formattedTranscript = await formatTranscript(transcript)

			// Some room for performance improvements here
			await clipboard.copy(formattedTranscript)
			await keyboardMaestro.pasteTextFromClipboard()
			await fileSystem.saveRecording({audio, transcript: formattedTranscript, raw: transcript})
		} catch (error) {
			console.error(error)
		} finally {
			isProcessing = false
		}
	}

	async function formatTranscript(transcript: string) {
		if (formatWithAi) {
			return await aiFormatting.format({text: transcript, presetName: preset, language})
		}

		return transcript
	}

	// Local keyboard shortcuts (only when main window is focused)
	async function handleKeydown(event: KeyboardEvent) {
		if (event.code === 'Space') {
			event.preventDefault()
			if (recorder.isRecording) {
				await recorder.stopRecording()
			} else {
				await recorder.startRecording()
			}
		}

		// Loop through languages (with shift go backwards)
		if (event.metaKey && event.code === 'KeyL') {
			const increment = event.shiftKey ? -1 : 1
			const languages: Language[] = ['en', 'pl'] // I very rarely use ES so can just click it when needed
			const nextIndex = (languages.indexOf(language) + increment) % languages.length
			language = languages[nextIndex] as Language
		}

		// Toggle format with ai, kind of like preset zero, which means no AI
		// need to think about it later on, maybe it could be a part of presets
		// instead of a separate toggle
		if (event.metaKey && event.code === 'Digit1') {
			formatWithAi = !formatWithAi
		}

		// Default preset
		if (event.metaKey && event.code === 'Digit2') {
			preset = 'default'
		}

		// Message preset
		if (event.metaKey && event.code === 'Digit3') {
			preset = 'message'
		}

		// Note preset
		if (event.metaKey && event.code === 'Digit4') {
			preset = 'note'
		}

		// Email preset
		if (event.metaKey && event.code === 'Digit5') {
			preset = 'email'
		}
	}

	onMount(async () => {
		// Global keyboard shortcuts
		register('Control+Q', async event => {
			if (event.state === 'Released') {
				if (recorder.isRecording) {
					await recorder.stopRecording()
					await hideMainWindow()
				} else {
					await recorder.startRecording()
				}
			}
		})

		register('Control+Shift+Q', async event => {
			if (event.state === 'Released') {
				await toggleMainWindowVisibility()
			}
		})

		register('Control+Shift+Alt+Q', async event => {
			if (event.state === 'Released') {
				await recorder.stopMediaStream()
			}
		})
	})

	onDestroy(() => {
		unregister('Control+Q')
		unregister('Control+Shift+Q')
		unregister('Control+Shift+Alt+Q')
	})
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex h-screen flex-col">
	{#if isProcessing}{/if}
	<div class="h-[130px]" data-tauri-drag-region>
		{#if recorder.mediaStream && !isProcessing}
			<Visualizer stream={recorder.mediaStream} />
		{:else if isProcessing}
			<div data-tauri-drag-region class="flex h-full items-center justify-center">
				<p class="text-lg text-white">Processing...</p>
			</div>
		{/if}
	</div>

	<div class="flex h-[20px] justify-evenly text-sm">
		<button
			class="rounded-sm bg-white px-1 text-gray-900"
			onclick={() => (formatWithAi = !formatWithAi)}
		>
			{formatWithAi ? 'ai:on' : 'ai:off'}
		</button>

		<select class="bg-white text-gray-900" bind:value={preset}>
			<option value="default">default</option>
			<option value="message">message</option>
			<option value="note">note</option>
			<option value="email">email</option>
		</select>

		<select class="bg-white text-gray-900" bind:value={aiModel}>
			<option value="gpt4o">gpt4o</option>
			<option value="gpt4oMini">gpt4oMini</option>
			<option value="claude35Sonnet">claude35Sonnet</option>
			<option value="claude35Haiku">claude35Haiku</option>
		</select>

		<select class="bg-white text-gray-900" bind:value={language}>
			<option value="en">en</option>
			<option value="pl">pl</option>
			<option value="es">es</option>
		</select>
	</div>
</div>
