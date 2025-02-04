<script lang="ts">
	import {onMount} from 'svelte'
	import {initializeSettings, internalSettings, hasRequiredSettings} from '$lib/settings'
	import Settings from '$lib/settings.svelte'

	let isLoading = true

	onMount(async () => {
		await initializeSettings()
		isLoading = false
	})
</script>

{#if isLoading}
	<div class="flex h-screen items-center justify-center">
		<p>Loading settings...</p>
	</div>
{:else if !$internalSettings || !hasRequiredSettings($internalSettings)}
	<div class="container mx-auto p-4">
		<p class="mb-4">Please configure the required settings to continue.</p>
		<Settings />
	</div>
{:else}
	<slot />
{/if}
