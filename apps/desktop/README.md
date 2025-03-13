# Desktop

This is a [Wails v3](https://github.com/wailsapp/wails) application.

How to package the app using a mac for all platforms:
- [Windows](https://wails.io/docs/guides/windows-installer)
  - If you have issues, check if forward slashes are causing issues as in the windows taskfile
- Darwin (mac):
  - opt for the universal build
- Linux:
  - `brew install x86_64-unknown-linux-gnu`
  - Use `CC=x86_64-unknown-linux-gnu-gcc CGO_ENABLED=1 GOARCH=amd64 GOOS=linux` before build cmd in the linux taskfile
  - `brew install gtk+3`
