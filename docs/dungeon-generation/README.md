# Dungeon and Scene generation

## Physical procedure

The dungeon grows one shuffled Scene card at a time. A Scene owns its floorplan, terrain, lighting, present situation, ordinary occupants, Response, and possible reward. There is no separate Room draw, Challenge draw, or compatibility filter.

When exploring:

1. Choose an unexplored exit from the current Scene.
2. Spend 1 Light unless the current Scene is permanently illuminated.
3. Draw the top Scene card.
4. Rotate it so its entrance faces the connecting passage.
5. Copy or place its floorplan at the same square scale.
6. Add a short corridor if needed to avoid overlap.
7. Read the prose and follow its Printed, Random, Boss, or None Monster instruction.
8. Resolve and conquer the Scene before ordinary exploration continues.

Scene shapes can be narrow, broad, irregular, circular, split-level, or built around pits, water, bridges, balconies, gates, rubble, and platforms. They are not cells in a uniform room grid.

## Quest setup

Set the Entrance Scene on top, then select one Quest before shuffling the remaining cards:

- shuffle its listed additions into the random Monster deck;
- set aside its named Boss cards;
- insert its authored finale Scene into the expedition’s later Scene draws;
- keep its Quest cards in their own small pack.

The web app currently inserts the finale after six or more ordinary Scene draws. This produces a practical eight-to-twelve-Scene expedition while preserving a reproducible seeded order.

## Scene resolution

Players may freely ask what is immediately perceptible. A player commits to an approach; reveal the Response before an uncertain check. Failure gives the dungeon one meaningful action or applies the printed consequence.

The first two Scenes have target 9. The target rises by 1 after every two newly revealed Scenes, to a maximum of 15. A Quest finale is 1 point harder than an ordinary Scene at the same depth, without exceeding 15. The sequence keeps early improvisation permissive while opposition, dwindling Light, injury, and finale defenders provide the later pressure.

Conquest means the Scene’s active problem durably stops controlling passage or use. Each active adventurer gains one Skill Token. Reveal the Scene’s one Quest or Loot reward, if present. Opportunity Scenes begin conquered and do not award conquest tokens.

Active creatures block ordinary departure. The party may defeat, negotiate with, drive off, sneak past, or otherwise bypass them through the fiction. Bypassed creatures remain present and may pursue according to their Instinct.

## Monster sources

### Printed

Ordinary monsters whose identity defines a situation are printed directly on the Scene with number, HP, Defense, Instinct, and Wound. Their exact placement can be marked on the floorplan.

### Random

Monster-agnostic Scenes draw from the shuffled random Monster deck. Examples include Sleeping Monster, Occupied Beast Pens, The Monster on the Throne, and an ambush beyond a blind corner.

The random deck contains only creatures that can enter or function in essentially any Scene. Quest setup can add more thematic creatures, such as extra goblin patrols during a warband raid.

### Boss

Quest finale Scenes place named cards from a set-aside Boss pile. Securing the objective and conquering the surrounding Scene are separate outcomes.

## Light and travel

A fresh Torch carries 12 Light tokens. Unless the current Scene is permanently illuminated, spend 1 Light to enter a new Scene, move to one adjacent known Scene, rest, search, treat a Wound, or illuminate permanent fixtures.

At 0 Light, the party may still enter a new Scene, move to an adjacent known Scene, or search. Those actions continue in darkness and every uncertain check has disadvantage. Resting, treating a Wound, and igniting permanent fixtures require either 1 portable Light or a permanently illuminated Scene. Combat actions do not ordinarily spend Light.

When entering a conquered dark Scene during backtracking, roll a d6. On a 1, draw a random Monster through the nearest plausible exit and stop movement. Permanently lit Scenes suppress this draw.

Persistent terrain remains after conquest. A secured rope, lowered bridge, drained channel, cleared route, or opened gate can permanently remove its uncertainty.

## Rest and search

Adventurers with an active Wound have disadvantage on checks, as does any adventurer acting in darkness. Lost HP alone does not cause disadvantage. The check dialog applies those rules by default while allowing an explicit override for exceptional fiction.

In a conquered Scene without an active threat, spend 1 Light to restore living adventurers to full HP. Wounds and Scars remain. Permanently illuminated Scenes waive this Light cost.

Each conquered Scene can be searched once. Spend 1 Light, choose a narratively applicable attribute, and check against the Scene target. Success reveals one Loot card; failure exhausts the search without Loot. This is separate from the Scene’s automatic reward.

## Mapping collisions

Preserve the card’s shape and square scale. When a new floorplan would overlap existing geometry, first rotate it, then extend the connecting corridor, create a shared wall or loop, or move it to another sheet or dungeon level. The web app performs the same placement automatically and keeps door directions aligned.

## Content guardrails

- Author complete actionable Scenes, not disconnected nouns.
- A quiet Scene must still provide navigation, information, atmosphere, safety, or opportunity.
- Any random-monster instruction must work with the entire random Monster deck.
- Terrain that matters after conquest belongs to the Scene itself.
- Quest-specific architecture and defenders belong to the Quest’s finale Scene.
- The web app may automate shuffling, rotation, and bookkeeping, but it must never depend on hidden compatibility metadata unavailable to physical players.