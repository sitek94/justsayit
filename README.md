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
  - [ ] language selection
- [x] auto update
- [x] tray icon menu
  - [x] quit
  - [x] settings
- [x] history (simple, stored in file system: audio + transcript + llm response)

### v0.1

- REFACTOR

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

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) +
  [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) +
  [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Resources

- https://github.com/open-webui/open-webui/blob/main/.github/workflows/build-release.yml - nice workflow
