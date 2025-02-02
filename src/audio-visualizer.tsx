import {useRef, useState} from 'react'

export function AudioVisualizer() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [isRecording, setIsRecording] = useState(false)

	// Store audio context and analyzer in refs since we don't need to trigger re-renders
	const audioContextRef = useRef<AudioContext | null>(null)
	const analyserRef = useRef<AnalyserNode | null>(null)
	const bufferLengthRef = useRef<number>(0)

	const animationFrameIdRef = useRef<number>()

	const getPos = (Hz: number, minHz: number, maxHz: number, max: number): number => {
		if (Hz > minHz) {
			return ((Math.log10(Hz) - Math.log10(minHz)) * max) / (Math.log10(maxHz) - Math.log10(minHz))
		}
		return 0
	}

	const getFFTbars = (fft: AnalyserNode, barCount: number, minHz = 20, maxHz = 12000): number[] => {
		const dataArray = new Float32Array(bufferLengthRef.current)
		fft.getFloatFrequencyData(dataArray)
		const out: number[] = []

		for (let i = 0; i < dataArray.length; i++) {
			const pos = Math.round(getPos((i * 24000) / dataArray.length, minHz, maxHz, barCount))
			if (pos < barCount) {
				if (!out[pos] || out[pos] < dataArray[i]) out[pos] = dataArray[i]
			}
		}

		for (let i = 0; i < barCount; i++) {
			if (!out[i]) {
				let prevIndex = 0
				let prevValue = 0

				if ((prevIndex = i - 1) < 0) {
					prevIndex = 0
					prevValue = 0
				} else {
					prevValue = out[prevIndex]
				}

				let nextIndex = 0
				let nextValue = 0

				for (let k = i; k < barCount; k++) {
					if (out[k]) {
						nextIndex = k
						nextValue = out[k]
						break
					}
				}

				if (!nextIndex) {
					nextIndex = barCount - 1
					nextValue = 0
				}

				out[i] = prevValue + (nextValue - prevValue) / (nextIndex - prevIndex)
			}
		}

		return out
	}

	const draw = () => {
		const canvas = canvasRef.current
		const canvasCtx = canvas?.getContext('2d')
		const analyser = analyserRef.current

		if (!canvas || !canvasCtx || !analyser) return

		const bars = getFFTbars(analyser, 72)
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
		canvasCtx.fillStyle = 'rgb(255, 255, 255)'
		canvasCtx.beginPath()

		for (let i = 0; i < bars.length; i++) {
			canvasCtx.rect(
				i * 10,
				// Halve movement range to reduce jumpiness
				canvas.height - ((bars[i] + 64) * (canvas.height / 2)) / 64,
				8,
				canvas.height,
			)
		}

		canvasCtx.fill()
	}

	const startVisualization = async () => {
		if (isRecording) return

		// cleanup old

		try {
			const audioCtx = new window.AudioContext()
			const stream = await navigator.mediaDevices.getUserMedia({audio: true})
			const source = audioCtx.createMediaStreamSource(stream)
			const analyser = audioCtx.createAnalyser()

			analyser.fftSize = 4096

			// Makes the bars go up and down more smoothly
			analyser.smoothingTimeConstant = 0.95
			bufferLengthRef.current = analyser.frequencyBinCount

			source.connect(analyser)

			audioContextRef.current = audioCtx
			analyserRef.current = analyser

			function animate() {
				draw()
				animationFrameIdRef.current = requestAnimationFrame(animate)
			}
			animationFrameIdRef.current = requestAnimationFrame(animate)

			setIsRecording(true)
		} catch (error) {
			console.error('Error initializing audio visualization:', error)
		}
	}

	const stopVisualization = () => {
		if (!isRecording) return

		if (animationFrameIdRef.current) {
			cancelAnimationFrame(animationFrameIdRef.current)
		}

		if (audioContextRef.current) {
			audioContextRef.current.close()
		}

		canvasRef.current
			?.getContext('2d')
			?.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height)

		setIsRecording(false)
	}

	return (
		<div>
			<div>
				<canvas ref={canvasRef} width={720} height={400} />
			</div>
			<div className="inline-flex gap-2">
				<button
					className="rounded-md bg-blue-500 px-4 py-2 text-white"
					onClick={startVisualization}
					disabled={isRecording}
				>
					Start Microphone Visualization
				</button>
				<button
					className="rounded-md bg-red-500 px-4 py-2 text-white"
					onClick={stopVisualization}
					disabled={!isRecording}
				>
					Stop Visualization
				</button>
			</div>
		</div>
	)
}
