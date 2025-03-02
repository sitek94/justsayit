<script lang="ts">
	import {onDestroy, onMount, type Snippet} from 'svelte'
	import {hasRequiredSettings, initializeSettings, settings} from '$lib/core/settings'
	import {destroyTray, initializeTray} from '$lib/features/system-tray'
	import {fileSystem} from '$lib/services/file-system'
	import {openSettingsWindow} from '$lib/services/windows'

	let {children}: {children: Snippet} = $props()
	let isLoading = $state(true)

	onMount(async () => {
		await initializeSettings()
		await initializeTray()
		await fileSystem.ensureAppDirectoriesExist()

		isLoading = false
	})

	onDestroy(async () => {
		await destroyTray()
	})
</script>

{#if isLoading}
	<div class="flex h-screen items-center justify-center">
		<p>Loading settings...</p>
	</div>
{:else if !hasRequiredSettings($settings)}
	<div class="container mx-auto p-4">
		<p class="mb-4">Please configure the required settings to continue.</p>
		<button onclick={openSettingsWindow}>Open Settings</button>
	</div>
{:else}
	{@render children()}
{/if}
