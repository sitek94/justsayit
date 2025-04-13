import {writable} from 'svelte/store'
import type {PresetName} from '$lib/features/ai-formatting'
import type {ModelName} from '$lib/services/ai'
import type {Language} from './types'

export const formatWithAi = writable(false)
export const preset = writable<PresetName>('default')
export const aiModel = writable<ModelName>('claude35Sonnet')
export const language = writable<Language>('en')
