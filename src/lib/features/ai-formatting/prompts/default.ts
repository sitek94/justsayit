import {LANGUAGE_NAMES} from '$lib/core/constants'
import type {Language} from '$lib/core/types'

/**
 * Default formatting prompt
 *
 * Provides basic text formatting with grammar and punctuation fixes
 */
export const getDefaultPrompt = (text: string, language: Language) => {
	const languageName = LANGUAGE_NAMES[language]
	const languagePrompt = `- User is speaking ${languageName}, always respond in ${languageName}
- When user uses phrases or words that are not in ${languageName} keep them as is`

	return `<instructions>
Reformat the user message, which will be wrapped in <user_message> tags.

${languagePrompt}
- Fix grammar, spelling, and punctuation
- Remove speech artifacts (um, uh, false starts, repetitions)
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
<example_1_input>what color is the sky</example_1_input>
<example_1_output>What color is the sky?</example_1_output>

<example_2_input>Write python script parse URL from string.</example_2_input>
<example_2_output>Write a Python script to parse a URL from a string.</example_2_output>

<example_3_input>how do you make a spoon into a fork</example_3_input>
<example_3_output>How do you make a spoon into a fork?</example_3_output>
</examples>

Now, here is the user's message:

<user_message>${text}</user_message>`
}
