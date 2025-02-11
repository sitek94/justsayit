<script lang="ts">
	import {defaultWindowIcon} from '@tauri-apps/api/app'
	import {Menu} from '@tauri-apps/api/menu'
	import {TrayIcon} from '@tauri-apps/api/tray'
	import {exit} from '@tauri-apps/plugin-process'
	import {onMount, type Snippet} from 'svelte'
	import {hasRequiredSettings, initializeSettings, internalSettings} from '$lib/settings'
	import Settings from '$lib/settings.svelte'

	let {children} = $props<{children: Snippet}>()
	let isLoading = $state(true)

	onMount(async () => {
		await initializeSettings()

		const menu = await Menu.new({
			items: [
				{
					id: 'quit',
					text: 'Quit',
					action: async () => {
						await exit()
					},
				},
			],
		})

		const options = {
			menu,
			menuOnLeftClick: true,
			icon: (await defaultWindowIcon())!,
		}

		const tray = await TrayIcon.new(options)

		console.log(tray)

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
	{@render $children()}
{/if}
