# Inspirations

This is an attribution and analysis log, not a commitment to reproduce every listed mechanic. We will identify the useful design lesson from each source and write original implementation and rules text.

| Game | Initial area of interest | Status |
| --- | --- | --- |
| *Four Against Darkness* | GM-less dungeon procedures, compact party management, room-by-room generation | To analyze |
| *Daggerheart* | Consequence-oriented resolution and turn-flow ideas; dual Hope/Fear dice considered but not adopted | Active influence |
| *Dungeons & Dragons* | Roll-high d20 checks, target numbers, and 2d20 advantage/disadvantage | Active influence |
| *2D6 Dungeon* | Solo dungeon crawling, procedural maps, event and encounter tables | To analyze |
| *Ironsworn: Delve* | Site themes/domains, progress-driven exploration, oracle-supported solo play | To analyze |
| *Ker Nethalas* | Lethal solo dungeon survival, resource pressure, procedural content | To analyze |
| *Maze Rats* | Concise rules and highly combinatorial random tables | To analyze |
| *Disciples of Bone & Shadow* | Solo dark-fantasy exploration and procedural campaign play | To analyze |
| *Mouseritter* | User-supplied title; likely *Mausritter*: inventory pressure, dangerous combat, compact procedures | Confirm title and analyze |
| *Shadowdark* | Real-time torch countdowns, dangerous darkness, urgency at the table | Active influence |
| *Clank!* | Player-generated noise, bag draws, and escalating dragon rage as a model for reactive dungeon threat | Deferred influence |
| *One Deck Dungeon* | Escalating delve difficulty and increasingly dangerous encounters | Active influence |
| *Into the Odd* / *Cairn* | HP as Hit Protection, fast recovery, and lasting harm beyond HP | Newly identified influence |

## Attribution practice

For each borrowed or adapted idea, record:

1. the source or sources;
2. the abstract mechanic or design lesson;
3. why it serves this game's goals;
4. how our implementation differs;
5. the playtest question it creates.

We will avoid copying expressive rules text, named setting material, distinctive table entries, or protected art and layout.

## Core-loop synthesis

The proposed expedition loop draws on broad design lessons from several sources:

- *Four Against Darkness* and *2D6 Dungeon*: exploration advances through repeatable, generator-driven dungeon turns.
- *Ironsworn: Delve*: a site is a structured objective whose danger and discoveries emerge during play rather than from a complete prepared map.
- *Ker Nethalas*: survival pressure and the decision to continue or retreat give exploration its tension.
- *Maze Rats*: compact procedures and combinatorial tables can create situations that demand player interpretation.
- *Mausritter* (assuming this is the intended title): limited carrying capacity can make preparation, treasure, and retreat part of one connected decision cycle.

These are conceptual influences only. The exact turn sequence, pressure model, site generation method, and reward structure remain to be designed and tested.

## Pressure-system synthesis

- From *Shadowdark*: a visible, real-time light countdown can make deliberation and exploration consume the same scarce resource. Solo play may require a clear pause rule so oracle and rules lookups do not create accidental difficulty.
- From *Clank!*: player choices can add personalized risk to a shared threat pool, while deeper progress increases the severity of each threat check.
- Proposed adaptation: keep **light** and **alert** separate. Light counts down predictably; alert rises responsively because of what adventurers do.

The implementation must work at a physical table without the web app. If tokens or a bag are used, the app may reproduce the same procedure rather than replace it.

Dungeon Alert is currently pinned for later. The *Clank!* analysis remains recorded, but no active procedure assumes that alert, noise tokens, or a threat bag exists.

## Turn-flow synthesis

The active proposal uses a single d20 and a binary handoff:

- success keeps control with the adventurers;
- failure hands control to the dungeon for one meaningful action by a monster, monster group, hazard, or the environment;
- after the dungeon acts, control returns to the adventurers.

This keeps the desired consequence-oriented flow while dropping the previously considered Hope/Fear parity reading and its associated metacurrencies. Treating a group as one threat preserves the quick handoff without requiring every creature to take a separate turn.

The adventurer side uses shared, fluid control: after success, any adventurer may act, including the same one again. This develops the free-flowing side of the *Daggerheart* inspiration while omitting its dual-die outcome categories. Unlike round-based *Dungeons & Dragons* initiative, there is no requirement that each participant act once before the cycle repeats.

## Core check synthesis

The core check uses the familiar roll-high structure of modern d20 games: `d20 + bonus` must meet or exceed a target number. Advantage and disadvantage use the *Dungeons & Dragons* 5e method of rolling 2d20 and retaining the higher or lower die.

As in that model, advantage and disadvantage are binary: repeated sources do not add dice, and the presence of both produces a normal roll. This prevents circumstantial modifiers from becoming a separate counting exercise.

Natural 20 and natural 1 retain the celebratory and catastrophic feel associated with d20 games. The natural 1 also advances the exploration clock, connecting critical failure to the light pressure inspired by *Shadowdark*. It does not grant the dungeon an additional action beyond the normal failure handoff.

The character-sheet presentation is optimized for solo party control. A listed skill bonus already contains its linked attribute, so the player adds one printed number rather than recalculating attribute plus training for each adventurer. Unskilled actions use the attribute alone.

The initial difficulty ladder—9 Easy, 12 Standard, 15 Hard, and 18 Extreme—follows *Shadowdark*'s compact DC scale. Standard 12 is the fallback for improvised GM rulings and solo checks. The values remain subject to probability testing once character bonuses are defined.

## Three-attribute structure

The game uses three broad attributes: Strength, Agility, and Mind. This follows the compact physical/physical/mental pattern seen in games such as *Maze Rats* and *Mausritter*, while using linked skills to distinguish perception, knowledge, social ability, resolve, and magic within the broad mental category.

Folding Wits and Will together reduces character-sheet load for solo party control. It also makes skill selection important: a strong base mind does not by itself grant equal expertise in every mental field.

Unlike traditional *Dungeons & Dragons* ability scores and derived modifiers, this game records only the number actually added to a check. Direct bonuses support the same roll-high d20 structure with less character-sheet translation, an important benefit when one player controls several adventurers.

Starting adventurers assign +3, +0, and −2 among the three attributes. This intentionally creates more polarized competence than a tightly clustered modifier array: party members gain obvious niches, while a lone adventurer must use equipment, skills, special abilities, and alternate approaches to work around a pronounced weakness. The free-form problem solving emphasized by traditional dungeon play is therefore a necessary counterpart to the numerical spread.

## Past and Knack synthesis

The Past system draws on *Daggerheart* Experiences: players write a short phrase describing meaningful expertise instead of selecting an entry from a comprehensive skill list. Each adventurer begins with one Past.

This game's implementation links the Past to one of its three attributes and gives it a fixed +2 training bonus. The character sheet prints the resulting total, preserving the earlier decision that it is ready to roll without reconstructing its arithmetic. Invoking a Past costs one personal Skill Token, echoing the resource-gated use of Experiences in *Daggerheart* while tying the resource's replenishment to conquering rooms.

Knack occupies a different role: it is a concrete personal ability costing 2 Skill Tokens, not a second free-form bonus. This separates flexible fictional expertise from guaranteed exceptional capability.

## Hit Protection, Wounds, and Scars

The proposed harm model belongs to the *Into the Odd* lineage also reflected in *Cairn* and *Mausritter*: HP represents short-term protection and serious harm affects attributes after that protection is exhausted.

This game's adaptation fully replenishes HP after a fight. Damage does not overflow: the hit that reaches 0 HP only exposes the adventurer, and a later hit while already at 0 causes a source-specific Wound.

An active Wound gives disadvantage on every check plus an effect determined by its source; a second active Wound kills. Treatment converts the acute Wound into a named Scar that reduces a specified attribute by 1. This creates an original harm sequence—Hit Protection, exposure, acute Wound, treatment, lasting Scar—while retaining the readable short-term protection and post-HP danger of the *Into the Odd* lineage.

The accepted adventurer scale is 2 HP with ordinary monster attacks dealing 1 damage. This emphasizes the compact, deterministic tracking found in minimalist dungeon games and moves enemy identity into Wound effects rather than damage dice.

The accepted monster model deliberately diverges from the automatic-hit attacks of *Into the Odd*, *Cairn*, and *Mausritter*. Adventurers make d20 attack checks because success and failure control turn ownership in this game. A success normally deals 1 fixed damage; monsters have small HP values indicating how many successful attacks they can sustain. The roll-high attack and Defense target retain a *Dungeons & Dragons*-like shape without its larger HP and damage arithmetic.

Weapon identity follows the fiction-first equipment spirit of minimalist dungeon games: default damage stays fixed while each weapon changes what an adventurer can do. Range, parrying, reach, cleaving, concealment, armor penetration, and narrow creature vulnerabilities carry more identity than a ladder of damage dice.

The maul's increased damage against skeletons also borrows a broad fantasy-game convention—damage types matter against creature composition—without requiring a universal resistance chart. Such exceptions should appear directly on the weapon or monster entry.

## Cairn character creation

The official *Cairn* first-edition procedure rolls its three attributes independently, allows two to be swapped, rolls HP, and then generates armor, weapons, gear, tools, trinkets, and bonus items from separate tables. This creates unexpected combinations, but stats and gear are not directly linked.

*Cairn* second edition makes backgrounds more cohesive. A chosen or rolled background provides thematic gear and two small d6 tables that add past and present details such as unusual items, abilities, skills, and setting hooks. Attributes are still rolled separately.

The proposed adaptation goes further by correlating the results: signature gear sets the +3 attribute, while a keyed burden/protection result sets the −2 attribute. The useful *Cairn* lesson is that a compact package and a pair of small tables can imply history, capability, equipment, and adventure hooks without requiring a class.

The draft Past and Knack tables apply that lesson to this game's two free-form skills. Past establishes a bounded former life; Knack establishes one vivid, repeatable talent. Unlike a fixed skill list, the player links each rolled phrase to an attribute and explains that interpretation, preserving the player-authored quality inspired by *Daggerheart* Experiences.

The adopted model separates those two results. Past retains the free-form, resource-gated +2 structure inspired by *Daggerheart* Experiences. Knack is a concrete 2-token special ability. Signature gear supplies free fictional capability and may grant item-specific techniques, while spellbooks hold abilities without masquerading as weapons. This also draws on *Cairn*'s principle that carried equipment determines capability.

The oversized signature-gear draft uses a d66 table, a common old-school procedural format, to hold 36 candidates while remaining rollable with ordinary six-sided dice. Its entries combine fiction-first equipment permissions with explicit token-powered techniques. This catalog is raw design material rather than an accepted list.

The Burden and Armor drafts adapt *Cairn*'s equipment-driven protection cautiously. *Cairn* armor subtracts damage, but permanent reduction cannot be copied into a game where an ordinary hit deals only 1 damage. Candidate armor instead uses one-point HP increases, once-per-fight Guards, conditional resistance, insulation from a Wound's extra effect, and fictional permissions. Keying the table to the +3 attribute preserves the project's stronger correlation between equipment and stats.

The next character-generation component is the Knack catalog. Its resource cost follows the project's *Daggerheart*-influenced ability economy, but each effect should be written for this game's room exploration, oracle use, fixed damage, and Wound procedures. Knacks should remain personal capabilities rather than duplicating signature-gear techniques.

The completed draft catalog spreads Knacks across exploration, survival, social leverage, defense, offense, and occult/oracle interaction. The last category anticipates *Ironsworn*-style solo support while leaving exact oracle mechanics open.

## Room-generation direction

The first room-generation fork combines three major influences:

- *Four Against Darkness* and *2D6 Dungeon* support literal, emergent floorplans with room-by-room content.
- *Ironsworn: Delve* supports abstract progress through a themed and dangerous site.
- *Maze Rats* supports compact combinatorial tables whose results become more than the sum of their columns.

The selected model is a literal floorplan on a square grid, following the mapping emphasis of *Four Against Darkness* and *2D6 Dungeon*. The design still borrows theme-driven room functions and dangers from *Ironsworn: Delve* and combinatorial detail from *Maze Rats*, but abstract-node and hybrid mapping were not selected.

Authored footprint templates include tactically meaningful internal terrain rather than only rectangles. Pillars, pits, balconies, bridges, elevation, and similar elements combine the exact mapping emphasis of *Four Against Darkness* and *2D6 Dungeon* with the compact authored encounter spaces of board-game dungeon crawlers.

The first twenty templates make that influence concrete through exact ASCII grids. Their geometry is authored, but contents remain modular and are supplied by Domain, Theme, Challenge, and Opportunity. This separates the spatial replay value of a room footprint from its narrative use.

The complete default escalation range requires fifty templates. Expanding the catalog to 50 continues the literal mapping influence of *Four Against Darkness* and *2D6 Dungeon* while allowing later entries to introduce the severe terrain and vertical complexity associated with deeper board-game dungeon spaces.

Templates 21–50 complete that range with Hard and Extreme spaces: chasms, suspended causeways, machinery, flooded terraces, prison mechanisms, balconies, lava channels, void lattices, and vertical nexuses. Their exact contents remain modular rather than authored encounters.

The opening templates favor multiple onward exits, emphasizing branching exploration over a mostly linear chain of rooms. Collision handling remains a human mapping judgment rather than adding another procedural table.

The accepted macro-grid takes a broader structural lesson from *Clank!*: exploration occurs inside a bounded network with branches, loops, and a finite extent. This game fills that network procedurally with exact-grid room templates rather than using *Clank!*'s fixed board. Compact, standard, and sprawling sector grids pair with faster or slower escalation values.

The hybrid objective example also borrows the broad *Clank!* rhythm of reaching a valuable deep objective and then physically escaping. Revelation markers add an *Ironsworn: Delve*-like progress dimension: discoveries made during exploration weaken or reinterpret the final threat, but they do not create an absolute gate against free-form solutions.

Quest placement now uses the same escalating attrition formula as room templates. This combines *One Deck Dungeon*-style increasing danger, *Clank!*-like deep objectives and extraction, and *Ironsworn: Delve*-like progress through meaningful discoveries. Unlike an abstract progress track, every quest element and Heart occupies an actual generated room and has a concrete fictional identity.

Dry Run 001 validated the broad synthesis in one seed: literal mapping produced a bounded branching site, modular Tomb and Haunted prompts remained coherent, and escalating Quest rolls created leads, two concrete elements, a Heart, and an optional superior resolution. It also showed that extraction, monster actions, treatment, and terrain defaults must be defined before the procedure can become a playable dungeon rather than only a generator.

The active d20 roster adds an escalation structure inspired by the increasing danger of *One Deck Dungeon*. Twenty unique room templates are initially available; each used result is crossed off and its d20 face is filled by the next, generally harder master entry. This produces draw-without-replacement variety and gradual escalation while still allowing old shallow rooms to linger or a newly unlocked severe room to appear immediately.

That roster was replaced by a sliding roll: `d20 + (Escalation × rooms generated)`, rerolling used templates. The sliding minimum retires unvisited easy rooms as well as preventing repeats, producing more reliable escalation and greater variety. Escalation 2 is the default; sites can use 1 for a long gradual delve or 3 for a short brutal descent.

Each template's Danger Rank uses the same 9/12/15/18 ladder as action checks and becomes the default Defense or target for all threats in that room. This resembles level-based encounter escalation in dungeon games while avoiding a separate numerical subsystem.

The accepted site-identity procedure directly adapts the **Theme + Domain** structure of *Ironsworn: Delve*. Domain establishes the site's original function and physical vocabulary; Theme transforms it through a current condition or supernatural problem. This game's implementation feeds those results into literal room templates, Danger Rank, monster generation, traps, puzzles, treasure, and a future local generator rather than a Delve progress move.

Implementation is modular rather than pair-specific. A compact Domain card and compact Theme card each expose reusable fields; the universal Challenge and Opportunity procedure pulls only the fields needed for the current room. The Haunted Tomb vertical slice tests this with separate Tomb and Haunted cards rather than a bespoke table that must be rewritten for every combination.

Room content uses independent Challenge and Opportunity axes. This follows the combinatorial-table lesson of *Maze Rats*: two ordinary results become a more specific prompt when interpreted together. It also preserves room-by-room challenge generation from *Four Against Darkness* and *2D6 Dungeon* without forcing monsters, treasure, and secrets to be mutually exclusive results.

Official sources:

- [Cairn first-edition SRD](https://cairnrpg.com/first-edition/cairn-srd/)
- [Cairn 2e character creation](https://cairnrpg.com/second-edition/players-guide/character-creation/)
- [Cairn 2e background design guidance](https://cairnrpg.com/second-edition/wardens-guide/creating-backgrounds/)

## Room-conquest push and pull

Each newly generated room consumes one exploration turn, while conquering it grants each adventurer a Skill Token that may invoke a free-form skill or power a special ability. This creates a deliberate tension:

- the light countdown, inspired by *Shadowdark*, makes each new room a cost;
- ability-fueling tokens retain a small part of *Daggerheart*'s resource-powered character abilities without retaining Hope/Fear dice;
- room-by-room generation from *Four Against Darkness* and *2D6 Dungeon* gives both the cost of entry and reward for completion clear procedural boundaries.

The resulting synthesis makes entering a room an immediate risk and overcoming its challenge a source of growing power. “Conquest” means durably resolving the main challenge by any viable method, preserving the free-form problem solving associated with traditional dungeon play. Each adventurer receives a personal Skill Token, making the reward independent of how many humans control the party. Like ability-fueling resources in *Daggerheart*, these are spent to invoke free-form skills or activate special abilities rather than treated as an automatic power threshold. The abilities themselves will be original to this game.

Unlike a persistent character currency, unspent Skill Tokens vanish at the end of an expedition. This reinforces the push-your-luck structure found across solo dungeon crawlers: power accumulated in the dungeon helps with the current delve but cannot be safely farmed for a later one.

Each adventurer nevertheless begins an expedition with one fresh Skill Token. This ensures token-gated free-form skills and special abilities are available from the opening room while preserving the room-conquest replenishment cycle.

The personal Skill Token pool is capped at three. This adds a small resource-pressure decision reminiscent of inventory-focused dungeon games such as *Mausritter*: a resource at capacity has no value unless the adventurer creates room to gain more. Here the pressure encourages timely use of skills and special abilities rather than physical inventory management.

Special abilities cost one to three Skill Tokens according to their strength. This uses the entire three-token track as a visible power scale: routine techniques compete with free-form skill use at one token, while a three-token signature effect consumes a full pool. The room-conquest cycle determines how quickly those powerful effects become available again.
