import {generateText} from 'ai'
import {getModelProvider, type ModelName} from './providers'

export type {ModelName}

export const ai = {
	generateText: async ({
		model,
		...params
	}: Omit<Parameters<typeof generateText>[0], 'model'> & {model: ModelName}) => {
		const provider = getModelProvider(model)
		const response = await generateText({
			...params,
			model: provider.getModel(model),
		})

		return response
	},
}
