# Delvekeeper Local Web App

## Purpose

Delvekeeper is a dependency-free single-page guided tabletop for the current Haunted Tomb vertical slice. It generates and presents the game as cards while leaving narrative intent and unusual rulings with the players.

## Run it

Open `index.html` directly in a modern browser. No installation or account is required.

For a stable local URL instead of a `file:` URL, run this command from the repository root and visit `http://localhost:8000`:

```console
python -m http.server 8000 --directory web
```

Pushes to `main` deploy the same `web/` directory to GitHub Pages through [the Pages workflow](../.github/workflows/pages.yml).

## Current capabilities

- seeded, reproducible Haunted Tomb expeditions;
- compact, standard, and sprawling macro-grids with E1–E3 escalation;
- all fifty authored room templates, including graphical terrain maps and template-based lighting;
- concrete, named Challenges with visible evidence, exact rules, consequences, and suggested resolutions;
- room-specific prose combining architecture, original function, haunting, terrain, and lighting;
- exact Opportunities and escalating Quest discoveries rather than unresolved category prompts;
- scaled creature and wandering-enemy cards with Instincts and Wounds;
- room conquest, Skill Tokens, HP, Wounds, Scars, items, and treatment;
- the shared torch clock, darkness, fixtures, secured light, and spare torches;
- known-room travel with persistent traversal costs and danger rolls;
- roll-high d20 checks, advantage/disadvantage, criticals, and dungeon actions;
- room notes and a chronological expedition log;
- automatic save/resume in browser `localStorage` plus JSON export/import.

The application deliberately permits manual adjustment. Current rules still require players to judge fictional positioning, target selection, what conquers a challenge, and creative solutions.

## Architecture

- `index.html` is the single page and application mount.
- `styles.css` contains the responsive card-and-tabletop interface.
- `data.js` contains the rules-facing room, quest, monster, character, and item data.
- `app.js` contains seeded generation, expedition state, persistence, and interaction logic.

There is no build step and no third-party runtime dependency.

The deployed app displays a manually advanced build number. A network-only service worker and build-versioned asset URLs prevent stale GitHub Pages assets from masking a deployment; expedition state remains stored separately in `localStorage`.

Saved rooms contain generation references (`sceneRef`) rather than copied prose or rules. Rendering resolves those references against the current canonical content, so wording corrections apply to existing expeditions.

Each room-template roll is one complete architectural result. The template owns its unique Tomb function, footprint, terrain, lighting, and sensory prose; these are not rolled from independent tables. Theme manifestations, occupants, challenges, opportunities, and Quest results are layered onto that coherent room.

## Constraints

- Runs locally.
- Lightweight to install and launch.
- Usable without a hosted service or account.
- Keeps the underlying game procedures visible and reproducible with physical dice.
- Does not become a prerequisite for playing the TTRPG.
