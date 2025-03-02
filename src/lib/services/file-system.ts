import * as path from '@tauri-apps/api/path'
import {BaseDirectory, exists, mkdir, writeFile, writeTextFile} from '@tauri-apps/plugin-fs'

/**
 * ~/Documents/justsayit/recordings
 *                       - 1714630200000
 *                         - recording.mp3
 *                         - transcript.txt
 *                         - raw.txt
 */

const BASE_DIR = BaseDirectory.Document
const APP_DIR = 'justsayit'
const RECORDINGS_DIR = 'recordings'

type RecordingResult = {
	audio: Blob
	transcript: string
	raw: string
}

export const fileSystem = {
	ensureAppDirectoriesExist: async () => {
		const appDirPath = await path.join(APP_DIR)
		const recordingsDirPath = await path.join(APP_DIR, RECORDINGS_DIR)

		if (!(await exists(appDirPath, {baseDir: BASE_DIR}))) {
			await mkdir(appDirPath, {baseDir: BASE_DIR, recursive: true})
		}

		if (!(await exists(recordingsDirPath, {baseDir: BASE_DIR}))) {
			await mkdir(recordingsDirPath, {baseDir: BASE_DIR, recursive: true})
		}

		return appDirPath
	},

	saveRecording: async (recording: RecordingResult) => {
		await fileSystem.ensureAppDirectoriesExist()

		const timestamp = Date.now().toString()
		const recordingDirPath = await path.join(APP_DIR, RECORDINGS_DIR, timestamp)

		await mkdir(recordingDirPath, {baseDir: BASE_DIR, recursive: true})

		const audioData = await blobToUint8Array(recording.audio)
		const audioPath = await path.join(recordingDirPath, 'recording.mp3')
		await writeFile(audioPath, audioData, {baseDir: BASE_DIR})

		const transcriptPath = await path.join(recordingDirPath, 'transcript.txt')
		await writeTextFile(transcriptPath, recording.transcript, {baseDir: BASE_DIR})

		const rawPath = await path.join(recordingDirPath, 'raw.txt')
		await writeTextFile(rawPath, recording.raw, {baseDir: BASE_DIR})

		return recordingDirPath
	},
}

/**
 * Convert a Blob to Uint8Array for file system operations
 */
async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
	const arrayBuffer = await blob.arrayBuffer()
	return new Uint8Array(arrayBuffer)
}
