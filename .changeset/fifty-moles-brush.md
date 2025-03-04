---
'justsayit': patch
---

fix app interfering with other apps using mic

## Problem

When recording audio I faced two issues:

1. Stopping the media stream completely after recording makes the next recording start much slower.
2. Not stopping the media stream completely makes the app interfere with other apps using the microphone.

## Solution

After stopping the recording, I mute the media stream track:

1. After recording, I mute the microphone track instead of stopping it completely:

```ts
mediaStream?.getAudioTracks().forEach(track => {
	track.enabled = false // Mute the track
})
```

2. I added a method to fully stop the microphone connection when needed:

```ts
async function stopMediaStream() {
	if (mediaStream) {
		mediaStream.getTracks().forEach(track => track.stop())
	}
}
```

This gives me faster recording starts while allowing other apps to use the microphone when needed.
