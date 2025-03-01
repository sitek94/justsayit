/**
 * Core store for the JustSayIt application
 */
import {LazyStore} from '@tauri-apps/plugin-store'
import {writable, derived, type Writable} from 'svelte/store'
import {
	DEFAULT_AI_MODEL,
	DEFAULT_FORMATTING_PRESET,
	DEFAULT_LANGUAGE,
	DEFAULT_PRESETS,
} from './constants'
import type {Settings, AiModel, FormattingPreset, Language, PresetConfig} from './types'

// Settings store
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

// Application state
export const isLoading = writable(false)
export const formatWithAi = writable(true)
export const currentPreset = writable<FormattingPreset>(DEFAULT_FORMATTING_PRESET)
export const currentAiModel = writable<AiModel>(DEFAULT_AI_MODEL)
export const currentLanguage = writable<Language>(DEFAULT_LANGUAGE)
export const isRecording = writable(false)

// Presets
export const presets = writable<PresetConfig[]>(DEFAULT_PRESETS)
export const activePresetId = writable<string>(DEFAULT_PRESETS[0].id)

// Derived active preset
export const activePreset = derived([presets, activePresetId], ([$presets, $activePresetId]) => {
	return $presets.find(preset => preset.id === $activePresetId) || $presets[0]
})

// Initialize settings
export async function initializeSettings() {
	const storedSettings = await persistentStore.get<Settings>('settings')
	internalSettings.set(storedSettings ?? null)
}

// Subscribe to changes and persist them
internalSettings.subscribe(async value => {
	if (value) {
		await persistentStore.set('settings', value)
	}
})

// Settings validation
export function hasRequiredSettings(settings: Settings | null): settings is Settings {
	if (!settings) return false
	return Boolean(settings.groqApiKey && settings.openaiApiKey && settings.anthropicApiKey)
}

// Update functions
export function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
	internalSettings.update(current => {
		if (!current) current = {} as Settings
		return {...current, [key]: value}
	})
}

export function updateSettings(newSettings: Settings) {
	internalSettings.set(newSettings)
}

// Apply preset configuration
export function applyPreset(presetId: string) {
	activePresetId.set(presetId)

	// Update related stores based on the active preset
	const preset = derived([presets, activePresetId], ([$presets, $activePresetId]) => {
		return $presets.find(p => p.id === $activePresetId) || $presets[0]
	})

	preset.subscribe(value => {
		currentPreset.set(value.preset)
		currentAiModel.set(value.model)
		currentLanguage.set(value.language)
	})
}
