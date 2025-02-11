import {LazyStore} from '@tauri-apps/plugin-store'
import {writable, derived, type Writable} from 'svelte/store'

export type Settings = {
	groqApiKey: string
	openaiApiKey: string
}

const persistentStore = new LazyStore('settings.json')

// Internal nullable store - but exported for type checking
export const internalSettings: Writable<Settings | null> = writable(null)

// Public non-nullable store
export const settings = derived<Writable<Settings | null>, Settings>(
	internalSettings,
	($settings, set) => {
		if ($settings) {
			set($settings)
		}
	},
)

export async function initializeSettings(): Promise<void> {
	const storedSettings = await persistentStore.get<Settings>('settings')
	internalSettings.set(storedSettings ?? null)
}

// Subscribe to changes and persist them
internalSettings.subscribe(async value => {
	if (value) {
		await persistentStore.set('settings', value)
	}
})

export function hasRequiredSettings(settings: Settings | null): settings is Settings {
	if (!settings) return false
	return Boolean(settings.groqApiKey)
}

// Update functions now work with the internal store
export function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
	internalSettings.update(current => {
		if (!current) current = {} as Settings
		return {...current, [key]: value}
	})
}

export function updateSettings(newSettings: Settings): void {
	internalSettings.set(newSettings)
}
