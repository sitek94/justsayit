/**
 * Note formatting preset
 * Formats text as a structured note with bullet points and sections
 */
import {LANGUAGE_NAMES} from '$lib/core/constants'
import type {Language} from '$lib/core/types'

/**
 * Get the note formatting prompt
 * @param text - The text to format
 * @param language - The language of the text
 */
export const getNotePrompt = (text: string, language: Language) => {
	const languageName = LANGUAGE_NAMES[language]
	const languagePrompt = `- User is speaking ${languageName}, always respond in ${languageName}`

	return `<instructions>
Reformat the user message, which will be wrapped in <user_message> tags.

${languagePrompt}
- Fix grammar, spelling, and punctuation
- Remove speech artifacts (um, uh, false starts, repetitions)
- Format as a structured note with bullet points and sections where appropriate
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
<example_1_input>meeting notes from today we need to finish the project by friday and also make sure to order supplies for the office party next week john will handle the client presentation and sarah will prepare the financial report</example_1_input>
<example_1_output>Meeting Notes:

- Project deadline: Friday
- Office party supplies needed for next week
- Responsibilities:
  - John: Handle client presentation
  - Sarah: Prepare financial report</example_1_output>

<example_2_input>ideas for the new marketing campaign we could focus on social media engagement create video content for tiktok and instagram and maybe partner with some influencers we should also consider updating our website with new testimonials</example_2_input>
<example_2_output>Marketing Campaign Ideas:

- Social media engagement focus
- Content creation:
  - TikTok videos
  - Instagram content
- Potential influencer partnerships
- Website updates:
  - Add new testimonials</example_2_output>
</examples>

Now, here is the user's message:

<user_message>${text}</user_message>`
}
