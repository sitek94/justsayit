# Tauri + Svelte + Typescript

> [!WARNING]
>
> This code is **a mess**. It's a PoC where I'm constantly experimenting, changing things, and publishing everything as
> I go to test the app in action.
>
> You've been warned. Enter at your own risk.

## Roadmap

### v0

- [x] simple audio input
- [x] settings
  - [x] api keys
  - [x] format with AI toggle
  - [x] formatting preset selection (default, message, note, email)
  - [x] model selection
  - [x] persist settings
  - [x] language selection
- [x] auto update
- [x] tray icon menu
  - [x] quit
  - [x] settings
- [x] history (simple, stored in file system: audio + transcript + llm response)

### v0.1

- [x] REFACTOR

### v0.2

- [ ] retry mechanism
- [ ] tray menu action to open history file dir
- [ ] paste text after processing
- [ ] maybe this ai toggle is not needed now, one of the presets could be "no formatting"
- [ ] prevent sending empty messages (no audio)
- [ ] cancel recording
- [ ] add configs/presets/modes (need to decide on the name)
  - [ ] each config can have: formatting preset, ai model, language
  - [ ] choose one default config
  - [ ] assign shortcut to each config
- [ ] support local models

### v0.3

- [ ] webhooks - configure webhook and send transcript to it after processing

## Frontend Structure

The application follows a modular architecture with a clear separation between features and services:

- **Features**: Contain business logic and UI components for specific application features
- **Services**: Handle API interactions (Tauri, OpenAI, Grok, etc.) and provide a clean interface for features

```plaintext
src/
├── app.html
├── app.d.ts
├── routes/
│   ├── +layout.ts
│   ├── app/                         # Main app window
│   │   └── +layout.svelte
│   └── settings/                    # Settings window
├── lib/
│   ├── core/                        # Core functionalities
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── settings.ts
│   │   └── store.ts
│   ├── services/                    # Service layer for API interactions
│   │   ├── file-system.ts
│   │   ├── windows.ts
│   │   ├── clipboard.ts
│   │   ├── play-sound.ts
│   │   ├── transcription/
│   │   │   ├── index.ts
│   │   │   └── providers.ts         # Transcription providers (Grok, ...)
│   │   └── ai/
│   │       ├── index.ts
│   │       └── providers.ts         # AI providers (OpenAI, Anthropic, etc.)
│   ├── features/
│   │   ├── audio/                   # Audio recording and visualization
│   │   │   ├── recorder.svelte.ts
│   │   │   └── visualizer.svelte
│   │   ├── ai-formatting/           # AI text formatting
│   │   │   ├── formatting.ts
│   │   │   ├── presets.ts
│   │   │   └── prompts/
│   │   ├── app-updates.ts           # Automatic application updates
│   │   └── system-tray.ts           # System tray
│   ├── assets/
│   │   ├── sounds/
│   │   └── icons/
│   ├── global.css
│   └── ui/                          # (Future) Reusable UI components
│       └── components/              # (Future) UI component library
```

### Architectural Notes

- **Services Layer**: Introduced to handle API interactions and provide a clean interface for features
- **API Key Management**: API keys are stored in the central store and accessed directly by services for simplicity
- **Feature-Service Separation**: Features contain business logic while services handle external interactions
- **No Circular Dependencies**: Services are designed to avoid importing from one another

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) +
  [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) +
  [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Resources

- https://github.com/open-webui/open-webui/blob/main/.github/workflows/build-release.yml - nice workflow
