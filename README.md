# Simple Dungeon Crawler

An original, lethal tabletop role-playing game designed for group or solo play, supported by a lightweight local web app for procedural generation and other play aids.

The project will be scoped one piece at a time. Rules text, procedures, and tables should be original even when a mechanic is inspired by another game.

## Design pillars

- **Lethal:** danger should be credible, choices should matter, and survival should not be assumed.
- **Solo-capable:** the core procedures must work without a GM, not merely add a solo mode afterward.
- **Flexible character scale:** one adventurer and a player-controlled party must be equally supported.
- **Procedure-rich:** tables and generators should create actionable situations, surprises, and consequences.
- **Table-ready:** rules should be quick to consult and practical to run with physical dice.
- **Locally supported:** a lightweight web app should automate optional generation without becoming necessary to play.

## Project documentation

- [Design notes](docs/design/README.md)
- [Procedural character creation](docs/character-creation/README.md)
- [Dungeon and room generation](docs/dungeon-generation/README.md)
- [Playtests and dry runs](docs/playtests/README.md)
- [Inspirations](docs/inspirations/README.md)
- [Decision log](docs/decisions/README.md)
- [Web app](web/README.md)

## Current status

The project is in discovery. The room-by-room expedition loop, flexible character scale, and success/failure turn-handoff rule have been accepted. Adventurers share a fluid turn; failure grants the dungeon one meaningful action. Core checks use roll-high d20 resolution, target numbers 9/12/15/18, natural-face criticals, a +3/+0/−2 starting attribute array, one free-form Past, one defined Knack, and 2d20 advantage/disadvantage. Adventurers earn personal Skill Tokens and spend them on Past expertise, Knacks, gear techniques, and other special abilities. Adventurers have 2 renewable HP; monsters have low HP, successful adventurer attacks deal 1 fixed damage, and weapon identity comes from distinctive benefits. The current design focus is linked-table procedural character creation. Advancement, setting, and technology stack remain open.
