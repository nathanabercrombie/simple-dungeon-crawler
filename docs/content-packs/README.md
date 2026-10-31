# Content packs and compatibility contract

The expedition rules are stable enough to separate the game engine from its authored content. The active application now combines the **Core Set** with one selected **Adventure Set**. The first active Adventure Set is **Classics**. The former Haunted Tomb vertical slice is archived and intentionally not selectable while its cards are rewritten to this contract.

## Audit of the Haunted Tomb slice

| Category | Core | Haunted Tomb-specific | Reusable after rewriting |
| --- | --- | --- | --- |
| Procedures | Checks, Light, search, combat, conquest, objective completion, card lifecycle | None | None |
| Rooms | Geometry schema and terrain vocabulary | All 50 complete Room cards and burial functions | Most floorplans and sight lines |
| Challenges | Scene/Challenge lifecycle and reward rules | Nearly every named obstacle, puzzle, ghost, and funeral mechanism | Ambush and wary-occupant patterns |
| Quests | Progress bands and extraction procedure | All twelve concrete stories, Findings, Hearts, and defenders | Quest archetypes such as rescue, hunt, steal, and sabotage |
| Monsters | Monster schema, dungeon actions, Instinct, and Wounds | The complete bestiary; Crown defenders are Quest-specific | Rats and ogre statistics after reframing |
| Loot | Supply/Treasure schema and ordinary item effects | Funeral presentation and most valuables | Medkit, bandages, tools, torches, attribute items |
| Characters | Gear, most armor, items, Knacks, Pasts, and names | Several funerary armor presentations | Their mechanics after neutral rewriting |

The central defect was not merely tone. Room, Challenge, Monster, and Quest results were selected independently while their prose silently invented shared facts. A Challenge could require funeral machinery in a Room without a mechanism; a Quest antagonist could be represented by an unrelated random Monster.

## Card ownership

### Room

Owns geometry, exits, lighting, fixed terrain, original function, immediately visible architecture, and persistent **Room features**. It publishes tags describing actual physical capabilities such as `water`, `gate`, `bridge`, `cells`, `cover`, or `large`.

A Room does not introduce current occupants, Quest facts, treasure contents, or a primary active problem. If its layout creates recurring danger, the Room feature states the exact rule on the card.

### Challenge

Owns the immediate actionable situation, pressure, Response, failure, active Monsters, and exactly one Quest or Loot reward. It may add portable or temporary props such as a tripwire, camp, chest, or barricade.

A Challenge may reference fixed architecture only through declared requirements. `The Flooded Lock` requires a Room with `water`; `Goblin Crossfire` requires cover, elevation, pillars, a maze, balcony, or clutter. If no compatible Challenge exists, generation fails validation rather than inventing missing architecture.

### Monster

Owns identity, Signs, HP, Defense, Instinct, Wound, capabilities, and movement restrictions. Challenges either name exact Monster IDs or request capability tags such as `intelligent`, `beast`, or `vermin`. Named Quest antagonists always have named Monster cards.

### Quest

Owns the mission, cast, objective, Omens, Traces, Leads, concrete Quest elements, setbacks, Heart action, Heart defenders, and compatible Heart Rooms. Quest cards do not rewrite Room architecture or masquerade as ordinary Challenge text.

The first Heart selects a Room matching the Quest's declared tags. Completing the objective and conquering that Room remain separate events.

### Loot

Owns one portable Supply or Treasure and an exact Take effect. The card carries its source pack explicitly. Rendering never infers ownership from an item name.

## Compatibility metadata

- `id`: stable, namespaced identity saved by the app.
- `pack`: explicit source label shown on the card.
- `tags`: capabilities actually supplied by a Room or Monster.
- `requiresAny`: at least one listed Room capability must exist.
- `forbidsAny`: listed Room capabilities make the card invalid.
- `monsterIds`: exact occupants introduced by a Challenge or Heart.
- `monsterTagsAny`: capabilities accepted by a generic encounter role.
- `heartRoomTagsAny`: Room capabilities that can physically host a Quest finale.

Tags are contracts, not mood words. `military` does not imply a gate, and `undead` does not imply a coffin.

## Generation order

1. Select the expedition's Adventure Set and Quest.
2. Roll Quest progress for the new Room.
3. Select an unused Room within the depth roster. A first Heart instead selects from its compatible Heart Rooms.
4. Filter Challenges against the Room contract and draw from the satisfiable cards.
5. Bind exact or capability-compatible Monsters.
6. Bind one hidden Quest or Loot result.
7. Validate references and reveal timing before presenting the bundle.

This avoids reviewing every Cartesian combination. The validator proves that every card has at least one legal placement, every generic Monster role has a candidate in every advertised Room, and every Quest has valid defenders and Heart Rooms. Editorial review is still required for prose quality, but impossible structural combinations are removed before play.

Run the validator with:

```console
node scripts/validate-content.js
```

## Active Classics inventory

- 30 Room cards, including guardrooms, stores, prison blocks, bridges, barracks, beast pens, an ogre kitchen, crypts, laboratories, foundries, and deep gates.
- 23 Challenge or Scene cards split between Core and Classics.
- 19 Monster cards including goblins, kobolds, orcs, ogres, beasts, rival delvers, skeletons, zombies, a mimic, a slime, constructs, cultists, and named Quest antagonists.
- 8 complete Quest packs: kill, rescue, recover, break a warband, seal, steal, destroy, and find.
- 20 Loot cards split evenly between Supply and Treasure.

The Classics set intentionally favors recognizable dungeon facts over an overlay Theme. Undead are ordinary members of the bestiary rather than evidence that the whole site is haunted.