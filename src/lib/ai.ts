import {createOpenAI} from '@ai-sdk/openai'
import {generateText} from 'ai'

export const ai = {
	format,
}

async function format(
	text: string,
	apiKey: string,
	preset: 'default' | 'message' | 'note' | 'email',
) {
	const openai = createOpenAI({apiKey})
	const response = await generateText({
		model: openai('gpt-4o-mini-2024-07-18'),
		prompt: getPrompt(text, preset),
	})

	return response.text
}

function getPrompt(userMessage: string, preset: 'default' | 'message' | 'note' | 'email') {
	switch (preset) {
		case 'note':
			return `<instructions>
- Reformat the user message, which will be wrapped in <user_message> tags.
- Structure it for effective note-taking.
- Ensure that key points, ideas, or action items are clearly highlighted.
- Check for correct grammar and punctuation.
- Keep the tone the same as given.
- Use as much of the original text as possible.
- Reply with just the reformatted text.
</instructions>

Here are some examples:

<examples>
<example_1_input>Today's lecture covered various aspects of Renaissance Art. We delved into the works and contributions of key artists like Leonardo da Vinci, Michelangelo, and Raphael. The discussion also included their notable works such as the Mona Lisa, The Last Supper, and the Sistine Chapel Ceiling. Important themes like humanism, realism, and the use of perspective were highlighted. Additionally, the lecture touched upon the Renaissance's impact on art, notably the shift from religious to secular themes and the emphasis on individualism.</example_1_input>
<example_1_output>Lecture on Renaissance Art:
- Key Artists: Leonardo da Vinci, Michelangelo, Raphael
- Notable Works: Mona Lisa, The Last Supper, Sistine Chapel Ceiling
- Themes: Humanism, realism, use of perspective
- Renaissance impact: Shift from religious to secular themes, emphasis on individualism</example_1_output>

<example_2_input>In our latest project meeting, we reviewed the current status of the project. We've successfully completed the design phase of Phase 1, which is ahead of schedule. We've now entered Phase 2, which involves development. However, we're facing some initial challenges with code integration. Our goal is to complete Phase 2 by the end of Q3. To stay on track, we need to resolve the coding issues as soon as possible and start preparing the resources for Phase 3.</example_2_input>
<example_2_output>Project Progress Notes:
- Phase 1: Design completed, ahead of schedule
- Phase 2: Development started, initial challenges with code integration
- Upcoming Milestones: Complete phase 2 by end of Q3
- Action Items: Resolve coding issues, prepare phase 3 resources</example_2_output>
</examples>

Now, here is the user's message:

<user_message>${userMessage}</user_message>`

		case 'message':
			return `<instructions>
Reformat the user message, which will be wrapped in <user_message> tags.

- User is speaking English
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

<user_message>${userMessage}</user_message>`

		case 'email':
			return `<instructions>
- Reformat the user message, which will be wrapped in <user_message> tags.
- Structure it for email communication.
- Include a greeting and a sign-off.
- Action items or requests should be highlighted.
- Check for correct grammar and punctuation.
- Do not change the tone.
- Use as much of the original text as possible.
- Sign off each email just "Thanks," or "Cheers,".
- If the name of the recipient isn't known use "Hey there," for greeting.
</instructions>

Here are some examples:

<examples>
<example_1_input>Curious whats going on here.</example_1_input>
<example_1_output>Hey there,

Curious, what is going on here?

Thanks,</example_1_output>

<example_2_input>Hey it was so good to see you, would love to have you over to the house sometime soon</example_2_input>
<example_2_output>Hey,

It was so good to see you, would love to have you over to the house sometime soon!

Cheers,</example_2_output>

<example_3_input>>> Emil was incredible seeing what post hog has done in the past year.  Would love to jump on a call and see if iron table VC is a good fit.</example_3_input>
<example_3_output>Hey Emil,

It was incredible seeing what PostHog has done in the past year.

I would love to jump on a call and discuss if IronTable VC would be a good fit.

Thanks,</example_3_output>

<example_4_input>Marty I'm not going to tell you again we need to get this project done ASAP. I've been trying to get this across the line since Q4 last year and it's still not shipped. It's a big problem for us and it's really holding us up. You need to get this done now.</example_4_input>
<example_4_output>Marty,

I'm not going to tell you again we need to get this project done as soon as possible.
I've been trying to get this across the line since Q4 last year and it's still not shipped.

It's a big problem for us and it's really holding us up.
You need to get this done now.

Thank you,</example_4_output>

<example_5_input>hey we've been having some issues with the new software. it's not syncing correctly with our database. can you look into this asap? we're falling behind schedule because of this</example_5_input>
<example_5_output>Hey there,

We've been experiencing issues with the new software; it's not syncing correctly with our database.

Can you look into this as soon as possible?
We're falling behind schedule due to this problem.

Thank you,</example_5_output>
</examples>

Now, here is the user's message:

<user_message>${userMessage}</user_message>`

		case 'default':
		default:
			return `<instructions>
Reformat the user message, which will be wrapped in <user_message> tags.

- User is speaking English
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

<user_message>${userMessage}</user_message>`
	}
}
