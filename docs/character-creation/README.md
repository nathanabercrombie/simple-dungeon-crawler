# Procedural Character Creation

## Goals

- Create a playable adventurer with a few fast table rolls.
- Make attributes, signature gear, protection, and drawbacks tell one coherent story.
- Use the fixed +3, +0, and −2 array without assigning it as a separate optimization step.
- Work equally well when generating one adventurer or an entire solo-controlled party.
- Leave enough player interpretation to turn a generated package into a distinct person.

## Proposed two-roll spine

An intentionally oversized [d66 Signature Gear candidate catalog](signature-gear/README.md) contains 36 entries for cutting and combination.

Three oversized [d12 Burden and Armor candidate tables](armor/README.md) contain 36 keyed packages for cutting and combination.

An oversized [d66 Knack candidate catalog](knacks/README.md) contains 36 concrete 2-Skill-Token personal abilities.

### 1. Roll signature gear and the +3 attribute

Roll once on a **Calling** or **Signature Gear** table. The result supplies:

- a weapon, magical implement, or other primary problem-solving tool;
- the attribute set to +3;
- that item's distinctive benefit;
- potentially the seed of a token-powered special ability.

The table should contain an even spread of Strength, Agility, and Mind packages.

| Example result | +3 attribute | Identity |
| --- | --- | --- |
| Greatsword | Strength | Risky two-damage attacks |
| Sword | Strength | Parrying and extra Hit Protection |
| Maul | Strength | Disorientation and shattering Brittle foes |
| Bow | Agility | Ranged attacks |
| Dual daggers | Agility | Conditional advantage and concealment |
| Whip | Agility | Control at reach |
| Wand or rod | Mind | Precise ranged magical attack plus inscribed powers |
| Sacred relic, censer, or spirit bell | Mind | Wards, banishment, and power against supernatural foes |
| Alchemist's satchel | Mind | Bombs, acids, smoke, and monster-specific preparations |
| Rune staff or hexing focus | Mind | Curses, disorientation, and magical control |
| Familiar or command implement | Mind | Project action through a trained or bound creature |

“Signature gear” is broader than “weapon.” A Mind-focused adventurer should have an implement that enables a basic 1-damage attack and also defines the style of their special abilities.

A **spellbook is not a weapon**. It contains token-powered spells but does not provide a basic attack. A spellbook user still needs a wand, staff, dagger, or another implement if they want a standard attack.

### 2. Roll burden, protection, and the −2 attribute

Roll on a **Burden** table keyed to the +3 attribute. It supplies:

- one of the other two attributes as −2;
- armor, clothing, a ward, or another defensive tool;
- a negative trait or complication explaining the weakness.

The remaining attribute becomes +0 automatically.

Examples:

- Strength +3 and **Bulwarked**: heavy armor, Agility −2, Mind +0.
- Strength +3 and **Reckless**: light armor, Mind −2, Agility +0.
- Agility +3 and **Slight**: leather armor, Strength −2, Mind +0.
- Agility +3 and **Impulsive**: light protection, Mind −2, Strength +0.
- Mind +3 and **Frail**: warded robes, Strength −2, Agility +0.
- Mind +3 and **Ritually Encumbered**: ceremonial armor, Agility −2, Strength +0.

The drawback and protection should form a package rather than claiming that armor literally causes every weakness. Heavy armor can explain low Agility; a haunted, reckless, dogmatic, or disoriented history can explain low Mind while also pointing toward appropriate lighter gear.

## Free-form skills

Each adventurer receives two different character-defining features:

1. **Past:** a former trade, culture, disaster, allegiance, or strange upbringing. It remains a free-form +2 skill that costs 1 Skill Token to invoke.
2. **Knack:** a specific, rules-defined personal ability that costs 2 Skill Tokens to activate.

Starting characters therefore have one free-form skill and one personal special ability rather than two free-form skills.

### Draft Past table (d20)

A Past answers: **What dangerous or unusual life taught you this?**

| d20 | Past |
| ---: | --- |
| 1 | Former grave robber |
| 2 | Caravan guard from the salt road |
| 3 | Assistant to a plague surgeon |
| 4 | Condemned mine laborer |
| 5 | Runaway monastery novice |
| 6 | Poacher in the royal forest |
| 7 | Scavenger from a broken siege |
| 8 | Escapee from a hidden cult |
| 9 | Village undertaker |
| 10 | Smuggler through forgotten tunnels |
| 11 | Retainer to a witch hunter |
| 12 | Disgraced duelist |
| 13 | Guide to the city sewers |
| 14 | Standard-bearer from a lost battle |
| 15 | Apprentice to an apothecary |
| 16 | Thief from a temple reliquary |
| 17 | Ferryman on a haunted river |
| 18 | Keeper of dangerous beasts |
| 19 | Assistant to an obsessive mapmaker |
| 20 | Sole survivor of a failed expedition |

### Draft Knack prompts (d20)

A Knack answers: **What specific thing do you do uncannily well?** Each prompt would need a concrete 2-token effect rather than functioning as a +2 skill.

| d20 | Knack |
| ---: | --- |
| 1 | Listens through stone and timber |
| 2 | Notices false seams and hollow spaces |
| 3 | Works knots one-handed |
| 4 | Holds their breath for an unsettlingly long time |
| 5 | Calms frightened animals |
| 6 | Recognizes poison by smell |
| 7 | Moves quietly in cumbersome gear |
| 8 | Finds the weak point in doors and barriers |
| 9 | Never loses direction underground |
| 10 | Palms and conceals small objects |
| 11 | Keeps their footing on treacherous ground |
| 12 | Recognizes old heraldry and forbidden symbols |
| 13 | Mimics voices and common sounds |
| 14 | Wakes at the slightest disturbance |
| 15 | Improvises tools from scrap |
| 16 | Functions through pain and exhaustion |
| 17 | Reads lips at a distance |
| 18 | Throws almost anything accurately |
| 19 | Carries far more than their build suggests |
| 20 | Reconstructs events from tracks, blood, and debris |

### Linking a rolled Past

After rolling a Past, choose one attribute and explain the phrase through that lens. The link is permanent unless character advancement changes it.

- **Former Grave Robber (Agility):** stealth, climbing, and handling tomb mechanisms.
- **Former Grave Robber (Mind):** burial customs, crypt layouts, and recognizing funerary hazards.
- **Keeper of Dangerous Beasts (Strength):** restraining and physically handling creatures.
- **Keeper of Dangerous Beasts (Mind):** reading behavior and calming or directing creatures.
- **Improvises Tools from Scrap (Agility):** quick, precise construction.
- **Improvises Tools from Scrap (Mind):** devising the right mechanism or substitute.

The phrase applies only when both its fictional scope and its chosen attribute fit the attempted action.

## Ability architecture

### Signature gear

Signature gear has up to three layers:

1. **Basic function — free:** its ordinary attack, range, passive defense, or fictional capability.
2. **Technique — usually 1 token:** a tactical effect closely tied to using the item.
3. **Greater technique — 2 or 3 tokens:** a rarer multi-target, restorative, or encounter-changing effect. These may be printed on exceptional gear, learned through advancement, or discovered in play rather than appearing on every mundane weapon.

Examples:

| Gear | Free function | Token-powered ability |
| --- | --- | --- |
| Greatsword | Risky two-damage basic attack | **Whirlwind (2):** make one attack against the highest Defense among adjacent enemies; on success, deal 1 damage to every adjacent enemy |
| Whip | Reach; may forgo ordinary damage for simple positioning | **Disarm (1):** after a successful whip attack, spend 1 token to deal damage and disarm a suitable target |
| Maul | Disorients targets and deals extra damage to Brittle foes | **Groundbreaker (2):** strike the floor or structure to affect everyone in a nearby area |
| Wand | Basic ranged 1-damage Mind attack | Carries one or more inscribed powers with costs from 1 to 3 |

### Past

Past is the adventurer's one free-form +2 skill. It costs 1 Skill Token, is spent before the roll, and never stacks with another skill.

### Knack

Knack is a personal, non-item ability costing 2 Skill Tokens. It should do something definite that an ordinary check cannot guarantee.

Example conversions:

- **Never Lost Below (2):** learn the direction of the nearest known exit or previously visited room without rolling.
- **Weak-Point Eye (2):** after observing a creature or barrier, the next successful attack against it deals +1 damage.
- **Voice Thief (2):** perfectly reproduce a voice or sound heard during this expedition.
- **Beast-Quiet (2):** calm an ordinary frightened or hostile beast unless it is injured or magically compelled.

### Spellbooks

A spellbook is found or starting ability gear. It contains specific spells but has no basic attack of its own. A spell can cost from 1 to 3 Skill Tokens.

Example:

- **Cure Wounds (3):** remove one active Wound without creating a Scar, remove its acute effects, and restore the target to full HP.

This consumes a full three-token pool and bypasses the normal permanent cost of treatment, making it appropriate as a top-tier spell.

### Phrase quality test

A useful phrase:

- suggests several concrete applications;
- still excludes many ordinary actions;
- reveals something about the character;
- can be judged in good faith by a solo player;
- does not simply mean “good at combat,” “lucky,” or “knows everything.”

## Why linked packages are promising

- Two rolls completely assign the +3/+0/−2 array.
- Gear and attributes support each other immediately.
- Negative attributes feel like character premises rather than arbitrary penalties.
- Mind-focused characters can enter the same combat economy through implements instead of conventional weapons.
- The web app can generate a complete package while every component remains reproducible with physical dice.

## Risks and open questions

- Packages can become disguised classes if they prescribe too much.
- A random result must not create a nonfunctional combination.
- Armor benefits need definition before burden packages can be balanced.
- Spellbooks and other Mind implements need a basic attack and token-powered ability model.
- The table needs a choice valve: roll once, roll twice and choose, or freely select.
- Party generation needs duplicate-handling guidance without making repeated concepts impossible.

## Additional starting item and inventory

After receiving the gear supplied by character creation, each adventurer gains one additional useful item. The player may choose it or roll it from a short expedition-item table. Example items include a medkit, rope, lantern, crowbar, climbing tools, or flask of oil.

There is no numerical carrying capacity, slot inventory, or encumbrance total. Adventurers can keep useful items found during play, subject to ordinary fictional limits for enormous, bulky, or awkward objects. Consumables are crossed off after use; durable items remain until lost, broken, spent, or abandoned.

A medkit is single-use. Treating a Wound takes one exploration turn, spends 1 Light unless the room is permanently illuminated, and consumes the medkit on success. Treatment in safety requires no check; treatment during immediate danger does. A failed dangerous treatment leaves the Wound and medkit intact unless the fiction specifically ruins the supply, and control passes to the dungeon normally.

The party begins each expedition with one shared torch holding 12 Light tokens. The torch is expedition equipment rather than an adventurer's additional item. Spend 1 Light to move to an adjacent room, enter a new room, rest, search, treat a Wound, or permanently illuminate suitable fixtures. These actions spend no portable Light in a permanently illuminated room. Additional torches, lanterns, or oil can be selected as additional items or found during play.

The burning torch occupies one hand. Its bearer cannot use a bow or other two-handed equipment until another adventurer takes the torch or it is placed somewhere that continues to illuminate the situation.

When generating a party, the first adventurer is the default torch bearer and therefore generates signature gear from the one-handed entries only. The same constraint applies to a lone adventurer. Other party members use the full gear table. Passing the torch later does not change anyone's equipment, but its new bearer cannot use two-handed gear while holding it.

The web companion resolves a concrete armor package from each adventurer's Primary and Weak attributes. The character card lists its Burden and exact armor rule. Maximum-HP bonuses from armor and weapons stack.

Every generated Gear technique and Knack includes its exact Skill Token cost and effect on the character card. A Past may be invoked for 1 Skill Token when it clearly applies to the current situation.

## Current build order

1. **Cut candidate catalogs:** reduce signature gear, Burden/Armor, Past, and Knack results to the desired table sizes and setting tone.
2. **Resolve protection rules:** choose which candidate armor vocabulary survives and define stacking with parrying, shields, and other HP benefits.
3. **Complete remaining starting kit:** establish rations, the expedition-item table, and any starting spellbook procedure.
4. **Generate sample adventurers:** create both lone heroes and parties entirely through the tables.
5. **Run a paper playtest:** test several rooms, fights, Wounds, treatment, and retreat before building the web generator.

The Knack catalog is drafted. Character-creation reduction and testing can pause while room-generation procedures are designed.

## Cairn comparison

### Cairn first edition

The official first-edition SRD generates attributes by rolling 3d6 in order for Strength, Dexterity, and Willpower, then permits swapping two. HP is 1d6. Starting armor, weapons, expedition gear, tools, trinkets, and bonus items come from separate random tables. This creates strong emergent combinations, but attributes and equipment are not inherently correlated.

Source: [Cairn First Edition SRD](https://cairnrpg.com/first-edition/cairn-srd/)

### Cairn second edition

Second edition begins by choosing or rolling one of twenty backgrounds. A background gives thematic starting gear and uses two d6 tables to distinguish the character's past and present with unusual items, skills, abilities, and setting hooks. Attributes are still rolled separately as 3d6 in order, with one optional swap, and HP is 1d6.

The most useful lesson is not a specific die formula. It is that each background acts as a small, flavorful character generator whose equipment implies history and whose sub-tables produce playable hooks.

Sources:

- [Cairn 2e character creation](https://cairnrpg.com/second-edition/players-guide/character-creation/)
- [Cairn 2e guidance for creating backgrounds](https://cairnrpg.com/second-edition/wardens-guide/creating-backgrounds/)
