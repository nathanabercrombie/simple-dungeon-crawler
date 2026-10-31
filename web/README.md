# Delvekeeper Local Web App

## Purpose

Delvekeeper is a dependency-free single-page guided tabletop for modular dungeon card sets. It currently combines the Core Set with the Classics Adventure Set while leaving narrative intent and unusual rulings with the players.

## Run it

Open `index.html` directly in a modern browser. No installation or account is required.

For a stable local URL instead of a `file:` URL, run this command from the repository root and visit `http://localhost:8000`:

```console
python -m http.server 8000 --directory web
```

Pushes to `main` deploy the same `web/` directory to GitHub Pages through [the Pages workflow](../.github/workflows/pages.yml).

## Current capabilities

- selectable, seeded Adventure Sets, beginning with Classics;
- one shuffled thirty-card Classics Scene deck plus eight Quest finale Scenes;
- complete Scene cards combining irregular floorplans, terrain, lighting, prose, situations, Responses, and rewards;
- ordinary monsters printed directly on Scenes when their identity matters;
- random Monster draws for monster-agnostic premises such as sleeping, trapped, hidden, or guarding creatures;
- Quest setup that adds thematic random Monsters and set-aside Bosses;
- creature trackers with Instincts and Wounds;
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
- `data.js` contains active Core and Classics module data; `haunted-tomb-data.js` preserves the inactive legacy slice.
- `app.js` contains seeded generation, expedition state, persistence, and interaction logic.

There is no build step and no third-party runtime dependency.

The deployed app displays a manually advanced build number. A network-only service worker and build-versioned asset URLs prevent stale GitHub Pages assets from masking a deployment; expedition state remains stored separately in `localStorage`.

Saved Scenes contain canonical IDs rather than copied prose or rules. Rendering resolves those references against current content, so wording corrections apply to an expedition created by the same save version.

Each draw is one complete physical Scene card. No Room/Challenge compatibility engine exists. A Scene either prints its ordinary monsters, draws from the random Monster deck, places set-aside Bosses, or begins without a monster. See [physical card sets](../docs/content-packs/README.md).

## Constraints

- Runs locally.
- Lightweight to install and launch.
- Usable without a hosted service or account.
- Keeps the underlying game procedures visible and reproducible with physical dice.
- Does not become a prerequisite for playing the TTRPG.
