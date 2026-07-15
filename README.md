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

## Save file format

The save file is a GameMaker-style INI: `[Block]` headers and `Key="Value"`
pairs, one per line. Each block name, key and value is obfuscated with a simple
additive character cipher keyed by the repeating string `QWERTY` (`encoded =
plaintext + key`), and the whole thing is stored as UTF-8. The literal
delimiters `[`, `]`, `="`, `"` and the line breaks are **not** encrypted.

### The `[Decorations]` block is stored unencrypted

Newer game versions added a `[Decorations]` block that is **not** run through the
cipher — it holds a single plaintext, base64-encoded JSON blob:

```
[Decorations]
String="eyI5fHYiOjAuMCwiOHwxIjowLjAsIjV8..."
```

Encode/decode pass this block through verbatim (see `PLAINTEXT_BLOCKS` in
`src/core/saveFile.ts`). Decoding it as if it were ciphertext produces negative
code points and crashes — which is exactly what broke on the current game
version until this was handled.

Decoded, the blob is your placed **castle decorations**. It is a JSON object of
`"slot|property"` → number entries describing 10 decoration slots, e.g.:

| slot | x | y | d | v | h |
|------|------|------|------|---|---|
| 1 | 2400 | 1120 | 1266 | 0 | 0 |
| 2 | 1920 | 1344 | 122 | 0 | 0 |
| … | … | … | … | … | … |

where `x`/`y` are canvas coordinates, `v`/`h` look like vertical/horizontal flip
flags, and `d` is the decoration's type/depth (property meanings are inferred,
not taken from game source). It is cosmetic-only, so the tool deliberately does
not expose it for editing.

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
