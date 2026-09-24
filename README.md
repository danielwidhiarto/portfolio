# Emmanuel Daniel Widhiarto — Portfolio

A minimal, editorial portfolio for teaching, research, and software engineering work. The home page features an auto-rotating 3D project map: hover to reveal a project, click to dolly in on its cover, and scroll to read its details. Hold either mouse button and drag to rotate the map. Keyboard-accessible project choices remain available as an alternative to the canvas.

The page also includes selected projects, profile, experience, research, education, tools, and contact sections, with a compact top navigation that adapts to mobile.

## Run locally

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project content

Project, experience, education, publication, technology, and social-link data live in `app/components/data.ts`. The featured project preview is `public/ProjectImage.jpg`.

## Checks

```bash
npm run lint
npm run build
```
