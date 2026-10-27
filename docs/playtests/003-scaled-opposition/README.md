# Playtest 003: Scuttlers in Numbers

## Purpose

Test the accepted hostile-opposition floor of 2 total monster HP per active adventurer.

The test had two parts:

1. replay the first three rooms of Playtest 002 with the same seed and lone adventurer, but strengthen rooms 2 and 3 to the new 2 HP floor;
2. run a focused four-adventurer fight against eight 1 HP bone scuttlers, producing the required 8 total monster HP.

No unfavorable roll was rerolled. Temporary interpretations are recorded rather than treated as accepted rules.

## Part one: lone-adventurer replay

### Setup

- **Seed:** 20260401
- **Adventurer:** the same Reliquary Thief generated in Playtest 002
- **HP:** 3 from Reinforced stone armor
- **Attack:** Strength +3 maul
- **Light fixture:** two six-turn torches
- **Traversal:** current rule; initial traversal is included in new-room entry

The room opposition was:

| Room | Opposition |
| ---: | --- |
| 1 | One 2 HP wailing choir, unchanged |
| 2 | Two 1 HP bone scuttlers instead of one collective 1 HP threat |
| 3 | One 2 HP accusing poltergeist instead of a 1 HP threat |

### Rolls and results

| Situation | Roll | Result |
| --- | ---: | --- |
| Restore the room 1 vigil with the Temple Reliquary Past | 5 + 2 = 7 vs 12 | Failure; choir deals 1 damage |
| Attack the choir | natural 20 + 3 | Critical; 2 damage defeats it |
| Cross the room 2 bridge under pressure | 14 − 2 = 12 vs 12 | Success |
| Attack first bone scuttler | 13 + 3 = 16 vs 12 | Success; first scuttler defeated |
| Attack second bone scuttler | 10 + 3 = 13 vs 12 | Success; second scuttler defeated |
| Room 2 danger while backtracking | d6 = 2 | No danger |
| Room 1 danger while traveling to room 3 | d6 = 6 | No danger |
| Pin room 3's haunting anchor | 17 + 3 = 20 vs 15 | Success; room conquered without attacking HP |
| Room 3 danger during extraction | d6 = 4 | No danger |
| Room 1 danger during extraction | d6 = 4 | No danger |

### Outcome

The second room required two successful attacks instead of one. Both succeeded, so the additional scuttler created another opportunity for failure but caused no damage in this seed.

Room 3's increased HP did not matter because the counterweighted bier provided a successful noncombat resolution. This is intended: the hostile-opposition floor makes combat substantial without turning HP depletion into the only conquest method.

The adventurer suffered one hit in room 1, recovered after conquest, and received no Wound. They exited after seven exploration turns:

| Cost | Turns |
| --- | ---: |
| Enter three new rooms, including initial traversal | 3 |
| Recross room 2's bridge | 1 |
| Traverse room 1 toward room 3 | 1 |
| Recross room 3's ring | 1 |
| Traverse room 1 during extraction | 1 |
| **Total** | **7** |

The first six-turn torch expired before the final traversal. One replacement torch was necessary under this route and fixture, with five of the twelve combined light turns left unused.

## Part two: four-adventurer stress room

### Setup

- **Seed:** 20260402
- **Room:** Standard 12 pit bridge
- **Opposition:** eight separate 1 HP bone scuttlers
- **Total monster HP:** 8, satisfying 2 HP × four adventurers
- **Dungeon response:** after each failed attack, the scuttlers automatically damaged the adventurer whose failure created the opening
- **Player sequence:** rotate through the four adventurers in order
- **Scope:** combat only; bridge entry, light, and extraction were excluded

The generated party was:

| Adventurer | Signature gear and +3 | Protection | HP |
| ---: | --- | --- | ---: |
| 1 | Mind +3 alchemist's satchel | Bell-laden mail | 2 |
| 2 | Strength +3 flail | Reinforced stone armor | 3 |
| 3 | Agility +3 sabre | Scented beast-hide | 2 |
| 4 | Agility +3 hand crossbow and buckler | Scented beast-hide; Skirmisher readied | 3 |

Every basic attack therefore used +3 against Standard 12. No generated multi-target ability applied. Critical bonus damage could not spill from one 1 HP scuttler into another.

### Combat ledger

| Attack | Adventurer | Natural d20 | Result | Remaining scuttlers | Consequence |
| ---: | ---: | ---: | --- | ---: | --- |
| 1 | 1 | 14 | Success | 7 | — |
| 2 | 2 | 14 | Success | 6 | — |
| 3 | 3 | 2 | Failure | 6 | Adventurer 3: 2 → 1 HP |
| 4 | 4 | 20 | Critical success | 5 | One 1 HP target defeated |
| 5 | 1 | 13 | Success | 4 | — |
| 6 | 2 | 8 | Failure | 4 | Adventurer 2: 3 → 2 HP |
| 7 | 3 | 14 | Success | 3 | — |
| 8 | 4 | 10 | Success | 2 | — |
| 9 | 1 | 17 | Success | 1 | — |
| 10 | 2 | 3 | Failure | 1 | Adventurer 2: 2 → 1 HP |
| 11 | 3 | 1 | Critical failure | 1 | Adventurer 3: 1 → 0 HP; one extra exploration turn |
| 12 | 4 | 13 | Success | 0 | Fight ends |

The fight required eight successes across twelve attacks and generated four dungeon actions. Adventurer 3 ended exposed at 0 HP, Adventurer 2 ended at 1 HP, and no Wound occurred. When the fight ended, all HP refreshed, so the party carried no harm forward.

### Targeting counterfactual

The tested targeting rule damaged the adventurer whose failure created the opening. If the scuttlers had instead continued attacking the most exposed reachable adventurer, all four failures could plausibly have targeted Adventurer 3:

1. first hit: 2 → 1 HP;
2. second hit: 1 → 0 HP;
3. third hit: a Gnawed Wound;
4. fourth hit: a second active Wound and death.

The same attack rolls therefore range from no lasting harm to one death depending on fictional positioning and target selection.

## Findings

### The opposition floor fixed the one-roll hostile room

The lone Room 2 could no longer be conquered with one ordinary successful attack. The four-adventurer version required eight successes rather than remaining a 1–2 HP speed bump.

### More HP creates exposure, not guaranteed harm

The party stress room produced four automatic hits and left one adventurer at 0 HP, which was materially dangerous during play. Renewable HP erased all of that pressure when the final scuttler fell one roll later.

### Targeting now matters more than another small HP increase

Whether monsters attack the acting adventurer, the most exposed target, a random legal target, or a target dictated by behavior has a greater effect on Wounds and deaths than changing this encounter from eight to nine total HP.

### Fragile groups interact well with multi-target design

Eight separate creatures make Cleave, Whirlwind, Wide Arc, and similar abilities valuable. None appeared in the generated party, so the stress room measured the slowest ordinary one-target approach. A later test should include a multi-target specialist.

### Noncombat solutions remain valid

Room 3's 2 HP poltergeist was conquered through its physical anchor. Raising opposition did not create a sealed combat encounter.

## Recommended next decisions

1. Keep the 2 total HP per adventurer floor for further testing rather than raising it again immediately.
2. Define target-selection guidance from monster behavior and fictional exposure.
3. Decide whether reaching 0 HP should create any pressure that survives the immediate fight, or whether only Wounds should persist.
4. Run several seeds with average bonuses, multi-target abilities, and Hard defenses before changing HP or damage again.

## Post-test decision

Monster targeting was subsequently defined through creature-specific narrative Instincts. Bone scuttlers now swarm the first adventurer who harms their colony and remain committed until that target dies, escapes, or becomes unreachable. The distributed targeting used in this stress room remains the historical procedure tested, not the current scuttler behavior.