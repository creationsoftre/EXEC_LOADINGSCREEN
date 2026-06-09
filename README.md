# exec_loadingscreen

Standalone FiveM loading screen package with video, music, logo support, and a built-in mute toggle.

## Dependencies

- No hard dependencies

## Installation

1. Copy the `exec_loadingscreen` folder into your server `resources` directory.
2. Add the resource to `server.cfg`.

```cfg
ensure exec_loadingscreen
```

## Included Assets

- `html/assets/logo.png`
- `html/assets/bgvideo.mp4`
- `html/assets/music.mp3`
- `config.lua`

## Customization

- Edit `config.lua` to change the title, logo, video, audio, and progress labels
- Replace the logo in `html/assets/logo.png`
- Replace the background video in `html/assets/bgvideo.mp4`
- Replace the music file in `html/assets/music.mp3`
- Adjust layout and styling in `html/css/style.css`

## Config

The loadscreen now reads its settings from `config.lua`.

Supported sections:

- `branding.title`
- `branding.showLogo`
- `branding.logo`
- `background.useVideo`
- `background.video`
- `audio.enabled`
- `audio.src`
- `audio.volume`
- `audio.loop`
- `audio.autoplay`
- `audio.playText`
- `audio.pauseText`
- `progressLabels.preparingSession`
- `progressLabels.initializingResources`
- `progressLabels.loadingAssets`
- `progressLabels.loadingMap`
