import {onOpenUrl} from '@tauri-apps/plugin-deep-link'
import {z} from 'zod'
import {LanguageSchema, PresetSchema} from '$lib/core/schemas'
import {openSettingsWindow} from '$lib/services/windows'

const ParamsSchema = z.object({
	ai: z.coerce.boolean().optional(),
	preset: PresetSchema.optional(),
	lang: LanguageSchema.optional(),
})

type Params = z.infer<typeof ParamsSchema>

export async function initializeDeepLinks({
	onStart,
	onState,
}: {
	onStart: (params: Params) => Promise<void>
	onState: (params: Params) => Promise<void>
}) {
	await onOpenUrl(async urls => {
		// E.g. justsayit://start?ai=true&lang=pl
		const url = new URL(urls[0])

		console.log(`[Deep Link] ${url}`)

		const action = url.host
		const search = url.search

		switch (action) {
			case 'settings':
				console.log(`[Deep Link] Opening settings window`)
				await openSettingsWindow()
				break

			case 'start': {
				const params = parseParams(search, ParamsSchema)
				console.log(`[Deep Link] Starting recording`, params)
				await onStart(params ?? {})
				break
			}

			case 'state': {
				const params = parseParams(search, ParamsSchema)
				console.log(`[Deep Link] Updating state`, params)
				await onState(params ?? {})
				break
			}

			default:
				console.log(`[Deep Link] Unknown action: ${action}`)
				break
		}
	})
}

function parseParams<T extends z.ZodSchema>(searchString: string, schema: T) {
	const queryParams = new URLSearchParams(searchString)
	const result = schema.safeParse(Object.fromEntries(queryParams))

	if (!result.success) {
		console.error(`[Deep Link] Invalid params`, result.error.flatten())
		return null
	}

	return result.data as z.infer<T>
}
