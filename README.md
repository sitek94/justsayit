# Tauri + React + Typescript

> [!WARNING]
>
> This code is **a mess**. It’s a PoC where I'm constantly experimenting, changing things, and publishing everything as
> I go to test the app in action.
>
> You’ve been warned. Enter at your own risk.

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

- [ ] REFACTOR

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
- support local models

### v0.3

- webhooks - configure webhook and send transcript to it after processing

## Frontend Structure

```plaintext
src/
├── app.html
├── app.d.ts
├── routes/
│   ├── +layout.svelte
│   ├── +layout.ts
│   ├── +page.svelte
│   └── settings/
│       └── +page.svelte
├── lib/
│   ├── core/
│   │   ├── types.ts                  # Shared type definitions
│   │   ├── constants.ts              # App-wide constants
│   │   └── store.ts                  # Core app state management
│   ├── features/
│   │   ├── audio/
│   │   │   ├── audio-recorder.ts     # Audio recording logic
│   │   │   ├── audio-visualizer.ts   # Visualization logic
│   │   │   ├── visualizer.svelte     # Visualization component
│   │   │   └── sounds/               # Audio files
│   │   ├── transcription/
│   │   │   ├── transcription.ts      # Transcription service
│   │   │   └── providers/
│   │   │       └── groq.ts           # Groq integration
│   │   ├── ai-formatting/
│   │   │   ├── formatting.ts         # Formatting service
│   │   │   ├── presets/              # Formatting presets
│   │   │   │   ├── default.ts
│   │   │   │   ├── message.ts
│   │   │   │   ├── note.ts
│   │   │   │   └── email.ts
│   │   │   └── providers/            # AI providers
│   │   │       ├── openai.ts
│   │   │       └── anthropic.ts
│   │   ├── shortcuts/
│   │   │   ├── shortcut-manager.ts   # Keyboard shortcut handling
│   │   │   └── presets.ts            # Preset configurations
│   │   ├── storage/
│   │   │   ├── file-system.ts        # File system operations
│   │   │   ├── settings.ts           # Settings management
│   │   │   └── settings.svelte       # Settings UI component
│   │   └── system/
│   │       ├── clipboard.ts          # Clipboard operations
│   │       └── tray.ts               # System tray functionality
│   ├── ui/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── button.svelte
│   │   │   ├── select.svelte
│   │   │   └── loading.svelte
│   │   └── styles/
│   │       └── global.css            # Global styles
│   └── utils/                        # Utility functions
│       ├── audio-utils.ts
│       └── format-utils.ts
└── assets/                           # Static assets
    └── icons/
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) +
  [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) +
  [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Resources

- https://github.com/open-webui/open-webui/blob/main/.github/workflows/build-release.yml - nice workflow
