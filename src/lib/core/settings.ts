import {LazyStore} from '@tauri-apps/plugin-store'
import {get, writable, type Writable} from 'svelte/store'
import {z} from 'zod'

export const SettingsSchema = z.object({
	apiKeys: z.object({
		groq: z.string().nonempty(),
		openai: z.string().nonempty(),
		anthropic: z.string().nonempty(),
	}),
})

export type Settings = z.infer<typeof SettingsSchema>

const persistentStore = new LazyStore('settings.json')

export const settings: Writable<Settings | null> = writable(null)

export async function initializeSettings() {
	const storedSettings = await persistentStore.get<Settings>('settings')
	settings.set(storedSettings ?? null)
}

settings.subscribe(async value => {
	if (value) {
		await persistentStore.set('settings', value)
	}
})

export function updateSettings(newSettings: Settings) {
	settings.set(newSettings)
}

export function requireApiKeys() {
	const apiKeys = get(settings)?.apiKeys
	if (!apiKeys) throw new Error('Settings not initialized')

	return apiKeys
}

export function requireApiKey(key: keyof Settings['apiKeys']) {
	const apiKeys = requireApiKeys()
	if (!apiKeys[key]) throw new Error(`API key ${key} not initialized`)
	return apiKeys[key]
}

export function hasRequiredSettings(settings: Settings | null) {
	return SettingsSchema.safeParse(settings).success
}
