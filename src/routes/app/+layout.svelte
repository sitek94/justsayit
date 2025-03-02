<script lang="ts">
	import {onDestroy, onMount, type Snippet} from 'svelte'
	import {hasRequiredSettings, initializeSettings, settings} from '$lib/core/settings'
	import {checkForUpdates} from '$lib/features/app-updates'
	import {destroyTray, initializeTray} from '$lib/features/system-tray'
	import {fileSystem} from '$lib/services/file-system'
	import {openSettingsWindow} from '$lib/services/windows'

	let {children}: {children: Snippet} = $props()
	let isInitializing = $state(true)

	onMount(async () => {
		if (import.meta.env.PROD) await checkForUpdates()
		await initializeSettings()
		await initializeTray()
		await fileSystem.ensureAppDirectoriesExist()

		isInitializing = false
	})

	onDestroy(async () => {
		await destroyTray()
	})
</script>

{#if isInitializing}
	<div class="flex h-screen items-center justify-center">
		<p>Initializing...</p>
	</div>
{:else if !hasRequiredSettings($settings)}
	<div class="container mx-auto p-4">
		<p class="mb-4">Please configure the required settings to continue.</p>
		<button
			class="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
			onclick={openSettingsWindow}>Open Settings</button
		>
	</div>
{:else}
	{@render children()}
{/if}
