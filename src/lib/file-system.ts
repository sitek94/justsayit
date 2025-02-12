import * as path from '@tauri-apps/api/path'
import {exists, BaseDirectory, mkdir, writeFile, writeTextFile} from '@tauri-apps/plugin-fs'

const APP_DIR = 'justsayit'
const RECORDINGS_DIR = 'recordings'
const BASE_DIR = BaseDirectory.Document

const blobToUint8Array = async (blob: Blob): Promise<Uint8Array> => {
	const arrayBuffer = await blob.arrayBuffer()
	return new Uint8Array(arrayBuffer)
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

	saveRecording: async ({audio, transcript}: {audio: Blob; transcript: string}) => {
		await fileSystem.ensureAppDirectoriesExist()

		const timestamp = Date.now().toString()
		const recordingDirPath = await path.join(APP_DIR, RECORDINGS_DIR, timestamp)

		await mkdir(recordingDirPath, {baseDir: BASE_DIR, recursive: true})

		const audioData = await blobToUint8Array(audio)
		const audioPath = await path.join(recordingDirPath, 'recording.mp3')
		await writeFile(audioPath, audioData, {baseDir: BASE_DIR})

		const transcriptPath = await path.join(recordingDirPath, 'transcript.txt')
		await writeTextFile(transcriptPath, transcript, {baseDir: BASE_DIR})

		return recordingDirPath
	},
}
