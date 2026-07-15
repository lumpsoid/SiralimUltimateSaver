# SiralimUltimateSaver
Website for Siralim Ultimate Save file manipulation:
https://lumpsoid.github.io/SiralimUltimateSaver/. All manipulations on the file take place in your browser.

If you are interested in building builds, there is [the site](https://berated-bert.github.io/siralim-planner/) that can help you with it ([repo](https://github.com/berated-bert/siralim-planner)).

This project based on [gurgalex](https://github.com/gurgalex) work on implementing encryption and decryption of the Siralim save file ([his repo]( https://github.com/gurgalex/SiralimUltimateSaver)).

## Available manipulations
- Encrypt a save file
- Decrypt a save file
- Add:
  - resource:
    - all
    - brimstone
    - essence
    - power
    - crystal
    - granite
  - materials
  - dust
- Add mana for a summon
- Add knowledge about a creature
- Add a creature

## Tech stack

Plain TypeScript with no UI framework, bundled with [Vite](https://vitejs.dev/).
The save-file encryption/decryption and manipulation logic lives in
`src/core/saveFile.ts`; the UI is built from small DOM factory functions in
`src/ui/`.

## Running the app locally

To run the application locally, you'll need to have NodeJS and npm installed. Begin by installing the required packages, then start the dev server:
```sh
npm install
npm run dev
```

To create a production build and preview it:
```sh
npm run build
npm run preview
```

To deploy to GitHub Pages:
```sh
npm run deploy
```
