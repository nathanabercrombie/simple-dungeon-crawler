# Playtest 002: The Reliquary Thief

## Purpose

Run one lone adventurer through the first three rooms of [Dry Run 001](../001-haunted-tomb/README.md) to test normal monster attacks, HP recovery, Wounds, Skill Tokens, treatment, persistent traversal, known-room danger, light use, and extraction.

This is a reproducible rules playtest. No failed or unfavorable result was rerolled.

## Setup

- **Seed:** 20260401
- **Site fixture:** rooms 1–3 of *The King Who Was Buried Twice*
- **Mode:** one adventurer
- **Starting Skill Tokens:** 1
- **Chosen additional item:** one medkit, selected deliberately so treatment could be tested
- **Initial light assumption:** one torch lasting six exploration turns
- **Revised light fixture:** two torches lasting six exploration turns each

The one-torch assumption was rejected during the test because the accepted additional traversal costs made safe progress through rooms 1–2 and extraction impossible. The run continued with two identical torches so the complete route could be tested. Neither quantity nor duration is an accepted rule.

Other temporary rulings:

- the exploration turn for entering a new room and every persistent traversal crossing were charged separately, following the current written rule;
- terrain required a check only when pressure made failure meaningful;
- lighting the replacement torch did not itself consume an exploration turn;
- leaving the site from the entrance room did not consume another turn;
- room-resolution actions used combat-scale time unless their fiction clearly required an exploration turn.

## Generated adventurer

The character was left unnamed and is identified here as **the Reliquary Thief**.

| Component | Roll | Result |
| --- | ---: | --- |
| Signature gear | d66 = 13 | Maul; Strength +3; 2 damage against Brittle creatures |
| Burden and armor | d12 = 4 on Strength table | Stone-backed; Agility −2; Mind +0; Stable and Reinforced |
| Past | d20 = 16 | Thief from a Temple Reliquary, linked to Mind for a +2 total |
| Knack | d66 = 12 | Stone Listener, costing 2 Skill Tokens |
| Additional item | chosen | Single-use medkit |

Reinforced stone armor increased maximum HP from 2 to 3. Stable prevented ordinary forced movement. The Past cost 1 Skill Token to invoke. The maul's **Concuss** technique cost 1, but was never useful against the low-HP threats encountered.

## Threat interpretations

The generated room fiction was mapped to existing Haunted Tomb examples rather than inventing favorable statistics.

| Room | Threat | Defense | HP | Wound |
| ---: | --- | ---: | ---: | --- |
| 1 | Wailing choir | Standard 12 | 2 | Disoriented; treated Scar reduces Mind |
| 2 | Bone scuttlers; spectral doubles remained a terrain complication | Standard 12 | 1 | Gnawed; treated Scar reduces Strength |
| 3 | Accusing poltergeist, using mourning-shade statistics | Hard 15 | 1 | Soul-Chilled; treated Scar reduces Mind |

## Raw action rolls

| Situation | Roll | Result |
| --- | ---: | --- |
| Restore the drowned vigil with Temple Reliquary Past | d20 5 + 2 = 7 vs 12 | Failure |
| Maul attack against wailing choir | natural 20 + 3 | Critical success; 2 damage |
| Cross room 2 pit bridge under pressure | d20 14 − 2 = 12 vs 12 | Success |
| Maul attack against bone scuttlers | d20 13 + 3 = 16 vs 12 | Success; 2 Brittle damage |
| Room 1 danger while traveling toward room 3 | d6 = 3 | No new danger |
| Pin room 3's haunting anchor with the bier | d20 7 + 3 = 10 vs 15 | Failure |
| Expose the substituted remains with Temple Reliquary Past | d20 17 + 2 = 19 vs 15 | Success |
| Room 1 danger during extraction | d6 = 4 | No new danger |

## Play sequence

### Room 1 — Drowned Vigil

Entering the room consumed turn 1. Crossing its flooded channel consumed turn 2.

The Reliquary Thief spent their starting Skill Token to restore the vigil using knowledge from their Past. The check failed. The wailing choir was able to attack and automatically dealt 1 damage, reducing HP from 3 to 2.

The adventurer attacked with the maul and rolled a natural 20. The attack dealt its normal 1 damage plus 1 critical damage, defeating the 2 HP choir. Room 1 was conquered, HP returned to 3 after the danger ended, and the adventurer gained 1 Skill Token. The Book of Last Rites was taken without an inventory-capacity check.

### Room 2 — Bridge of Borrowed Faces

Entering the room consumed turn 3. Crossing the pit bridge under pressure consumed turn 4 and required an Agility check. Despite Agility −2, the total met Standard 12 exactly.

The maul attack succeeded. Bone scuttlers were treated as Brittle, so the attack dealt 2 damage and defeated the 1 HP group. Room 2 was conquered and the adventurer reached 2 Skill Tokens. The saint-bone charms and Quest lead were recovered.

### Travel to room 3

Recrossing room 2's pit bridge consumed turn 5. Traveling into conquered room 1 consumed turn 6 and triggered its d6 danger roll; a 3 caused no danger. The first torch expired.

The second torch was lit. Recrossing the flooded channel consumed turn 7. Entering room 3 consumed turn 8, and bridging the ring pit consumed turn 9.

### Room 3 — The Accusing Ring

The adventurer first tried to use the counterweighted bier to pin the haunting's anchor. The Strength check failed, allowing the poltergeist to attack automatically and reduce HP from 3 to 2.

The adventurer then spent 1 Skill Token to invoke the Temple Reliquary Past, identified the mismatched royal grave goods and substituted remains, and succeeded against Hard 15. This durably answered the poltergeist's accusation without destroying it. Room 3 was conquered, HP returned to 3, and its Skill Token reward brought the adventurer back to 2.

### Extraction

Recrossing the ring pit consumed turn 10. Travel into room 1 consumed turn 11; its danger roll of 4 caused no new danger. Crossing the flooded channel to the entrance consumed turn 12. The second torch expired as the adventurer exited.

## Exploration-turn ledger

| Cost | Turns |
| --- | ---: |
| Enter three new rooms | 3 |
| Known-room travel | 2 |
| Persistent traversal crossings | 7 |
| **Total** | **12** |

Persistent traversal consumed more light than new-room generation and known travel combined. There was no spare light for a new danger, lengthy search, natural 1, treatment, or alternate route.

## Controlled Wound and medkit drill

The main run never produced a Wound, so a separate controlled drill tested the procedure without claiming that the playthrough generated this state.

The Reliquary Thief was placed at 0 HP with the wailing choir able to attack. Its automatic damage caused a **Disoriented Wound**. The active Wound imposed disadvantage on an emergency self-treatment check.

For the drill, dangerous treatment used Mind against Standard 12. The next seeded rolls were 15 and 13; disadvantage retained 13, and Mind +0 produced a success. One exploration turn passed, the medkit was consumed, the Wound became a Scar, and Mind fell from +0 to −1. The adventurer remained at 0 HP because treatment does not restore HP.

The drill exposed an important lethality edge: if emergency treatment at 0 HP fails while a monster can attack, the dungeon can immediately deal another Wound. That second active Wound kills the adventurer. A successful treatment removes the first active Wound but does not make the adventurer safe from being wounded again.

The Standard 12 Mind check was a test ruling, not an accepted treatment difficulty or required attribute.

## What worked

### Automatic monster damage was fast and legible

Each failed room action immediately cost 1 HP without a second roll or nested handoff. Position still mattered: the monsters could attack because each failed action occurred within their reach or influence.

### Renewable HP separated encounters cleanly

The adventurer took one hit in rooms 1 and 3 but recovered after each challenge was durably resolved. The 3 HP Reinforced build felt resilient without negating the threat of repeated failure.

### Different solutions used the same action economy

Room 1 shifted from a failed rite to combat. Room 3 shifted from physical control to exposing the tomb's fraud. Both failures granted the dungeon the same meaningful opening.

### Skill Tokens created real sequencing decisions

The starting token funded an early Past attempt. Conquest rebuilt the pool, and the room 3 Past invocation competed with Stone Listener and the maul technique. Stone Listener never became attractive enough to spend 2 tokens on during this short route.

### Inventory required almost no administration

The medkit, Book of Last Rites, saint-bone charms, and quest information could be recorded directly. No capacity calculation interrupted play.

## What remains uncertain

### The traversal charge is ambiguous and extremely expensive

The current wording charges an additional turn every time a persistent feature is crossed, including the first visit. The original design discussion may instead have intended the new-room turn to include initial traversal, with the room consuming its own turn only when crossed again during known-room travel.

Under the tested reading, seven of twelve turns came from persistent features. Clarifying this point should precede light-duration balancing.

### Starting light remains undefined

One six-turn torch could not support the route. Two expired exactly at extraction despite no danger result, natural 1, search, or treatment. This created strong pressure, but there is not yet enough evidence to decide whether two six-turn torches, one longer light source, or a different traversal reading is correct.

### Wound frequency was not tested naturally

Only two monster attacks occurred in three rooms, separated by HP recovery. The controlled drill verified the procedure but did not measure how often Wounds arise in ordinary play. Additional seeds or a deliberately combat-heavy fixture are required.

### Reawakened-room danger did not trigger

Both d6 danger rolls were safe. The test therefore measured the time and probability procedure but not how a newly dangerous conquered room should be generated or resolved.

### Exact terrain effects remain necessary

The pit bridge received a pressured Agility check, while the flooded channel and ring pit mainly cost time. These were workable judgments, but falling, cover, forced movement, deep water, and elevation still need concise defaults.

## Recommended next decisions

1. Clarify whether a new room's entry turn includes its first persistent traversal.
2. Define a provisional starting light supply and duration after that clarification.
3. Define concise default effects for pits, water, rubble, balconies, and forced movement.
4. Run several shorter combat seeds to measure natural Wound and medkit frequency.