import {documentDir, join} from '@tauri-apps/api/path'
import {BaseDirectory, exists, mkdir, writeFile, writeTextFile} from '@tauri-apps/plugin-fs'

/**
 * ~/Documents/justsayit/recordings
 *                       - 1714630200000
 *                         - recording.mp3
 *                         - transcript.txt
 *                         - raw.txt
 */

type RecordingResult = {
	audio: Blob
	transcript: string
	raw: string
}

class FileSystemService {
	private readonly baseDir = BaseDirectory.Document

	async getAppPath() {
		return await join(await documentDir(), 'justsayit')
	}

	async getRecordingsPath() {
		return await join(await this.getAppPath(), 'recordings')
	}

	async ensureAppDirectoriesExist() {
		const {baseDir} = this
		const appPath = await this.getAppPath()
		const recordingsPath = await this.getRecordingsPath()

		if (!(await exists(appPath, {baseDir}))) {
			await mkdir(appPath, {baseDir, recursive: true})
		}

		if (!(await exists(recordingsPath, {baseDir}))) {
			await mkdir(recordingsPath, {baseDir, recursive: true})
		}
	}

	async saveRecording(recording: RecordingResult) {
		const {baseDir} = this
		await this.ensureAppDirectoriesExist()

		const timestamp = Date.now().toString()
		const recordingPath = await join(await this.getRecordingsPath(), timestamp)

		await mkdir(recordingPath, {baseDir, recursive: true})

		const audioData = await this.blobToUint8Array(recording.audio)
		const audioPath = await join(recordingPath, 'recording.mp3')
		await writeFile(audioPath, audioData, {baseDir})

		const transcriptPath = await join(recordingPath, 'transcript.txt')
		await writeTextFile(transcriptPath, recording.transcript, {baseDir})

		const rawPath = await join(recordingPath, 'raw.txt')
		await writeTextFile(rawPath, recording.raw, {baseDir})
	}

	private async blobToUint8Array(blob: Blob): Promise<Uint8Array> {
		const arrayBuffer = await blob.arrayBuffer()
		return new Uint8Array(arrayBuffer)
	}
}

export const fileSystemService = new FileSystemService()
