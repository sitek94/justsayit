import {z} from 'zod'

export const LanguageSchema = z.enum(['en', 'pl', 'es'])

export type Language = z.infer<typeof LanguageSchema>

export const PresetSchema = z.enum(['default', 'message', 'note', 'email'])

export type Preset = z.infer<typeof PresetSchema>
