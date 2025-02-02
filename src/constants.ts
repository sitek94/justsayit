export const env = {
	// TODO: For development only, create a settings so that user can set their own API key
	GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY,
}

export const modelNames = {
	whisperLargeV3: 'whisper-large-v3',
}
