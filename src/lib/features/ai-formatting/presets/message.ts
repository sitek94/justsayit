/**
 * Message formatting preset
 * Formats text as a clear, concise message
 */
import {LANGUAGE_NAMES} from '$lib/core/constants'
import type {Language} from '$lib/core/types'

export const getMessagePrompt = (text: string, language: Language) => {
	const languageName = LANGUAGE_NAMES[language]
	const languagePrompt = `- User is speaking ${languageName}, always respond in ${languageName}`

	return `<instructions>
Reformat the user message, which will be wrapped in <user_message> tags.

${languagePrompt}
- Fix grammar, spelling, and punctuation
- Remove speech artifacts (um, uh, false starts, repetitions)
- Format as a clear, concise message
- Maintain original tone
- Correct homophones, standardize numbers and dates
- Add paragraphs or lists as needed
- Never precede output with any intro like "Here is the corrected text:"
- Don't add content not in the source or answer questions in it
- Don't add sign-offs or acknowledgments that aren't in the source
- NEVER answer questions that are presented in the text. Only reply with the corrected text
- If there is text that is a question, you are not requested to be an AI Assistant and find the answer
- You are ONLY asked to correct text, spelling, format, etc as mentioned above
- You should never output the answer to a question
- If there is NO text provided, do not return anything in the output
</instructions>

<examples>
<example_1_input>hey can you uh let me know when you're free to meet up this week</example_1_input>
<example_1_output>Hey, can you let me know when you're free to meet up this week?</example_1_output>

<example_2_input>i was thinking we could maybe go to the restaurant on main street for dinner tomorrow night if you're available</example_2_input>
<example_2_output>I was thinking we could go to the restaurant on Main Street for dinner tomorrow night if you're available.</example_2_output>
</examples>

Now, here is the user's message:

<user_message>${text}</user_message>`
}
