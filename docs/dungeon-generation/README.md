# Dungeon and Room Generation

## Accepted requirements

- Generate the dungeon during play, one room or area at a time.
- Entering and generating a new room consumes one exploration turn.
- A room may contain monsters, traps, treasure, puzzles, clues, environmental features, social situations, or meaningful emptiness.
- Free-form action resolves the generated situation; the procedure must not turn every room into a sealed combat encounter.
- Durably resolving the room's main challenge conquers it and gives every adventurer one Skill Token.
- The same procedure must support a GM-led group and a solo player using an oracle.
- The tabletop procedure must work with physical dice even when the local web app automates it.

## Accepted Light and known-room travel procedure

Each fresh torch begins with **12 Light tokens**. Light is an expedition currency rather than an automatic per-turn countdown. Unless the party's current room is permanently illuminated, spend 1 Light to enter a new room, move to one adjacent known room, rest and recover HP, search a conquered room, illuminate permanent fixtures, treat a Wound, or perform another activity that explicitly costs Light.

These actions spend no portable Light while the party is in a room with secured Fixture or Inherent lighting. Ordinary combat actions and checks do not spend Light unless a rule or consequence says otherwise. At 0 Light, ordinary checks in an unlit room have disadvantage, and actions that explicitly cost Light cannot begin there.

The app may route a click through several known rooms for convenience, but resolve it as one adjacent move and one possible Light cost per connection. A move beginning in a permanently illuminated room is free.

For each conquered room entered during this movement, roll a d6. On a 1, wandering enemies arrive and movement stops. Roll on the site's Wandering Enemy table and have the result enter through a plausible passage, shaft, hiding place, or supernatural route. The room remains conquered, and resolving the wanderers does not grant its conquest Skill Tokens again.

Do not make this danger roll for a room whose persistent fixtures are currently lit. Wandering enemies do not enter a lit room.

Movement also stops when the party reaches an unconquered room or a room that is already actively dangerous. Use the same procedure for deeper travel, backtracking, and extraction.

Living hostile creatures in the party's current room also block ordinary departure. The party must defeat or drive them off, or establish through the fiction how it sneaks, bargains, distracts, flees, or otherwise bypasses them. Make a room-target check when that bypass is uncertain; failure gives the dungeon its normal action. Bypassed creatures remain in their room unless their Instinct and the fiction cause them to pursue.

The Light spent entering and generating a new room includes the first necessary traversal of its persistent features. Do not charge an additional Light merely because the new room contains a pit, difficult climb, deep water, unstable rubble, narrow ledge, or comparable obstacle.

Conquest does not erase those features. On a later visit, crossing the room is part of its adjacent movement cost. Roll a traversal check only if the crossing remains uncertain and failure would have a meaningful consequence. A specific feature may state an additional Light cost for sustained work.

A durable improvement such as a secured rope, lowered bridge, drained channel, cleared route, or opened shortcut removes the fictional obstacle. The 1-in-6 danger chance remains accepted for initial playtesting.

### Wandering Enemy tables

Wandering Enemy tables contain a small subset of mobile creatures appropriate to the Domain, Theme, or specific site. Results are real occupants moving through the map rather than regenerated room challenges.

An ordinary wandering group has at least **1 total HP per active adventurer, minimum 2**, and uses its own Defense, HP, Instinct, and Wound. Specific entries such as an ogre or elite patrol may exceed that floor. Wanderers grant no conquest Skill Tokens.

Escaped wanderers remain in the dungeon. Record their location and let their Instinct determine whether they pursue, occupy a room, move elsewhere, or interact with other inhabitants.

### Template-authored lighting

Do not roll independently to determine whether a room is Lightable. Every room template specifies one of three Lighting states according to its architecture and terrain:

- **Fixtures:** persistent room-wide lights can be ignited by spending 1 Light;
- **Inherent:** furnaces, lava, or another built-in source illuminate the room unless its generated state suppresses them;
- **None:** only portable or newly introduced light is available.

Fixture and Inherent lighting create **secured light**. Secured light removes darkness disadvantage inside the room and prevents wandering enemies from entering or being generated there. Portable light does not suppress wandering enemies. Domain, Theme, and room state explain the fixtures and may explicitly damage, extinguish, or disable them without changing the template's normal state.

Room Supply and Loot results can provide portable torches. A found torch is fresh and receives 12 Light tokens when lit unless the card says it is partly burned, damaged, unusual, or bundled with additional torches.

### Rest and room search

Conquest does not restore HP. In a conquered room with no active threat, the party may rest: spend 1 Light and restore every living adventurer to full HP. Wounds and Scars remain. Rest costs no portable Light in a permanently illuminated room.

Every conquered room with no active threat can be searched once. Choose an adventurer and a narratively applicable attribute, spend 1 Light, and check against the room target. Success reveals one Loot card; failure reveals nothing. Mark the room searched either way. A permanently illuminated room waives the Light cost but not the check.

An ordinary Challenge's assigned card is separate from room search. Conquering the Challenge reveals its Quest or Loot card without a search, check, or Light cost. The room can still be searched once for an additional Loot card. A Heart instead completes its Quest objective and has no ordinary reward card.

## Accepted normal monster attack

When the dungeon controls the turn, a monster that is fictionally able to attack may choose a plausible target and deal 1 damage without an attack roll or defense check. Apply Guard, resistance, and other relevant protection, then return control to the adventurers.

If no monster can currently reach or attack an adventurer, the dungeon must use its action to close distance, overcome cover, block an exit, improve the monsters' position, or take another action supported by the fiction. A coordinated group or swarm damages only one adventurer with a normal attack.

Normal monster attacks cannot critically succeed or fail. Special attacks may override the defaults but should be clearly telegraphed. An adventurer reaction check called for by a special dungeon action resolves that action only and never grants the dungeon another action.

## Hostile opposition floor

For initial playtesting, a room whose main challenge is immediately hostile creatures contains at least **2 total monster HP per active adventurer**. Divide that total among Fragile 1 HP, Standard 2 HP, Tough 3 HP, or Boss-tier 5+ HP creatures according to the fiction.

A Fragile creature can appear alone in the fiction but cannot be the room's entire hostile opposition. Multiple enemies still take only one coordinated dungeon action, and a normal attack damages only one adventurer. The additional HP increases the number of successful actions needed without multiplying automatic monster attacks.

The floor does not automatically apply to uncertain creatures, social obstacles, hazards, or incidental inhabitants. Major threats may exceed it.

## Monster Instincts

Every authored or generated monster receives an **Instinct** stating its preferred target and commitment. Follow that Instinct whenever the monster can attack; use fictional judgment and randomize only genuine ties.

Useful patterns include Vengeful creatures that lock onto the first adventurer to harm them, Swarming creatures that pursue one isolated target, Bloodscent creatures that prioritize active Wounds, Skirmishers that maintain range, Guardians that attack trespassers, and Sweeping brutes that deal greater damage but must alternate targets.

An Instinct never overrides position. If the preferred target is unreachable, hidden, or protected, the monster must spend its dungeon action changing that situation or select another target when its Instinct permits. Clear Instincts let adventurers predict, manipulate, and defend against monster behavior.

## Accepted map model: literal floorplan

Generate exact room shapes, doors, corridors, and relative placement on a square grid. The procedure must handle collisions, loops, secret spaces, stairs, and other vertical connections both by hand and in the local web app.

Most room templates provide at least two onward exits in addition to the entry used to place them. All connectors become ordinary two-way passages after placement.

The working sequence is:

1. Choose an unexplored exit from the existing map.
2. Generate its connector: doorway, corridor, stair, shaft, or special transition.
3. Generate and orient the new room footprint on the grid.
4. Resolve overlap with existing geometry through a loop, shared wall, blocked passage, secret connection, or vertical shift.
5. Generate the room's visible and hidden exits.
6. Generate function, state, main challenge, and opportunity.
7. Resolve the room through free-form play and mark conquest if its main challenge is durably overcome.

Collision handling is not a random subsystem. The GM adjusts placement, orientation, connector length, shared walls, or the result to preserve a sensible map. In solo play, the player makes the least disruptive good-faith adjustment or rerolls. The web app should flag overlap and expose manual placement controls rather than silently deciding.

## Accepted site boundary: macro-grid sectors

Place the literal floorplan inside a larger bounded grid of **sectors**. Each sector can contain at most one generated room template.

- A room template retains its exact internal square-grid geometry.
- Each sector provides an 11×11 canvas; the current templates fit within a 9×9 internal footprint.
- The remaining one-square margin around that footprint supports connector routing.
- An unexplored exit points toward an orthogonally adjacent sector.
- Entering an empty adjacent sector generates and places a new room there.
- An exit pointing toward an occupied sector can create a loop, shared passage, or blocked connection according to GM judgment.
- An exit pointing beyond the site's boundary is blocked, becomes a site exit, or becomes a vertical connection according to the fiction.
- Separate dungeon levels use separate macro-grids connected by stairs, shafts, lifts, or other vertical routes.

The macro-grid limits the total number of rooms without requiring every sector to be occupied.

### Accepted site sizes

| Site size | Sector grid | Maximum rooms | Suggested Escalation |
| --- | ---: | ---: | ---: |
| Compact | 3×3 | 9 | E 3 |
| Standard | 4×4 | 16 | E 2 |
| Sprawling | 5×5 | 25 | E 1 |

This pairing keeps the highest likely template indices in a similar broad range despite different site lengths. The entrance begins in a boundary sector. Objectives, stairs, and exits do not require every intervening sector to be filled.

Example standard site after several rooms:

```text
+----+----+----+----+
|    | 07 | ?? |    |
+----+----+----+----+
| EN | 01 | 04 | ?? |
+----+----+----+----+
|    | 12 |    |    |
+----+----+----+----+
|    | ?? |    |    |
+----+----+----+----+
```

`EN` is the entrance sector, numbers are generated templates, `??` marks an unexplored sector reached by an exit, and blank sectors have not been connected.

### Benefits and costs

Benefits:

- finite site size despite frequent branching;
- automatic spatial relationship between rooms;
- loops emerge when branches meet;
- no room-overlap problem between sectors;
- straightforward representation in the local web app.

Costs:

- standardized sectors can make the overall dungeon feel regular;
- large halls spanning several sectors need an exception;
- exit directions must be assigned to sector edges after template rotation;
- boundary handling and objective placement still need rules.

## Proposed hybrid site objective

A worked [Haunted Tomb objective](examples/haunted-tomb/objective/README.md) demonstrates one possible ending structure:

- place a Heart on the far edge of the macro-grid;
- hide several Revelation markers in other sectors;
- integrate each Revelation into that sector's normal Opportunity;
- let Revelations remove specific layers of the Heart's final threat;
- permit an early direct confrontation rather than enforcing a hard lock;
- require physical extraction to the entrance after securing the Heart objective.

This model is illustrative rather than accepted. Other sites could substitute keys, machine parts, witnesses, faction support, ritual acts, or discovered weaknesses for Revelations.

## Accepted Quest structure

Each site selects or rolls a Quest, then makes a separate escalating Quest roll for every newly generated room. See the [Quest generation prototype](quests/README.md).

- Quest type defines the goal, the nature of quest elements, and what the Heart represents.
- `d20 + (E × rooms already generated)` determines whether the room adds an omen, trace, lead, quest element, setback, or Heart.
- Used numerical Quest results are crossed off and rerolled.
- Low results retire as the modifier rises, pushing the site toward concrete progress and its Heart.
- A Quest result creates a candidate Quest card. It is revealed only when the room's Challenge awards a Quest card.
- The Heart can be reached before the intended requirements are met, preserving free-form solutions at greater risk.
- Every selected Quest must state a concrete mission briefing: name the objective or subject, say what the party must do, and state what must be brought, protected, destroyed, proven, or changed.
- A hidden room exit is an internal secret passage unless its specific fiction explicitly identifies it as a site exit. It does not complete the expedition merely because the map marks it as hidden.
- After securing the Heart objective, the party must physically return to the original dungeon entrance under the normal known-room travel rules. The Heart Room may remain dangerous and unconquered if defenders survive. Escaping from the entrance completes the expedition.

The exact result bands are proposed for playtesting.

### Accepted footprint generation: template table

Room footprints come from authored templates rather than independently rolled width and length. Each template includes:

- an exact square-grid footprint;
- one or more legal entry anchors;
- visible and possibly hidden exit sockets;
- permitted rotations and, where appropriate, mirroring;
- walls, blocked cells, and traversable floor;
- authored internal terrain such as pillars, pits, balconies, galleries, ledges, bridges, pools, channels, stairs, rubble, statues, cages, machinery, or raised platforms;
- a danger rank or other escalation tag;
- optional tags used by challenge and opportunity tables.

Internal terrain belongs directly to the footprint rather than being only descriptive text. A balcony creates high ground, a pit constrains movement, and pillars provide cover and break sight lines.

### Danger Rank

Every template has a **Danger Rank** using the core target-number ladder:

| Danger Rank | Default target |
| --- | ---: |
| Easy | 9 |
| Standard | 12 |
| Hard | 15 |
| Extreme | 18 |

Danger Rank is the default Defense or target number for every enemy, trap, hazard, puzzle mechanism, and other opposed obstacle in that room. A specific entry can override it—for example, a slow armored brute may have lower Defense but additional HP, while an elusive creature may have higher Defense.

Danger Rank does not by itself determine room contents. Separate site-themed procedures still decide whether the room contains creatures, traps, puzzles, social obstacles, treasure, and other elements.

Templates prescribe geometry, internal terrain, tags, and Danger Rank only. They do not fix a challenge category or complete encounter.

## Superseded escalation model: active d20 roster

**Status:** Superseded by the sliding formula below.

Use a master sequence of unique room templates ordered from shallower or safer to deeper or more dangerous. Maintain exactly twenty active entries:

1. At the start of a site, assign master templates 1–20 to d20 faces 1–20.
2. Roll d20 when generating a new room and place the template currently assigned to that face.
3. Cross that template off; it cannot appear again in the current site.
4. Replace the selected face with the next locked master template: 21 after the first room, 22 after the second, and so on.
5. Roll the same d20 for every later room.

Example: face 7 initially holds template 7. If the first roll is 7, place template 7 and assign template 21 to face 7. If the next roll is also 7, place template 21 and replace it with template 22.

This is equivalent to choosing uniformly from the first twenty available unvisited templates while adding one new entry after every draw, but it requires no variable die size or repeated rerolls.

### Escalation behavior

- The active pool always contains twenty unique templates.
- Early rooms remain possible until drawn, so escalation is gradual rather than a hard floor transition.
- Newly unlocked templates can be drawn immediately, allowing occasional sudden descents into severe rooms.
- Later master entries should trend toward more dangerous terrain, stronger challenge ranks, fewer safe exits, and more consequential opportunities.
- A template's danger rank informs content generation; geometry alone should not require every late room to contain a monster.
- The web app can display the active roster and replacement history, while a paper roster tracks the current entry beside each d20 face.

### Master-list structure under consideration

A large catalog might use broad bands such as:

- 1–20: shallow rooms;
- 21–40: deep rooms;
- 41–60: perilous rooms;
- 61–80: heart-of-the-dungeon rooms.

The exact catalog size and danger curve remain open. Site size may end an expedition before every band is reached.

## Accepted escalation model: sliding d20

Generate the master-template index with:

`d20 + (E × N)`

Where:

- **N** is the number of rooms already generated in the current site;
- **E** is the site's Escalation value: 1, 2, or 3. It defaults to 2.

Procedure:

1. For the first room, N is 0, so every site begins with a plain d20 result from 1–20.
2. Add `E × N` to each later room roll.
3. If the resulting master template was already used in this site, reroll the d20 with the same modifier until an unused result appears.
4. Cross off the selected template after placing it.
5. Results below the formula's current minimum are retired even if never visited; they can no longer appear in that site.

This removes both the room that was actually visited and the lowest E room numbers from future range as exploration advances. Unlike the active-roster model, very easy templates cannot linger indefinitely.

### Escalation speeds

| Generated room | Rooms already generated N | E 1: Slow | E 2: Standard | E 3: Fast |
| ---: | ---: | --- | --- | --- |
| 1 | 0 | 1–20 | 1–20 | 1–20 |
| 5 | 4 | 5–24 | 9–28 | 13–32 |
| 10 | 9 | 10–29 | 19–38 | 28–47 |
| 15 | 14 | 15–34 | 29–48 | 43–62 |

- **E 1** suits long sites and gradual escalation.
- **E 2** is the default for an expedition of roughly eight to twelve generated rooms.
- **E 3** suits short, brutal sites or an intentionally accelerating descent.

Escalation is a site property rather than a universal difficulty switch. A sprawling ruin might override the default with E 1, while a collapsing or deeply hostile site might use E 3.

### Practical considerations

- The master list must extend at least to `20 + (E × expected rooms)`.
- Crossed-off results within the current twenty-number window create rerolls. This is manageable in short sites and trivial in the web app, but must be tested at the physical table.
- Faster escalation retires old used results sooner and should produce fewer rerolls.
- Danger Rank should trend upward with master-list index, but later entries can still vary so escalation does not become perfectly predictable.

## Alternatives considered

### Literal floorplan — accepted

Generate room shape, dimensions, doors, corridors, and relative placement on a grid or sketch map.

**Strengths:** spatial tactics, satisfying cartography, secret rooms, loops, and strong *Four Against Darkness* / *2D6 Dungeon* influence.

**Costs:** collision rules, more generation steps, awkward vertical spaces, and greater app complexity.

### Abstract node map — not selected

Each room is a node connected by paths; exact dimensions and placement stay fictional.

**Strengths:** fast, handles unusual spaces, emphasizes decisions, and aligns with *Ironsworn: Delve*.

**Costs:** less tactile cartography and fewer geometry-based tactics or discoveries.

### Hybrid sketch map — not selected

Record rooms as rough shapes or cards with exits and relative connections, but do not enforce exact dimensions or grid collision.

**Strengths:** preserves doors, branches, loops, and a visible delve while remaining quick and tolerant of strange spaces.

**Costs:** requires judgment when exact distance matters and satisfies neither strict mapping nor complete abstraction.

## Proposed room-generation stack

Once the map model is chosen, each new room can be generated in layers:

1. **Connection:** how the party enters and what exits are visible.
2. **Form:** size, shape, elevation, and dominant physical feature.
3. **Function:** what the room was built or used for, informed by the site's theme and domain.
4. **State:** ruined, occupied, flooded, desecrated, unstable, repurposed, and so on.
5. **Main challenge:** creature, trap, hazard, puzzle, social obstacle, or another actionable problem.
6. **Opportunity:** treasure, clue, resource, shortcut, faction leverage, or useful terrain.
7. **Escalation:** how light, alert, depth, or a triggered dungeon event changes.

These layers should be combined into as few physical rolls as practical. A future prototype may use several differently colored d6s rolled together, with one die assigned to topology, one to challenge, and one to opportunity or complication.

## Accepted content structure: Room + Challenge + one reward

Room contents use a Challenge roll and one hidden reward result:

- **d12 Challenge:** establishes the primary problem and potential conquest condition.
- **d8 Loot:** selects Supply on 1–4 or Treasure on 5–8 when the Challenge awards Loot.

Each ordinary Challenge is explicitly assigned exactly one **Quest card** or one **Loot card**. It never awards both and never has an empty reward. Investigative, puzzle, social, and supernatural mystery Challenges generally award Quest cards; physical hazards, traps, ambushes, and major creature threats generally award Loot. A Quest Heart is the final objective rather than an ordinary reward-bearing Challenge: it names the action that completes the Quest and awards no Quest or Loot card. Loot is always either Supply or Treasure. See the [room-content prototype](room-content/README.md) for the initial tables and synthesis procedure.

The current d12 assignments are fixed:

- **Quest:** 1 Quiet Scene, 5 Puzzle, 6 Social Obstacle, 7 Uncertain Creature, 10 Creature + Theme.
- **Loot:** 2 Domain Obstacle, 3 Theme Hazard, 4 Trap, 8 Hostile Creature, 9 Creature + Domain, 11 Compound Challenge, and 12 Major Threat.
- **Objective:** every Quest Heart. A Heart reveals multiple Quest-appropriate defenders. Completing its named objective does not remove those Monster cards or conquer the Room.

### Accepted card reveal sequence

Treat each generated room as a staged group of cards rather than exposing every result at once:

1. Reveal the **Room card** and the player-facing front of its **Challenge card**. Put every immediately perceptible fact on that front.
2. Follow the Challenge's Immediate instruction. A creature Challenge may reveal one or more **Monster cards** now; Quest and Loot cards remain facedown.
3. The players commit to an approach that could make the Challenge stop applying. Ask ordinary clarifying questions freely; make a check only when outcome is uncertain and failure matters.
4. Reveal the hidden **Response side** before resolving that uncertain check. It contains only Revelation, Failure, While Active, and—when genuinely unclear—Ends When rules. Do not print solution lists.
5. When the Challenge durably stops applying to the party's use of the Room, conquer it. A temporary bypass does not qualify if the card will apply again on return.
6. Every active adventurer gains one Skill Token. Turn over the Challenge's assigned **Quest card** or **Loot card**. This costs no Light and does not count as searching.
7. The conquered Room can now be searched once. Spend 1 Light unless it is permanently illuminated, choose a narratively applicable attribute, and check against the Room target. Success reveals one additional Loot card; failure exhausts the search with no card.

A quiet result is a **Scene**, not a Challenge. Its Room begins conquered, it has no Response side, and it grants no Skill Token. Follow its immediate reveal, if any, and allow the normal optional search.

The complete schemas, vocabulary, and writing rules are in the [card-language standard](../card-language/README.md).

The Room card's read-aloud text contains only the room itself: its architecture, layout, lighting, and immediately visible physical details. Do not append an independent atmosphere or haunting roll, Quest content, Challenge presence, or Monster introduction. Those ideas belong on their respective Challenge, Quest, and Monster cards. Particularly strong haunting concepts should be authored as Challenges instead of being applied as a disconnected prose layer.

Challenge is a broad card type covering ambushes, creatures, obstacles, hazards, traps, puzzles, social confrontations, guardians, setbacks, and Quest Hearts. A Heart is the selected Quest pack's final Challenge card. Conquering it begins extraction rather than revealing a separate Heart card.

Cards identify both their type and source set. The Core set supplies reusable Challenges and ordinary Loot; a Location pack supplies its Rooms, most Monsters, themed Challenges, and discoveries; the selected Quest pack supplies its mission, Quest cards, setbacks, and Heart Challenge. A hidden passage is a room-state change or reward instruction, not a separate card type.

## Accepted site identity: Domain + Theme

Every site has one **Domain** and one **Theme**.

- **Domain** describes what the place is or was built to do. It supplies room functions, structural motifs, original inhabitants, mundane hazards, and likely valuables.
- **Theme** describes what has happened to the place. It supplies current conditions, sensory motifs, altered inhabitants, supernatural or environmental hazards, and escalating manifestations.

The two results combine throughout generation. A Mine may produce galleries, lifts, ore stores, and blasting chambers; Haunted turns those results toward spectral laborers, phantom collapses, cold lanterns, and ore that remembers the dead. Haunted should behave differently in a Temple because the Domain contributes sanctuaries, reliquaries, confessionals, and ritual spaces.

Domain and Theme may be rolled for an unknown site or selected when the fiction already establishes its identity.

Domain and Theme use reusable compact [module cards](modules/README.md), not bespoke tables for every possible pairing. The first modules are [Tomb](domains/tomb/README.md) and [Haunted](themes/haunted/README.md), demonstrated in a [Haunted Tomb vertical slice](examples/haunted-tomb/README.md).

The literal-map master catalog now includes the [01–20 shallow pool](templates/01-20/README.md) and [21–50 deep and extreme pools](templates/21-50/README.md), with exact ASCII grids, terrain tags, exits, and Danger Ranks.

### Draft Domain table (d20)

| d20 | Domain | Likely room functions and structures |
| ---: | --- | --- |
| 1 | Tomb | burial chambers, offering halls, false crypts, memorial galleries |
| 2 | Mine | galleries, lifts, ore stores, shafts, blasting chambers |
| 3 | Temple | sanctuaries, reliquaries, confessionals, ritual courts |
| 4 | Prison | cells, guardrooms, interrogation rooms, exercise yards |
| 5 | Fortress | barracks, armories, gates, command rooms, murder passages |
| 6 | Natural caverns | squeezes, grottos, sinkholes, underground rivers |
| 7 | Sewer | channels, sluices, cisterns, maintenance walks, refuse pits |
| 8 | Archive | stacks, reading rooms, sealed records, scriptoriums |
| 9 | Laboratory | preparation rooms, specimen vaults, testing chambers, disposal pits |
| 10 | Palace | audience halls, private suites, kitchens, galleries, servant ways |
| 11 | Monastery | cells, cloisters, refectories, meditation rooms, gardens |
| 12 | Foundry | furnaces, casting floors, fuel stores, cooling channels |
| 13 | Cistern | reservoirs, pump rooms, aqueducts, filtration chambers |
| 14 | Treasury | counting rooms, vaults, decoy stores, appraisal chambers |
| 15 | Arena | fighting pits, beast pens, galleries, training rooms |
| 16 | Undercity | homes, markets, shrines, workshops, alleys beneath streets |
| 17 | Smuggler warren | caches, hidden docks, false walls, escape tunnels |
| 18 | Giant works | immense halls, oversized machinery, servant ducts, monumental stairs |
| 19 | Buried vessel | holds, cabins, engine or oar spaces, navigation chambers |
| 20 | Impossible complex | folded corridors, repeated rooms, inverted halls, contradictory stairs |

### Draft Theme table (d20)

| d20 | Theme | Likely manifestations |
| ---: | --- | --- |
| 1 | Haunted | echoes, apparitions, unfinished duties, cold spots, possession |
| 2 | Flooded | rising water, currents, drowned passages, aquatic intruders |
| 3 | Infested | nests, eggs, burrows, consumed stores, territorial swarms |
| 4 | Corrupted | mutation, blight, warped purpose, contagious influence |
| 5 | Collapsing | unstable ceilings, shifting routes, dust, blocked exits |
| 6 | Frozen | brittle surfaces, numbness, ice bridges, preserved horrors |
| 7 | Smoldering | smoke, embers, heat, spreading fire, failing supports |
| 8 | Overgrown | roots, spores, predatory plants, broken masonry reclaimed by life |
| 9 | Plague-ridden | quarantine marks, contaminated supplies, fever, desperate survivors |
| 10 | War-torn | barricades, unexploded weapons, patrols, divided territory |
| 11 | Time-lost | temporal echoes, uneven decay, repeated moments, displaced occupants |
| 12 | Dreaming | symbolic spaces, mutable distances, sleeping minds, emotional hazards |
| 13 | Living | breathing walls, digestive passages, immune responses, hunger |
| 14 | Clockwork | moving rooms, timed mechanisms, maintenance constructs, power loss |
| 15 | Contested | rival factions, shifting borders, negotiations, sabotage |
| 16 | Sealed | stale air, untouched rooms, pressure, things trapped too long |
| 17 | Mirrored | reflections, doubles, false depth, redirected light and magic |
| 18 | Blood-soaked | sacrifice, predatory hunger, stains that move, violent memory |
| 19 | Lightless | devouring darkness, failed lamps, blind inhabitants, stolen shadows |
| 20 | Awakening | dormant systems activating, sealed powers stirring, escalating omens |

### Combination principle

Do not generate one Domain result and one Theme result as disconnected decorations. Use one to transform the other:

- **Flooded Prison:** submerged cell blocks, floating keys, air pockets occupied by desperate survivors.
- **Clockwork Temple:** timed liturgies, mechanical saints, altars that rotate with the dungeon clock.
- **Infested Archive:** books pulped into nests, larvae that mimic writing, catalog passages used as burrows.
- **Collapsing Giant Works:** falling monumental tools, cracked load-bearing statues, tiny safe routes through immense machinery.

The content procedure still needs tables that make this combination fast during play rather than demanding invention from scratch every room.

## Design guardrails

- Generate an actionable situation, not disconnected nouns.
- Empty rooms still need information, atmosphere, navigation value, or a pressure change; they do not automatically award conquest tokens.
- The main challenge must be identifiable enough to know when the room is conquered.
- Results should reference the site's theme so rooms feel related rather than uniformly random.
- A solo result must provide enough context to interpret without dictating a single solution.
- Branching needs a finite-site or progress procedure so the map does not grow forever.

## Open questions

- Template footprints or rolled dimensions?
- What grid scale should a square represent?
- Does the site have a room budget, a progress track, or both?
- How are loops, backtracking, secret passages, and vertical connections generated?
- How often should rooms contain an immediate hostile creature?
- **Deferred:** whether a future Dungeon Alert system modifies content rolls, adds encounters, or changes existing rooms.
- How are theme and domain selected and combined?

## Current build order

1. **Define concise terrain effects.** Establish defaults for pits, water, balconies, rubble, bridges, and forced movement.
2. **Run short combat seeds.** Measure average bonuses, multi-target abilities, high-damage alternating-target Instincts, and one-torch expeditions.
3. **Reduce candidate tables.** Cut weapons, armor, Knacks, Domains, Themes, and room footprints based on actual use.
4. **Build the first local generator.** Automate only procedures that survived tabletop testing.

The first complete generation test is recorded in [Dry Run 001: The King Who Was Buried Twice](../playtests/001-haunted-tomb/README.md).

The first lone-adventurer rules test is recorded in [Playtest 002: The Reliquary Thief](../playtests/002-lone-adventurer/README.md).

The first party-size opposition test is recorded in [Playtest 003: Scuttlers in Numbers](../playtests/003-scaled-opposition/README.md).

The first extended party expedition is recorded in [Playtest 004: The Choir Chose Its Mourner](../playtests/004-five-room-party/README.md).

Its corrected replay under the current crossbow and light rules is [Playtest 005: The Light Failed at the Memorial](../playtests/005-corrected-five-room-party/README.md).

The first current-rules two-adventurer expedition is [Playtest 006: Two Lights Before Darkness](../playtests/006-two-adventurers/README.md).

### Why the master list needs fifty templates

The highest possible index on the final available sector is:

| Site | Maximum generated rooms | E | Maximum index |
| --- | ---: | ---: | ---: |
| Compact 3×3 | 9 | 3 | `20 + (3 × 8) = 44` |
| Standard 4×4 | 16 | 2 | `20 + (2 × 15) = 50` |
| Sprawling 5×5 | 25 | 1 | `20 + (1 × 24) = 44` |

Therefore templates 1–50 cover every default size and escalation pairing without wrapping, clamping, or placeholder results.
- How are Domain and Theme selected and combined into content?
