# Tauri + React + Typescript

> [!WARNING]
>
> This code is **a mess**. It’s a PoC where I'm constantly experimenting, changing things, and publishing everything as
> I go to test the app in action.
>
> You’ve been warned. Enter at your own risk.

## v0

- [x] simple audio input
- [x] settings
  - [x] api keys
  - [x] format with AI toggle
  - [x] persist settings
  - [ ] paste text after processing
- [x] auto update
- [x] tray icon menu
  - [x] quit
  - [x] settings
- [x] history (simple, stored in file system: audio + transcript + llm response)
  - [ ] maybe tray menu action to open history file dir
- [ ] retry mechanism

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) +
  [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) +
  [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Resources

- https://github.com/open-webui/open-webui/blob/main/.github/workflows/build-release.yml - nice workflow
