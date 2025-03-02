<script lang="ts">
	import {settings, updateSettings} from '$lib/core/settings'
	import type {Settings} from '$lib/core/types'

	let currentSettings: Settings = $settings ?? {
		apiKeys: {
			groq: '',
			openai: '',
			anthropic: '',
		},
	}

	function handleSubmit() {
		updateSettings(currentSettings)
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="max-w-md space-y-4">
	<div>
		<label for="groqApiKey" class="mb-2 block text-sm font-medium">
			GROQ API Key
			<span class="text-red-500">*</span>
		</label>
		<input
			type="text"
			id="groqApiKey"
			bind:value={currentSettings.apiKeys.groq}
			class="w-full rounded-lg border border-gray-300 p-2.5"
			required
		/>
	</div>

	<div>
		<label for="openaiApiKey" class="mb-2 block text-sm font-medium">OpenAI API Key</label>
		<input
			type="text"
			id="openaiApiKey"
			bind:value={currentSettings.apiKeys.openai}
			class="w-full rounded-lg border border-gray-300 p-2.5"
		/>
	</div>

	<div>
		<label for="anthropicApiKey" class="mb-2 block text-sm font-medium">Anthropic API Key</label>
		<input
			type="text"
			id="anthropicApiKey"
			bind:value={currentSettings.apiKeys.anthropic}
			class="w-full rounded-lg border border-gray-300 p-2.5"
		/>
	</div>

	<button
		type="submit"
		class="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
	>
		Save Settings
	</button>
</form>
