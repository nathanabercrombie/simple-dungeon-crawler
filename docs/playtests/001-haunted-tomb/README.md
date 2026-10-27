# Dry Run 001: The King Who Was Buried Twice

## Purpose

Test whether the current procedures can generate a complete compact site without choosing favorable results.

This is a generation dry run, not a full combat playtest.

## Setup

- **Seed:** 20260331
- **Site size:** Compact 3×3
- **Escalation:** E 3
- **Domain:** Tomb
- **Theme:** Haunted
- **Quest:** Break the Curse
- **Entrance:** sector B3
- **Generation limit:** all nine sectors

The random script used a fixed seed and rerolled exact room or Quest indices already used in the site.

## Raw rolls

`N` is the number of rooms already generated. Template and Quest indices already include `3 × N`.

| Room | Sector | Template | Challenge d12 | Opportunity d8 | Quest index | Quest result | Tomb Function d6 | Detail d6 | Haunted Manifestation d6 | Drive d6 |
| ---: | --- | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: |
| 1 | B3 | 11 | 10 | 8 | 3 | Omen | 5 | 3 | 6 | 4 |
| 2 | B2 | 9 | 8 | 5 | 15 | Lead | 4 | 3 | 5 | 1 |
| 3 | A3 | 22 | 8 | 4 | 18 | Lead | 6 | 4 | 3 | 2 |
| 4 | C2 | 27 | 9 | 1 | 14 | Trace | 2 | 6 | 3 | 6 |
| 5 | A2 | 32 | 2 | 1 | 19 | Lead | 5 | 2 | 3 | 4 |
| 6 | C3 | 28 | 4 | 4 | 23 | Quest element | 2 | 5 | 1 | 3 |
| 7 | A1 | 35 | 9 | 2 | 21 | Quest element | 3 | 6 | 5 | 4 |
| 8 | B1 | 23 | 9 | 7 | 32 | Heart | 2 | 2 | 1 | 5 |
| 9 | C1 | 36 | 4 | 3 | 35 | Major Heart advantage | 6 | 5 | 6 | 3 |

There were no duplicate room indices. Room 5's Quest roll encountered two previously used exact totals before producing 19; no other Quest roll rerolled.

## Macro-map

```text
       A           B           C
   +-----------+-----------+-----------+
1  | R7 / T35  | R8 / T23  | R9 / T36  |
   | Element   | HEART     | Advantage |
   +-----------+-----------+-----------+
2  | R5 / T32  | R2 / T09  | R4 / T27  |
   | Lead      | Lead      | Trace     |
   +-----------+-----------+-----------+
3  | R3 / T22  | R1 / T11  | R6 / T28  |
   | Lead      | EN / Omen | Element   |
   +-----------+-----------+-----------+
```

The GM-facing placement used these principal connections:

- B3–B2 and B3–A3;
- B2–A2 and B2–C2;
- A3–A2, forming a loop;
- C2–C3 and C2–C1;
- A2–A1;
- A1–B1;
- B1–C1 and B1–B2, forming another loop;
- C3–B3 and C1–C2, closing two additional routes.

Boundary-pointing exits were blocked, collapsed, or treated as exterior-facing architecture by GM judgment.

## Generated rooms

### Room 1 — Drowned Vigil

- **Sector/template:** B3 / Flooded Channel 11
- **Danger:** Standard 12
- **Challenge:** Creature plus Theme manifestation
- **Opportunity:** Major discovery
- **Quest:** Omen

A collective choir of drowned mourners repeats a vigil through the flooded channel, trying to prevent an ancient betrayal. Every memorial face has been deliberately erased. A submerged offering basin contains the **Book of Last Rites**, a spellbook and early major discovery.

Durable solutions include restoring part of the vigil, learning why the faces were erased, laying the choir to rest, or defeating it.

### Room 2 — Bridge of Borrowed Faces

- **Sector/template:** B2 / Pit Bridge 9
- **Danger:** Standard 12
- **Challenge:** Hostile creature
- **Opportunity:** Treasure
- **Quest:** Lead

Bone scuttlers carry grave goods across the narrow bridge while spectral doubles imitate anyone who steps onto it. Saint-bone charms lie in a niche beyond the crossing. A repeated image shows a ceremonial knife being taken toward a preparation chamber.

### Room 3 — The Accusing Ring

- **Sector/template:** A3 / Ring of Absence 22
- **Danger:** Hard 15
- **Challenge:** Hostile creature
- **Opportunity:** Usable feature
- **Quest:** Lead

A poltergeist hurls royal grave goods around the isolated center and forces intruders to confess. A counterweighted bier can bridge part of the ring pit or pin the haunting's anchor. The sarcophagus dimensions prove the royal corpse was substituted.

### Room 4 — Furnace of Unnamed Hands

- **Sector/template:** C2 / Furnace Lanes 27
- **Danger:** Hard 15
- **Challenge:** Creature plus Domain complication
- **Opportunity:** None
- **Quest:** Trace

Risen embalmers operate furnaces and valves according to a sealed preparation protocol. Loose tools move by themselves whenever a worker's proper name is omitted. Burned royal linens show that someone destroyed evidence here, but provide no complete answer.

### Room 5 — Shattered Memorial Maze

- **Sector/template:** A2 / Rubble Labyrinth 32
- **Danger:** Hard 15
- **Challenge:** Domain obstacle
- **Opportunity:** None
- **Quest:** Lead

Memorial walls continuously return displaced fragments to their old positions, closing routes through the rubble. Aligning the correct epitaph fragments reveals that the murder weapon was hidden in a southern preparation chamber.

### Room 6 — Stairs of the Last Task

- **Sector/template:** C3 / Split Stair Hall 28
- **Danger:** Hard 15
- **Challenge:** Trap
- **Opportunity:** Usable feature
- **Quest:** Element — the Murder Weapon

Crossing the wrong stair restarts an embalmer ghost's final task and releases sealing blades from the risers. The stair counterweight can lock one side safely. The hidden ceremonial knife is the physical anchor of the murder reenactment.

Recovering or destroying it removes that layer from the Heart.

### Room 7 — Amphitheater of the Broken Oath

- **Sector/template:** A1 / Flooded Amphitheater 35
- **Danger:** Extreme 18
- **Challenge:** Creature plus Domain complication
- **Opportunity:** Clue
- **Quest:** Element — the Broken Oath

A risen royal guard and its spectral doubles defend common crypts arranged as an amphitheater. Inscribed below the waterline is the exact oath it obeys, including a release clause intended for a rightful heir.

Learning and invoking that clause neutralizes the guards defending the Heart.

### Room 8 — The Substitution Chamber

- **Sector/template:** B1 / Double Bridge Hall 23
- **Danger:** Hard 15
- **Challenge:** Creature plus Domain complication
- **Opportunity:** Shortcut
- **Quest:** Heart

Two bridges cross preservative pits around the embalming slab where the king's corpse was replaced. The royal revenant repeats the substitution and accuses each living intruder of being the impostor.

Because the party can arrive with the Murder Weapon and Broken Oath, the reenactment and royal guards can be removed from the compound threat. The remaining Heart is a focused Hard 15 negotiation, rite, or fight. A funeral lift creates a shortcut back to B2.

### Room 9 — Sepulcher of the Stolen Name

- **Sector/template:** C1 / Pillar Maze 36
- **Danger:** Extreme 18
- **Challenge:** Trap
- **Opportunity:** Supply
- **Quest:** Major Heart advantage — the Stolen Name

Pillars rotate when false royal names are spoken, sealing intruders inside the maze while a collective haunting attempts to expel them. Sacred oil and funerary incense remain in a protected cabinet. The true king's remains and name are hidden beneath the central pillar.

Returning the true name to the Heart reduces its intended resolution from Hard 15 to Standard 12 and allows its relic to be claimed without a curse.

## What worked

### Escalation produced a readable arc

Danger progressed from two Standard rooms through five Hard rooms and two Extreme rooms. It was not perfectly monotonic: room 8 returned to Hard after an Extreme room, which made escalation feel variable rather than mechanical.

### Quest attrition produced excellent pacing in this seed

- Early rooms supplied an omen and several leads.
- Rooms 6 and 7 supplied two concrete quest elements.
- Room 8 placed the Heart with the intended solution available.
- Optional room 9 supplied a superior resolution and reward.

The result closely matched the design goal without pre-placing markers.

### Modular prompts cohered

Tomb Function, Haunted Manifestation, and Haunted Drive produced related rooms without requiring a bespoke Haunted Tomb result table.

### The macro-grid contained branching

Multiple exits created route choice and four loops, but the 3×3 boundary prevented infinite growth.

## What strained

### Creature frequency was high

Six of nine Challenge results involved creatures. The table's creature-facing results occupy four of twelve faces, so this was an unusually combat-heavy sample rather than the expected average. More runs are needed before changing the distribution.

### Several rooms became prompt-dense

Challenge, Opportunity, Quest, Function, detail, Manifestation, and Drive can produce too many ideas at once. The most successful rooms used only the two or three details needed to make one coherent situation. The procedure should explicitly permit ignoring unused module rolls.

### Boundary exits required frequent judgment

Many exits pointed beyond the compact grid. GM adjudication handled them, but a compact site may benefit from orienting exits toward valid sectors before treating the remainder as blocked.

### Quest rerolls occurred early

One Quest generation required two rerolls by room 5. This was manageable, but more simulations are needed to measure whether exact-result attrition becomes annoying.

## Rules that blocked a full playtest

### Known-room travel and extraction time

The party entered nine rooms, costing at least nine exploration turns. The rules do not yet say how many turns it costs to traverse conquered rooms when returning to the entrance, so torch pressure during extraction cannot be tested.

### Monster dungeon actions

The system defines when the dungeon receives one action, but not whether an enemy attack automatically deals 1 damage, rolls against a defense, or gives the adventurer a defense check. Combat lethality cannot be measured yet.

### Treatment and inventory

Wounds, Scars, and Cure Wounds exist, but bandages, treatment timing, inventory capacity, and starting supplies are undefined.

### Exact terrain effects

Pits, water, balconies, rubble, bridges, and mechanisms are fictionally useful but lack concise default effects. Their interaction with movement, range, falling, and forced movement needs a light framework.

## Recommended next decisions

1. Define travel time through known and conquered rooms.
2. Define the normal monster attack made during a dungeon action.
3. Define treatment supplies and timing.
4. Run the same seed as a lone-adventurer combat playtest through the first three rooms.
