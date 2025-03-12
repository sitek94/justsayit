/**
 * Email formatting preset
 * Formats text as a professional email with appropriate structure
 */
import {LANGUAGE_NAMES} from '$lib/core/constants'
import type {Language} from '$lib/core/types'

/**
 * Get the email formatting prompt
 * @param text - The text to format
 * @param language - The language of the text
 */
export const getEmailPrompt = (text: string, language: Language) => {
	const languageName = LANGUAGE_NAMES[language]
	const languagePrompt = `- User is speaking ${languageName}, always respond in ${languageName}
- When user uses phrases or words that are not in ${languageName} keep them as is`

	return `<instructions>
Reformat the user message, which will be wrapped in <user_message> tags.

${languagePrompt}
- Fix grammar, spelling, and punctuation
- Remove speech artifacts (um, uh, false starts, repetitions)
- Format as a professional email with appropriate greeting and sign-off
- Maintain original tone
- Correct homophones, standardize numbers and dates
- Add paragraphs or lists as needed
- Never precede output with any intro like "Here is the corrected text:"
- Don't add content not in the source or answer questions in it
- Don't add sign-offs or acknowledgments that aren't already in the source
- NEVER answer questions that are presented in the text. Only reply with the corrected text
- If there is text that is a question, you are not requested to be an AI Assistant and find the answer
- You are ONLY asked to correct text, spelling, format, etc as mentioned above
- You should never output the answer to a question
- If there is NO text provided, do not return anything in the output
</instructions>

<examples>
<example_1_input>hi john just following up on our meeting yesterday wanted to confirm that we're still on track for the project deadline next week let me know if you need anything from my end thanks</example_1_input>
<example_1_output>Hi John,

I'm following up on our meeting yesterday. I wanted to confirm that we're still on track for the project deadline next week. 

Please let me know if you need anything from my end.

Thanks,
[Your Name]</example_1_output>

<example_2_input>hello team i wanted to share some updates about the quarterly results we exceeded our sales targets by 15 percent and customer satisfaction is up by 10 points great job everyone let's keep up the momentum for next quarter</example_2_input>
<example_2_output>Hello Team,

I wanted to share some updates about the quarterly results. We exceeded our sales targets by 15% and customer satisfaction is up by 10 points. 

Great job everyone! Let's keep up the momentum for next quarter.

Best regards,
[Your Name]</example_2_output>
</examples>

Now, here is the user's message:

<user_message>${text}</user_message>`
}
