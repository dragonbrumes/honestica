## Levels

Each level is in a different branch.
level1 in the level1 branch
level2 in the level2 branch
...
Level5 is final branch

## Level 5

- git checkout lvl5 for show this level code
- npm run desktop-dev to launch Electron in dev mode.
- npm run desktop-exe to launch the build of the Electron executable in the dist folder. Double click on it to install on Windows

It's Electron who is in charge of watching if a new file is added to the directory.
The "directory watcher" and the "file getter" are in public/electron.js (aka main.js).
