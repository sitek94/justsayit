<script lang="ts">
	import * as d3 from 'd3'

	let {frequencyData}: {frequencyData: number[]} = $props()

	let canvas: HTMLCanvasElement

	$effect(() => {
		const ctx = canvas?.getContext('2d')

		if (!canvas || !ctx || !frequencyData.length) return

		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		const width = canvas.width
		const height = canvas.height

		const xScale = d3
			.scaleBand()
			.domain(d3.range(frequencyData.length).map(String))
			.range([0, width])
			.padding(0.1)
		const yScale = d3
			.scaleLinear()
			.domain([-80, 0])
			.range([10, height / 2])
			.clamp(true)

		const bars = frequencyData.map((value, index) => ({
			x: xScale(index.toString()) ?? 0,
			y: height - yScale(value) - height / 2,
			width: xScale.bandwidth(),
			height: yScale(value) * 2,
		}))

		ctx.fillStyle = 'rgb(255, 255, 255)'
		ctx.clearRect(0, 0, width, height)
		bars.forEach(bar => {
			ctx.fillRect(bar.x, bar.y, bar.width, bar.height)
		})
	})
</script>

<canvas class="border border-white" width={700} height={300} bind:this={canvas}></canvas>
