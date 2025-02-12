<script lang="ts">
	import {defaultWindowIcon} from '@tauri-apps/api/app'
	import {Menu} from '@tauri-apps/api/menu'
	import {TrayIcon} from '@tauri-apps/api/tray'
	import {WebviewWindow} from '@tauri-apps/api/webviewWindow'
	import {exit} from '@tauri-apps/plugin-process'
	import {onDestroy, onMount, type Snippet} from 'svelte'
	import {fileSystem} from '$lib/file-system'
	import {hasRequiredSettings, initializeSettings, internalSettings} from '$lib/settings'
	import Settings from '$lib/settings.svelte'
	let {children}: {children: Snippet} = $props()
	let isLoading = $state(true)
	let trayId = $state<string | null>(null)

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
				{
					id: 'settings',
					text: 'Settings',
					action: async () => {
						const webview = new WebviewWindow('settings', {
							title: 'Settings',
							decorations: true,
							resizable: false,
							width: 300,
							height: 350,
							url: '/settings',
						})

						webview.once('tauri://created', () => {
							webview.show()
						})
						webview.once('tauri://error', e => {
							console.error(e)
						})
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

		trayId = tray.id

		await fileSystem.ensureAppDirectoriesExist()

		isLoading = false
	})

	onDestroy(() => {
		if (trayId) {
			TrayIcon.removeById(trayId)
		}
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
	{@render children()}
{/if}
