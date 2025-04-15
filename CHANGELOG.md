# justsayit

## 0.1.11

### Patch Changes

- fix parsing ai deep link param ([`c19bc7f`](https://github.com/sitek94/justsayit/commit/c19bc7feb89b5cc5eb16c1de2734c6d5cd78994a))

## 0.1.10

### Patch Changes

- add simple deep links support ([`78e0487`](https://github.com/sitek94/justsayit/commit/78e048725b596e11a47e53cf74f84bdca1e62d1e))

## 0.1.9

### Patch Changes

- focus main window when toggling visibility and improve prompts ([`dcc51ee`](https://github.com/sitek94/justsayit/commit/dcc51ee7191a15c22520b7ca400e3005a23e6a91))

## 0.1.8

### Patch Changes

- fix applying presets ([`361a30c`](https://github.com/sitek94/justsayit/commit/361a30c7a963585be70cd8fd6ae36371d5092a11))

- handle errors when checking for updates ([`7e78464`](https://github.com/sitek94/justsayit/commit/7e78464b4faf754b7c3b4bc2d187f62ab705e59e))

## 0.1.7

### Patch Changes

- fix changing language ([`8833999`](https://github.com/sitek94/justsayit/commit/88339992a0d6c9be5f66e29eb083e2416681cb8a))

- add more shortcuts ([`6156f44`](https://github.com/sitek94/justsayit/commit/6156f44ee563611e94ae3a53faa4ca626bc57240))

## 0.1.6

### Patch Changes

- ensure playing sound and processing is done before hiding window ([`16b6c71`](https://github.com/sitek94/justsayit/commit/16b6c71223c8427d10accf638546ca949dc62ef6))

## 0.1.5

### Patch Changes

- add transparency and border radius to main app window ([`722ab26`](https://github.com/sitek94/justsayit/commit/722ab262519b24452be3035d9817bc1672d822b3))

## 0.1.4

### Patch Changes

- fix app interfering with other apps using mic ([`b723284`](https://github.com/sitek94/justsayit/commit/b723284ec7ba64924bb5f57b445ce590ff67221a))

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

## 0.1.3

### Patch Changes

- use turbo whisper model for stt ([`ff4212f`](https://github.com/sitek94/justsayit/commit/ff4212f9e1a36b66953495f21f2788e6fffd4531))

- improve hiding showing app; add shortcut for just toggling visibility ([`4ab2938`](https://github.com/sitek94/justsayit/commit/4ab29387190ab637060046ae7fdd2857eb6c9d7e))

## 0.1.2

### Patch Changes

- paste text from clipboard at cursor after stopping recording ([`cbe6a89`](https://github.com/sitek94/justsayit/commit/cbe6a89062c0b54a052119d46b6d512918ff0d08))

## 0.1.1

### Patch Changes

- bring app to front and hide it on shortcut ([`bd988a9`](https://github.com/sitek94/justsayit/commit/bd988a9a7211538733af9628ef0091f78aa08925))

## 0.1.0

### Minor Changes

- refactor! ([`0ada4d9`](https://github.com/sitek94/justsayit/commit/0ada4d9bd73e8fdd0c62aaec4d55575243a64b0e))

## 0.0.18

### Patch Changes

- add language selection ([`6e4749b`](https://github.com/sitek94/justsayit/commit/6e4749ba6c2241a565a49992e2e41122dc3e2c4f))

## 0.0.17

### Patch Changes

- bump deps ([`eb21b70`](https://github.com/sitek94/justsayit/commit/eb21b70d1b85c7232569b1b663c959e2c663f632))

- - persist raw transcript ([`3d34413`](https://github.com/sitek94/justsayit/commit/3d3441384baa9b7b5c46603cd22009987efa9832))
  - add ai formatting presets
  - add model selection
  - add anthropic model

## 0.0.16

### Patch Changes

- bump version ([`5a6665e`](https://github.com/sitek94/justsayit/commit/5a6665e145c7a30a74ab62da0a91434b48d94c57))

## 0.0.15

### Patch Changes

- save recordings and transcripts ([`6488067`](https://github.com/sitek94/justsayit/commit/6488067bae6fce72a49aec1feba5b9e017b45e3f))

## 0.0.14

### Patch Changes

- - format transcript using llm ([`648ecbb`](https://github.com/sitek94/justsayit/commit/648ecbb074d622aaa483d4eefe9a4d1a91da5fa9))
  - open settings in new webview window
  - add system tray with quit action
  - make app window draggable

## 0.0.13

### Patch Changes

- simplify ui, add sounds and remove window decorations ([`1b416f2`](https://github.com/sitek94/justsayit/commit/1b416f2658841b3b4e101c08a13de95c0a1ada9e))

- persist user settings ([`4765fef`](https://github.com/sitek94/justsayit/commit/4765fefb2a0816186e9c420e011adeb8cb3085ea))

- bring app to front on global shortcut and start recording ([`51973db`](https://github.com/sitek94/justsayit/commit/51973db62ed1ab03bf3444fc92c6373d3ae1ce8a))

## 0.0.12

### Patch Changes

- remove duplicate debug argument ([`73a8b3c`](https://github.com/sitek94/justsayit/commit/73a8b3cb924167ad50e0d58bb6274a9750f7a2b9))

## 0.0.11

### Patch Changes

- include debug build ([`6496bf5`](https://github.com/sitek94/justsayit/commit/6496bf5fc34a91a836b41725e2260d1ad7cc3068))

## 0.0.10

### Patch Changes

- enable debug build in production ([`d734c0e`](https://github.com/sitek94/justsayit/commit/d734c0ef7bcb2ac24c19e254e75beebde9aecb65))

## 0.0.9

### Patch Changes

- add groq api key input ([`ee9daf7`](https://github.com/sitek94/justsayit/commit/ee9daf760e03ba83458971133544327eada6eb60))

## 0.0.8

### Patch Changes

- fix sveltekit static adapter configuration ([`468b397`](https://github.com/sitek94/justsayit/commit/468b3976129497aeceba39248374352ad3828f99))

## 0.0.7

### Patch Changes

- fix versioning ([`59adb1a`](https://github.com/sitek94/justsayit/commit/59adb1a6dfa3070d04a58278f979e6ace8179efa))

## 0.0.6

### Patch Changes

- fix build ([`b8aa97a`](https://github.com/sitek94/justsayit/commit/b8aa97aa9fac878953de9258380c1fd319cb96b4))

## 0.0.5

### Patch Changes

- reorganize github actions ([`861d7f8`](https://github.com/sitek94/justsayit/commit/861d7f8ee49c4123c102abcf6cb61c2c836f61b1))

## 0.0.4

### Patch Changes

- implement super raw but working poc ([`ae97f58`](https://github.com/sitek94/justsayit/commit/ae97f588a71a07ab5529ae47d98a0084020b8826))

  - press <kbd>ctrl+Q</kbd> to start/stop recording
  - visualize audio in real time
  - send audio to groq for transcription
  - display transcription
  - copy transcription to clipboard

## 0.0.3

### Patch Changes

- use tauri dialog plugin and update app update flow ([`f593c5e`](https://github.com/sitek94/justsayit/commit/f593c5e043ae094c8d10c66b9bdbbee923c73199))

## 0.0.2

### Patch Changes

- rename template ([`b451d54`](https://github.com/sitek94/justsayit/commit/b451d541af67c26ffe05e0bffdf0575cb70f2f41))

- add missing plugins ([`31565db`](https://github.com/sitek94/justsayit/commit/31565dba346cad0078dde520f327e852343f2701))
