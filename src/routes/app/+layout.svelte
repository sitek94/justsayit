<script lang="ts">
	import {onDestroy, onMount, type Snippet} from 'svelte'
	import {hasRequiredSettings, initializeSettings, settings} from '$lib/core/settings'
	import {checkForUpdates} from '$lib/features/app-updates'
	import {destroyTray, initializeTray} from '$lib/features/system-tray'
	import {fileSystemService} from '$lib/services/file-system'
	import {openSettingsWindow} from '$lib/services/windows'

	let {children}: {children: Snippet} = $props()
	let isInitializing = $state(true)

	onMount(async () => {
		if (import.meta.env.PROD) await checkForUpdates()
		await initializeSettings()
		await initializeTray()
		await fileSystemService.ensureAppDirectoriesExist()

		isInitializing = false
	})

	onDestroy(async () => {
		await destroyTray()
	})
</script>

{#if isInitializing}
	<div
		class="flex h-screen cursor-default items-center justify-center rounded-2xl border border-white bg-gray-900 text-white"
		data-tauri-drag-region
	>
		Initializing...
	</div>
{:else if !hasRequiredSettings($settings)}
	<div
		class="container mx-auto rounded-2xl border border-white bg-gray-900 p-4 text-white select-none"
		data-tauri-drag-region
	>
		<p class="mb-4 cursor-default" data-tauri-drag-region>
			Please configure the required settings to continue.
		</p>
		<button
			class="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
			onclick={openSettingsWindow}>Open Settings</button
		>
	</div>
{:else}
	{@render children()}
{/if}
