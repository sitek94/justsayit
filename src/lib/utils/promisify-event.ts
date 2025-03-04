/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Helper to promisify event-based APIs with better type safety
 *
 * This is especially useful for APIs like MediaRecorder where methods like stop()
 * don't return promises but instead trigger events asynchronously. Without this helper,
 * you can't directly await recorder.stop() since it returns immediately before the
 * recording has actually finished processing.
 */
export function promisifyEvent<T extends EventTarget>(
	target: T,
	eventName: string,
	action: () => void,
): Promise<void> {
	return new Promise(resolve => {
		const originalHandler = (target as any)[`on${eventName}`]

		;(target as any)[`on${eventName}`] = async (event: Event) => {
			if (originalHandler) {
				await originalHandler.call(target, event)
			}
			resolve()
		}

		action()
	})
}
